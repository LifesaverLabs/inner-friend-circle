-- Emergency Dispatch Account System
-- Allows emergency services (police, fire, EMS, etc.) to register, get verified,
-- and access resident Door Key Tree information during emergencies.

-- Create enum for organization types
CREATE TYPE dispatch_organization_type AS ENUM (
  'police',
  'fire',
  'ems',
  'combined',
  'private_ems',
  'hospital',
  'crisis_center'
);

-- Create enum for verification status
CREATE TYPE dispatch_verification_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'suspended'
);

-- Create enum for access request status
CREATE TYPE dispatch_access_status AS ENUM (
  'pending',
  'approved',
  'denied',
  'expired'
);

-- Create enum for legal basis
CREATE TYPE dispatch_legal_basis AS ENUM (
  'consent',
  'exigent_circumstances',
  'court_order',
  'welfare_check'
);

-- Create enum for admin roles
CREATE TYPE admin_role_type AS ENUM (
  'super_admin',
  'dispatch_verifier'
);

-- Emergency Dispatch Accounts table
CREATE TABLE public.emergency_dispatch_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Organization info
  organization_name TEXT NOT NULL,
  organization_type dispatch_organization_type NOT NULL,
  organization_code TEXT, -- Internal department code (e.g., NYPD, LAFD)
  jurisdictions TEXT[] NOT NULL DEFAULT '{}',

  -- Legal accountability
  tax_id TEXT NOT NULL,
  insurance_carrier TEXT NOT NULL,
  insurance_policy_number TEXT NOT NULL,
  registered_agent_name TEXT NOT NULL,
  registered_agent_contact TEXT NOT NULL,

  -- Primary contact
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL UNIQUE,
  primary_contact_phone TEXT NOT NULL,

  -- Dispatch center info
  dispatch_center_phone TEXT,
  dispatch_center_address TEXT,

  -- Verification
  verification_status dispatch_verification_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  verification_notes TEXT, -- Internal admin notes

  -- Authentication (separate from Supabase Auth)
  password_hash TEXT NOT NULL,

  -- API access
  api_key_hash TEXT,
  api_key_last_four TEXT,
  api_key_created_at TIMESTAMPTZ,
  api_key_last_used_at TIMESTAMPTZ,
  api_rate_limit INTEGER DEFAULT 100, -- Requests per hour

  -- Account status
  is_active BOOLEAN NOT NULL DEFAULT true,
  suspended_at TIMESTAMPTZ,
  suspended_reason TEXT,
  suspended_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dispatch Access Requests table (audit log for Door Key Tree access)
CREATE TABLE public.dispatch_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text, -- Human-readable request ID

  -- Who requested
  dispatch_account_id UUID NOT NULL REFERENCES public.emergency_dispatch_accounts(id),
  requesting_officer_name TEXT NOT NULL,
  requesting_officer_badge TEXT,

  -- Target resident
  resident_user_id UUID NOT NULL REFERENCES auth.users(id),
  target_address TEXT NOT NULL,
  target_unit_number TEXT,

  -- Emergency details
  emergency_scenario TEXT NOT NULL, -- Maps to EmergencyScenario type
  emergency_description TEXT,
  is_life_threatening BOOLEAN NOT NULL DEFAULT false,

  -- Legal basis
  legal_basis dispatch_legal_basis NOT NULL,
  case_number TEXT,
  warrant_number TEXT,
  warrant_issuing_judge TEXT,
  warrant_issued_at TIMESTAMPTZ,
  warrant_expires_at TIMESTAMPTZ,
  probable_cause_description TEXT,

  -- Request status
  status dispatch_access_status NOT NULL DEFAULT 'pending',
  response_at TIMESTAMPTZ,
  response_method TEXT CHECK (response_method IN ('auto', 'manual', 'denied')),
  denial_reason TEXT,

  -- Data returned (if approved)
  door_key_tree_data JSONB,
  key_holders_returned INTEGER,
  data_returned_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Naybor notifications
  naybors_notified TEXT[], -- User IDs of naybors notified
  naybor_notification_method TEXT,
  naybor_notification_sent_at TIMESTAMPTZ,

  -- Audit metadata
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin Roles table
CREATE TABLE public.admin_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role admin_role_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for common queries
CREATE INDEX idx_dispatch_accounts_email ON public.emergency_dispatch_accounts(primary_contact_email);
CREATE INDEX idx_dispatch_accounts_status ON public.emergency_dispatch_accounts(verification_status);
CREATE INDEX idx_dispatch_accounts_type ON public.emergency_dispatch_accounts(organization_type);
CREATE INDEX idx_dispatch_accounts_active ON public.emergency_dispatch_accounts(is_active);

CREATE INDEX idx_access_requests_dispatch ON public.dispatch_access_requests(dispatch_account_id);
CREATE INDEX idx_access_requests_resident ON public.dispatch_access_requests(resident_user_id);
CREATE INDEX idx_access_requests_status ON public.dispatch_access_requests(status);
CREATE INDEX idx_access_requests_created ON public.dispatch_access_requests(created_at);

CREATE INDEX idx_admin_roles_role ON public.admin_roles(role);

-- Enable Row Level Security
ALTER TABLE public.emergency_dispatch_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emergency_dispatch_accounts

-- Admins with dispatch_verifier role can view all accounts
CREATE POLICY "Dispatch verifiers can view all accounts"
  ON public.emergency_dispatch_accounts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'dispatch_verifier')
    )
  );

-- Admins with dispatch_verifier role can update verification status
CREATE POLICY "Dispatch verifiers can update accounts"
  ON public.emergency_dispatch_accounts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'dispatch_verifier')
    )
  );

-- Anyone can insert (register) a new dispatch account
CREATE POLICY "Anyone can register a dispatch account"
  ON public.emergency_dispatch_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow anon for public registration
CREATE POLICY "Anonymous can register a dispatch account"
  ON public.emergency_dispatch_accounts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for dispatch_access_requests

-- Admins can view all access requests
CREATE POLICY "Admins can view all access requests"
  ON public.dispatch_access_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'dispatch_verifier')
    )
  );

-- Users can view access requests for their own data
CREATE POLICY "Users can view their own access requests"
  ON public.dispatch_access_requests
  FOR SELECT
  TO authenticated
  USING (resident_user_id = auth.uid());

-- Verified dispatch accounts can create access requests (handled via API)
-- This policy allows the API to insert on behalf of verified accounts
CREATE POLICY "Service role can insert access requests"
  ON public.dispatch_access_requests
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policies for admin_roles

-- Super admins can view all admin roles
CREATE POLICY "Super admins can view admin roles"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- Super admins can manage admin roles
CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'super_admin'
    )
  );

-- Users can check if they have an admin role
CREATE POLICY "Users can view their own admin role"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_dispatch_account_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_dispatch_accounts_timestamp
  BEFORE UPDATE ON public.emergency_dispatch_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dispatch_account_timestamp();

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = check_user_id
  );
$$;

-- Create function to check if a user is a dispatch verifier
CREATE OR REPLACE FUNCTION public.is_dispatch_verifier(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = check_user_id
    AND role IN ('super_admin', 'dispatch_verifier')
  );
$$;

-- Grant access to functions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_dispatch_verifier TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.emergency_dispatch_accounts IS 'Emergency dispatch organizations (police, fire, EMS) that can request Door Key Tree access';
COMMENT ON TABLE public.dispatch_access_requests IS 'Audit log of all Door Key Tree access requests from dispatch accounts';
COMMENT ON TABLE public.admin_roles IS 'Admin roles for Inner Friend staff to verify dispatch accounts';

COMMENT ON COLUMN public.emergency_dispatch_accounts.password_hash IS 'Bcrypt hash of dispatch account password (separate from Supabase Auth)';
COMMENT ON COLUMN public.emergency_dispatch_accounts.api_key_hash IS 'SHA-256 hash of API key for programmatic access';
COMMENT ON COLUMN public.emergency_dispatch_accounts.api_key_last_four IS 'Last 4 characters of API key for identification';

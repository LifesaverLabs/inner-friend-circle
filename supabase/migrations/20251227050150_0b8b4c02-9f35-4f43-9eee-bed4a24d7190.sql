-- First, add missing column to friend_connections for asymmetric tiers
ALTER TABLE public.friend_connections 
ADD COLUMN IF NOT EXISTS target_circle_tier public.circle_tier;

-- Update existing rows to have the same tier for both directions
UPDATE public.friend_connections 
SET target_circle_tier = circle_tier 
WHERE target_circle_tier IS NULL;

-- Create enum for organization types (dispatch system)
DO $$ BEGIN
  CREATE TYPE dispatch_organization_type AS ENUM (
    'police', 'fire', 'ems', 'combined', 'private_ems', 'hospital', 'crisis_center'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for verification status
DO $$ BEGIN
  CREATE TYPE dispatch_verification_status AS ENUM (
    'pending', 'verified', 'rejected', 'suspended'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for access request status
DO $$ BEGIN
  CREATE TYPE dispatch_access_status AS ENUM (
    'pending', 'approved', 'denied', 'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for legal basis
DO $$ BEGIN
  CREATE TYPE dispatch_legal_basis AS ENUM (
    'consent', 'exigent_circumstances', 'court_order', 'welfare_check'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for admin roles
DO $$ BEGIN
  CREATE TYPE admin_role_type AS ENUM (
    'super_admin', 'dispatch_verifier'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for post content types
DO $$ BEGIN
  CREATE TYPE public.post_content_type AS ENUM (
    'text', 'photo', 'voice_note', 'video', 'call_invite', 'meetup_invite', 'proximity_ping', 'life_update'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create enum for interaction types
DO $$ BEGIN
  CREATE TYPE public.interaction_type AS ENUM (
    'like', 'comment', 'voice_reply', 'call_accepted', 'meetup_rsvp', 'share'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Emergency Dispatch Accounts table
CREATE TABLE IF NOT EXISTS public.emergency_dispatch_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  organization_type dispatch_organization_type NOT NULL,
  organization_code TEXT,
  jurisdictions TEXT[] NOT NULL DEFAULT '{}',
  tax_id TEXT NOT NULL,
  insurance_carrier TEXT NOT NULL,
  insurance_policy_number TEXT NOT NULL,
  registered_agent_name TEXT NOT NULL,
  registered_agent_contact TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL UNIQUE,
  primary_contact_phone TEXT NOT NULL,
  dispatch_center_phone TEXT,
  dispatch_center_address TEXT,
  verification_status dispatch_verification_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  verification_notes TEXT,
  password_hash TEXT NOT NULL,
  api_key_hash TEXT,
  api_key_last_four TEXT,
  api_key_created_at TIMESTAMPTZ,
  api_key_last_used_at TIMESTAMPTZ,
  api_rate_limit INTEGER DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  suspended_at TIMESTAMPTZ,
  suspended_reason TEXT,
  suspended_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dispatch Access Requests table
CREATE TABLE IF NOT EXISTS public.dispatch_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  dispatch_account_id UUID NOT NULL REFERENCES public.emergency_dispatch_accounts(id),
  requesting_officer_name TEXT NOT NULL,
  requesting_officer_badge TEXT,
  resident_user_id UUID NOT NULL REFERENCES auth.users(id),
  target_address TEXT NOT NULL,
  target_unit_number TEXT,
  emergency_scenario TEXT NOT NULL,
  emergency_description TEXT,
  is_life_threatening BOOLEAN NOT NULL DEFAULT false,
  legal_basis dispatch_legal_basis NOT NULL,
  case_number TEXT,
  warrant_number TEXT,
  warrant_issuing_judge TEXT,
  warrant_issued_at TIMESTAMPTZ,
  warrant_expires_at TIMESTAMPTZ,
  probable_cause_description TEXT,
  status dispatch_access_status NOT NULL DEFAULT 'pending',
  response_at TIMESTAMPTZ,
  response_method TEXT CHECK (response_method IN ('auto', 'manual', 'denied')),
  denial_reason TEXT,
  door_key_tree_data JSONB,
  key_holders_returned INTEGER,
  data_returned_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  naybors_notified TEXT[],
  naybor_notification_method TEXT,
  naybor_notification_sent_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin Roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role admin_role_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content_type post_content_type NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location_name TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  visibility circle_tier[] NOT NULL DEFAULT '{core,inner,outer}',
  is_suggested BOOLEAN NOT NULL DEFAULT false,
  is_sponsored BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_interactions table
CREATE TABLE IF NOT EXISTS public.post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  interaction_type interaction_type NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, interaction_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.emergency_dispatch_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- RLS for emergency_dispatch_accounts
CREATE POLICY "Dispatch verifiers can view all accounts" ON public.emergency_dispatch_accounts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'dispatch_verifier')));

CREATE POLICY "Dispatch verifiers can update accounts" ON public.emergency_dispatch_accounts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'dispatch_verifier')));

CREATE POLICY "Anyone can register a dispatch account" ON public.emergency_dispatch_accounts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Anonymous can register a dispatch account" ON public.emergency_dispatch_accounts
  FOR INSERT TO anon WITH CHECK (true);

-- RLS for dispatch_access_requests
CREATE POLICY "Admins can view all access requests" ON public.dispatch_access_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'dispatch_verifier')));

CREATE POLICY "Users can view their own access requests" ON public.dispatch_access_requests
  FOR SELECT TO authenticated
  USING (resident_user_id = auth.uid());

CREATE POLICY "Service role can insert access requests" ON public.dispatch_access_requests
  FOR INSERT TO service_role WITH CHECK (true);

-- RLS for admin_roles
CREATE POLICY "Super admins can view admin roles" ON public.admin_roles
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'));

CREATE POLICY "Super admins can manage admin roles" ON public.admin_roles
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'));

CREATE POLICY "Users can view their own admin role" ON public.admin_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS for posts
CREATE POLICY "Users can view posts from connected friends" ON public.posts
  FOR SELECT TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM public.friend_connections fc
      WHERE fc.status = 'confirmed'
      AND (
        (fc.requester_id = auth.uid() AND fc.target_user_id = author_id AND fc.circle_tier = ANY(visibility))
        OR (fc.target_user_id = auth.uid() AND fc.requester_id = author_id AND fc.target_circle_tier = ANY(visibility))
      )
    )
  );

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- RLS for post_interactions
CREATE POLICY "Users can view interactions on visible posts" ON public.post_interactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id
      AND (
        auth.uid() = p.author_id
        OR EXISTS (
          SELECT 1 FROM public.friend_connections fc
          WHERE fc.status = 'confirmed'
          AND (
            (fc.requester_id = auth.uid() AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
            OR (fc.target_user_id = auth.uid() AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
          )
        )
      )
    )
  );

CREATE POLICY "Users can interact with visible posts" ON public.post_interactions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = post_id
      AND (
        auth.uid() = p.author_id
        OR EXISTS (
          SELECT 1 FROM public.friend_connections fc
          WHERE fc.status = 'confirmed'
          AND (
            (fc.requester_id = auth.uid() AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
            OR (fc.target_user_id = auth.uid() AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
          )
        )
      )
    )
  );

CREATE POLICY "Users can update their own interactions" ON public.post_interactions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON public.post_interactions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dispatch_accounts_email ON public.emergency_dispatch_accounts(primary_contact_email);
CREATE INDEX IF NOT EXISTS idx_dispatch_accounts_status ON public.emergency_dispatch_accounts(verification_status);
CREATE INDEX IF NOT EXISTS idx_access_requests_dispatch ON public.dispatch_access_requests(dispatch_account_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_resident ON public.dispatch_access_requests(resident_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON public.admin_roles(role);
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON public.posts USING GIN(visibility);
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id ON public.post_interactions(post_id);

-- Create function to get visible posts
CREATE OR REPLACE FUNCTION public.get_visible_posts_for_user(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  content_type post_content_type,
  content TEXT,
  media_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  location_name TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  visibility circle_tier[],
  is_suggested BOOLEAN,
  is_sponsored BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  author_display_name TEXT,
  author_user_handle TEXT,
  author_avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id, p.author_id, p.content_type, p.content, p.media_url,
    p.scheduled_at, p.location_name, p.location_lat, p.location_lng,
    p.visibility, p.is_suggested, p.is_sponsored, p.created_at, p.updated_at,
    prof.display_name, prof.user_handle, prof.avatar_url
  FROM public.posts p
  JOIN public.profiles prof ON p.author_id = prof.user_id
  WHERE (
    target_user_id = p.author_id
    OR EXISTS (
      SELECT 1 FROM public.friend_connections fc
      WHERE fc.status = 'confirmed'
      AND (
        (fc.requester_id = target_user_id AND fc.target_user_id = p.author_id AND fc.circle_tier = ANY(p.visibility))
        OR (fc.target_user_id = target_user_id AND fc.requester_id = p.author_id AND fc.target_circle_tier = ANY(p.visibility))
      )
    )
  )
  ORDER BY p.created_at DESC;
$$;

-- Grant execute on function
GRANT EXECUTE ON FUNCTION public.get_visible_posts_for_user(UUID) TO authenticated;

-- Create admin helper functions
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = check_user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_dispatch_verifier(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = check_user_id AND role IN ('super_admin', 'dispatch_verifier'));
$$;

GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_dispatch_verifier TO authenticated;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_dispatch_account_timestamp()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_dispatch_accounts_timestamp ON public.emergency_dispatch_accounts;
CREATE TRIGGER update_dispatch_accounts_timestamp
  BEFORE UPDATE ON public.emergency_dispatch_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_dispatch_account_timestamp();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
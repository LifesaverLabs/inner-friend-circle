/**
 * Emergency Dispatch Account Types
 *
 * Types for the emergency dispatch system that allows verified emergency services
 * (police, fire, EMS, etc.) to access Door Key Tree information during emergencies.
 */

import { Database } from '@/integrations/supabase/types';

// Re-export enum types for convenience
export type DispatchOrganizationType = Database['public']['Enums']['dispatch_organization_type'];
export type DispatchVerificationStatus = Database['public']['Enums']['dispatch_verification_status'];
export type DispatchAccessStatus = Database['public']['Enums']['dispatch_access_status'];
export type DispatchLegalBasis = Database['public']['Enums']['dispatch_legal_basis'];
export type AdminRoleType = Database['public']['Enums']['admin_role_type'];

// Table row types
export type EmergencyDispatchAccountRow = Database['public']['Tables']['emergency_dispatch_accounts']['Row'];
export type DispatchAccessRequestRow = Database['public']['Tables']['dispatch_access_requests']['Row'];
export type AdminRoleRow = Database['public']['Tables']['admin_roles']['Row'];

// Insert types
export type EmergencyDispatchAccountInsert = Database['public']['Tables']['emergency_dispatch_accounts']['Insert'];
export type DispatchAccessRequestInsert = Database['public']['Tables']['dispatch_access_requests']['Insert'];

/**
 * Organization type display info
 */
export interface OrganizationTypeInfo {
  id: DispatchOrganizationType;
  name: string;
  icon: string;
  description: string;
}

export const ORGANIZATION_TYPES: Record<DispatchOrganizationType, OrganizationTypeInfo> = {
  police: {
    id: 'police',
    name: 'Police Department',
    icon: '🚔',
    description: 'Law enforcement agencies',
  },
  fire: {
    id: 'fire',
    name: 'Fire Department',
    icon: '🚒',
    description: 'Fire and rescue services',
  },
  ems: {
    id: 'ems',
    name: 'Emergency Medical Services',
    icon: '🚑',
    description: 'Ambulance and paramedic services',
  },
  combined: {
    id: 'combined',
    name: 'Combined Dispatch Center',
    icon: '📞',
    description: 'Handles multiple emergency services (911 centers)',
  },
  private_ems: {
    id: 'private_ems',
    name: 'Private Ambulance Service',
    icon: '🏥',
    description: 'Private ambulance and medical transport',
  },
  hospital: {
    id: 'hospital',
    name: 'Hospital Emergency Department',
    icon: '🏨',
    description: 'Hospital emergency rooms and trauma centers',
  },
  crisis_center: {
    id: 'crisis_center',
    name: 'Crisis Center',
    icon: '💚',
    description: 'Mental health crisis intervention centers',
  },
};

/**
 * Verification status display info
 */
export interface VerificationStatusInfo {
  id: DispatchVerificationStatus;
  name: string;
  color: string;
  description: string;
}

export const VERIFICATION_STATUSES: Record<DispatchVerificationStatus, VerificationStatusInfo> = {
  pending: {
    id: 'pending',
    name: 'Pending Review',
    color: 'yellow',
    description: 'Application submitted and awaiting verification',
  },
  verified: {
    id: 'verified',
    name: 'Verified',
    color: 'green',
    description: 'Organization verified and approved for access',
  },
  rejected: {
    id: 'rejected',
    name: 'Rejected',
    color: 'red',
    description: 'Application rejected - see reason for details',
  },
  suspended: {
    id: 'suspended',
    name: 'Suspended',
    color: 'orange',
    description: 'Account temporarily suspended',
  },
};

/**
 * Legal basis display info
 */
export interface LegalBasisInfo {
  id: DispatchLegalBasis;
  name: string;
  description: string;
  requiresDocumentation: boolean;
}

export const LEGAL_BASES: Record<DispatchLegalBasis, LegalBasisInfo> = {
  consent: {
    id: 'consent',
    name: 'Resident Consent',
    description: 'Resident or authorized person has given permission',
    requiresDocumentation: false,
  },
  exigent_circumstances: {
    id: 'exigent_circumstances',
    name: 'Exigent Circumstances',
    description: 'Immediate threat to life requiring emergency action',
    requiresDocumentation: true,
  },
  court_order: {
    id: 'court_order',
    name: 'Court Order',
    description: 'Judicial warrant or court order for access',
    requiresDocumentation: true,
  },
  welfare_check: {
    id: 'welfare_check',
    name: 'Welfare Check',
    description: 'Concern for resident safety based on reported non-responsiveness',
    requiresDocumentation: true,
  },
};

/**
 * Registration form data (before password hashing)
 */
export interface DispatchRegistrationFormData {
  // Step 1: Organization Info
  organizationName: string;
  organizationType: DispatchOrganizationType;
  organizationCode?: string;
  jurisdictions: string[];

  // Step 2: Legal Accountability
  taxId: string;
  insuranceCarrier: string;
  insurancePolicyNumber: string;
  registeredAgentName: string;
  registeredAgentContact: string;

  // Step 3: Primary Contact
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  dispatchCenterPhone?: string;
  dispatchCenterAddress?: string;

  // Step 4: Account Setup
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

/**
 * Dispatch session data (stored in localStorage/sessionStorage)
 */
export interface DispatchSession {
  accountId: string;
  organizationName: string;
  organizationType: DispatchOrganizationType;
  verificationStatus: DispatchVerificationStatus;
  isActive: boolean;
  expiresAt: string;
}

/**
 * Dispatch auth state
 */
export interface DispatchAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: DispatchSession | null;
  error: string | null;
}

/**
 * Access request form data
 */
export interface AccessRequestFormData {
  residentAddress: string;
  residentUnitNumber?: string;
  emergencyScenario: string;
  emergencyDescription?: string;
  isLifeThreatening: boolean;
  legalBasis: DispatchLegalBasis;
  caseNumber?: string;
  warrantNumber?: string;
  warrantIssuingJudge?: string;
  warrantIssuedAt?: string;
  warrantExpiresAt?: string;
  probableCauseDescription?: string;
  requestingOfficerName: string;
  requestingOfficerBadge?: string;
}

/**
 * Resident search result
 */
export interface ResidentSearchResult {
  userId: string;
  displayName: string | null;
  address: string;
  unitNumber?: string;
  hasKeysShared: boolean;
  shareWithEmergencyWorkers: boolean;
}

/**
 * Door Key Tree data returned to dispatch
 */
export interface DoorKeyTreeResponse {
  address: string;
  unitNumber?: string;
  entryInstructions?: string;
  doorBreakingPreference: string;
  keyHolders: Array<{
    name: string;
    phone?: string;
    keyType: string;
    notes?: string;
  }>;
}

/**
 * Get organization type by ID
 */
export function getOrganizationType(id: DispatchOrganizationType): OrganizationTypeInfo {
  return ORGANIZATION_TYPES[id];
}

/**
 * Get verification status by ID
 */
export function getVerificationStatus(id: DispatchVerificationStatus): VerificationStatusInfo {
  return VERIFICATION_STATUSES[id];
}

/**
 * Get legal basis by ID
 */
export function getLegalBasis(id: DispatchLegalBasis): LegalBasisInfo {
  return LEGAL_BASES[id];
}

/**
 * Check if an account can make access requests
 */
export function canMakeAccessRequests(account: EmergencyDispatchAccountRow): boolean {
  return account.verification_status === 'verified' && account.is_active;
}

/**
 * Check if a user has admin access for dispatch verification
 */
export function isDispatchAdmin(role: AdminRoleType | null): boolean {
  return role === 'super_admin' || role === 'dispatch_verifier';
}

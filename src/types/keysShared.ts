/**
 * Keys Shared™ - Emergency Home Access System
 *
 * Track which naybors have physical keys or digital entry codes to your home.
 * This is critically important for emergency services so that first responders,
 * naybors, or your trusted circle can gain entry without breaking down doors
 * during life-threatening emergencies.
 */

import { Friend } from './friend';

/**
 * Type of key/access the naybor has
 */
export type KeyType = 'physical' | 'digital' | 'both';

/**
 * Emergency scenarios that may require home entry
 * Some are mandatory (cannot opt out) because they threaten life, limb, or trauma
 */
export type EmergencyScenario =
  | 'cardiac_arrest'           // Heart attack, sudden cardiac arrest
  | 'choking'                  // Choking emergency
  | 'drowning'                 // Drowning (pool, bathtub)
  | 'anaphylaxis'              // Severe allergic reaction (bee sting, food, etc.)
  | 'elderly_fall'             // Elderly person fallen, unable to get up
  | 'fire'                     // Fire detected - MANDATORY, threats to life/limb
  | 'childhood_corporal'       // Childhood corporal punishment - MANDATORY for child safety
  | 'take10_spiral'            // Take 10 needed domestic shouting spiral - MANDATORY
  | 'bedroom_consent'          // Bedroom consent conflict - MANDATORY
  | 'medical_other'            // Other medical emergencies
  | 'flooding'                 // Water leak/flooding - OPTIONAL (property, not life)
  | 'gas_leak'                 // Gas leak detected - threats to life
  | 'carbon_monoxide'          // CO detected - threats to life
  | 'intruder_check'           // Check on suspected intruder
  | 'welfare_check';           // General welfare check when unresponsive

export interface EmergencyScenarioInfo {
  id: EmergencyScenario;
  name: string;
  icon: string;
  description: string;
  isMandatory: boolean; // Cannot opt out - life/limb/trauma/child safety
  category: 'life_threatening' | 'child_safety' | 'domestic_safety' | 'property' | 'welfare';
  take10Link?: string; // Link for Take 10 resources
}

export const EMERGENCY_SCENARIOS: Record<EmergencyScenario, EmergencyScenarioInfo> = {
  cardiac_arrest: {
    id: 'cardiac_arrest',
    name: 'Cardiac Arrest',
    icon: '❤️‍🩹',
    description: 'Heart attack or sudden cardiac arrest - every second counts',
    isMandatory: true,
    category: 'life_threatening',
  },
  choking: {
    id: 'choking',
    name: 'Choking',
    icon: '😰',
    description: 'Choking emergency - airway blocked, needs immediate help',
    isMandatory: true,
    category: 'life_threatening',
  },
  drowning: {
    id: 'drowning',
    name: 'Drowning',
    icon: '🌊',
    description: 'Drowning in pool, bathtub, or other water',
    isMandatory: true,
    category: 'life_threatening',
  },
  anaphylaxis: {
    id: 'anaphylaxis',
    name: 'Anaphylactic Shock',
    icon: '🐝',
    description: 'Severe allergic reaction from bee sting, food, medication, etc.',
    isMandatory: true,
    category: 'life_threatening',
  },
  elderly_fall: {
    id: 'elderly_fall',
    name: 'Elderly Fall',
    icon: '🧓',
    description: 'Elderly person fallen, unable to get up, possibly injured',
    isMandatory: true,
    category: 'life_threatening',
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    icon: '🔥',
    description: 'Fire detected - threat to life, limb, tissue, and anyone immobilized or asleep',
    isMandatory: true,
    category: 'life_threatening',
  },
  gas_leak: {
    id: 'gas_leak',
    name: 'Gas Leak',
    icon: '💨',
    description: 'Gas leak detected - explosion/poisoning risk',
    isMandatory: true,
    category: 'life_threatening',
  },
  carbon_monoxide: {
    id: 'carbon_monoxide',
    name: 'Carbon Monoxide',
    icon: '🚨',
    description: 'CO detector alarm - silent killer, occupants may be unconscious',
    isMandatory: true,
    category: 'life_threatening',
  },
  childhood_corporal: {
    id: 'childhood_corporal',
    name: 'Childhood Corporal Punishment',
    icon: '🧒',
    description: 'Child alerting naybors to corporal punishment. Research shows community intervention prevents future violence.',
    isMandatory: true,
    category: 'child_safety',
  },
  take10_spiral: {
    id: 'take10_spiral',
    name: 'Take 10 Shouting Spiral',
    icon: '🔊',
    description: 'Domestic shouting escalating unacceptably. De-escalation intervention needed.',
    isMandatory: true,
    category: 'domestic_safety',
    take10Link: 'https://www.take10.us',
  },
  bedroom_consent: {
    id: 'bedroom_consent',
    name: 'Bedroom Consent Conflict',
    icon: '🛏️',
    description: 'Detected bedroom consent conflict emergency - immediate intervention required',
    isMandatory: true,
    category: 'domestic_safety',
  },
  medical_other: {
    id: 'medical_other',
    name: 'Other Medical Emergency',
    icon: '🏥',
    description: 'Other medical emergency requiring home entry',
    isMandatory: true,
    category: 'life_threatening',
  },
  intruder_check: {
    id: 'intruder_check',
    name: 'Intruder Check',
    icon: '🚪',
    description: 'Check on suspected intruder when you cannot respond',
    isMandatory: false,
    category: 'welfare',
  },
  welfare_check: {
    id: 'welfare_check',
    name: 'Welfare Check',
    icon: '👋',
    description: 'General welfare check when you are unresponsive for extended period',
    isMandatory: false,
    category: 'welfare',
  },
  flooding: {
    id: 'flooding',
    name: 'Flooding/Water Leak',
    icon: '💧',
    description: 'Water leak or flooding - property damage prevention (not life-threatening)',
    isMandatory: false, // Property only, user can opt out
    category: 'property',
  },
};

/**
 * Naybor's key access record
 */
export interface NayborKeyAccess {
  nayborId: string;
  keyType: KeyType;
  hasPhysicalKey: boolean;
  hasDigitalCode: boolean;
  digitalCodeType?: 'keypad' | 'smart_lock' | 'garage' | 'other';
  notes?: string;
  confirmedAt: Date;
  lastVerified?: Date;
}

/**
 * Door breaking preference - how aggressively to attempt entry vs using keys
 */
export type DoorBreakingPreference =
  | 'break_fast_no_naybors'       // "Please break my door fast, don't call naybors"
  | 'break_fast_call_naybors'     // "Please break door fast, call naybors but don't hesitate"
  | 'last_resort_only';           // "Please only break door after lots of thought and last resort"

export const DOOR_BREAKING_OPTIONS: Record<DoorBreakingPreference, {
  id: DoorBreakingPreference;
  name: string;
  description: string;
  icon: string;
}> = {
  break_fast_no_naybors: {
    id: 'break_fast_no_naybors',
    name: 'Break Door Fast, Skip Naybors',
    description: 'In emergencies, break down the door immediately. Do not waste time contacting naybors for keys.',
    icon: '⚡',
  },
  break_fast_call_naybors: {
    id: 'break_fast_call_naybors',
    name: 'Break Door Fast, Call Naybors',
    description: 'Contact naybors for keys, but do not hesitate to break down the door if needed. Speed is priority.',
    icon: '🚪',
  },
  last_resort_only: {
    id: 'last_resort_only',
    name: 'Last Resort Only',
    description: 'Please only break door after careful consideration, as a last resort when strictly legally necessary.',
    icon: '🔐',
  },
};

/**
 * User's home entry preferences
 */
export interface HomeEntryPreferences {
  userId: string;
  address?: string;
  unitNumber?: string;
  entryInstructions?: string; // Special instructions for entry
  emergencyPermissions: EmergencyScenario[]; // Which scenarios allow entry (mandatory ones always included)
  keyHolders: NayborKeyAccess[];
  /**
   * Whether to share Door Key Tree with verified Emergency Dispatch accounts
   * (ambulance, fire, police) via Naybor SOS or Inner Friend API.
   * User can toggle this off to "Do not share with Emergency Workers"
   */
  shareWithEmergencyWorkers: boolean;
  /**
   * User's preference for how aggressively to break door vs use naybor keys
   */
  doorBreakingPreference: DoorBreakingPreference;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// EMERGENCY DISPATCH ACCOUNT INFRASTRUCTURE
// ============================================================================

/**
 * Types of emergency dispatch organizations
 */
export type DispatchOrganizationType =
  | 'police'          // Law enforcement
  | 'fire'            // Fire department
  | 'ems'             // Emergency Medical Services / Ambulance
  | 'combined'        // Combined dispatch center (handles multiple services)
  | 'private_ems'     // Private ambulance services
  | 'hospital'        // Hospital emergency department
  | 'crisis_center';  // Mental health crisis centers

/**
 * Types of legal authority for Door Key Tree requests
 */
export type RequestLegalBasis =
  | 'warrantless_probable_cause'  // Warrantless emergency (life-threatening, child safety)
  | 'judicial_warrant'            // Court-issued search warrant
  | 'consent'                     // Voluntary consent from resident/key holder
  | 'exigent_circumstances';      // Immediate threat to life requiring action

/**
 * Jurisdictions served by a dispatch organization
 */
export interface DispatchJurisdiction {
  country: string;       // ISO country code
  state?: string;        // State/province/region
  county?: string;       // County/district
  city?: string;         // City/municipality
  zipCodes?: string[];   // Specific zip/postal codes covered
  description?: string;  // Human-readable description of coverage area
}

/**
 * Contact person for accountability at a dispatch organization
 */
export interface DispatchResponsibleParty {
  name: string;
  title: string;                    // e.g., "Chief of Police", "Fire Chief", "EMS Director"
  email: string;
  phone: string;
  available24x7: boolean;
  alternateContactName?: string;
  alternateContactPhone?: string;
}

/**
 * Legal accountability information for a dispatch organization
 */
export interface DispatchLegalInfo {
  organizationLegalName: string;    // Full legal name for lawsuits
  taxId?: string;                   // EIN or equivalent tax ID
  incorporationState?: string;      // Where organization is incorporated
  registeredAgent?: string;         // Legal agent for service of process
  registeredAgentAddress?: string;
  insuranceCarrier?: string;        // Liability insurance provider
  insurancePolicyNumber?: string;
  arbitrationClause?: string;       // Mandatory arbitration terms if applicable
  disputeResolutionProcess?: string; // How disputes should be handled
}

/**
 * Verified Emergency Dispatch account - created and managed by Inner Friend admins
 */
export interface EmergencyDispatchAccount {
  id: string;
  organizationType: DispatchOrganizationType;
  organizationName: string;         // Display name
  organizationCode?: string;        // Internal department code (e.g., NYPD, LAFD)

  // Verification status
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;              // Inner Friend admin who verified
  verificationMethod?: string;      // How verification was performed
  verificationDocuments?: string[]; // References to uploaded verification docs

  // Jurisdictions and coverage
  jurisdictions: DispatchJurisdiction[];

  // Contact and accountability
  primaryContact: DispatchResponsibleParty;
  secondaryContact?: DispatchResponsibleParty;
  dispatchCenterPhone: string;      // 24/7 dispatch phone
  dispatchCenterAddress: string;

  // Legal accountability
  legalInfo: DispatchLegalInfo;

  // API access
  apiKeyHash?: string;              // Hashed API key for programmatic access
  apiKeyCreatedAt?: Date;
  apiKeyLastUsedAt?: Date;
  apiRateLimit?: number;            // Requests per hour limit

  // Account status
  isActive: boolean;
  suspendedAt?: Date;
  suspendedReason?: string;
  suspendedBy?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;                   // Internal admin notes
}

/**
 * Audit log entry for Door Key Tree requests
 */
export interface DoorKeyTreeRequestAuditLog {
  id: string;
  requestId: string;                // Unique request identifier

  // Who requested
  dispatchAccountId: string;
  dispatchOrganizationName: string;
  dispatchOrganizationType: DispatchOrganizationType;
  requestingOfficerName?: string;   // Name of person making request
  requestingOfficerBadge?: string;  // Badge number or ID

  // What was requested
  targetUserId: string;
  targetAddress: string;
  targetUnitNumber?: string;

  // Legal basis
  legalBasis: RequestLegalBasis;
  warrantNumber?: string;           // If judicial warrant
  warrantIssuingJudge?: string;     // Judge who issued warrant
  warrantIssuedAt?: Date;
  warrantExpiresAt?: Date;
  probableCauseDescription?: string; // For warrantless requests

  // Emergency classification
  emergencyScenario: EmergencyScenario;
  emergencyDescription: string;     // Human-readable description of emergency
  isLifeThreatening: boolean;
  estimatedResponseTimeMinutes?: number;

  // Response
  wasApproved: boolean;
  responseAt: Date;
  responseMethod: 'auto' | 'manual' | 'denied';
  denialReason?: string;

  // Data returned (if approved)
  keyHoldersReturned?: number;      // Count of naybors with keys shared
  dataReturnedAt?: Date;

  // Naybor communication
  nayborsNotified?: string[];       // IDs of naybors notified about request
  nayborNotificationMethod?: 'sms' | 'push' | 'email' | 'call';
  nayborNotificationSentAt?: Date;
  nayborNotificationMessage?: string;

  // Audit metadata
  ipAddress?: string;
  userAgent?: string;
  requestedAt: Date;
  createdAt: Date;
}

/**
 * Status of sharing preference for a user
 */
export interface EmergencyWorkerSharingStatus {
  userId: string;
  shareWithEmergencyWorkers: boolean;
  lastUpdatedAt: Date;
  updateHistory: Array<{
    previousValue: boolean;
    newValue: boolean;
    changedAt: Date;
  }>;
}

/**
 * Get all mandatory scenarios that cannot be opted out of
 */
export function getMandatoryScenarios(): EmergencyScenario[] {
  return Object.values(EMERGENCY_SCENARIOS)
    .filter(s => s.isMandatory)
    .map(s => s.id);
}

/**
 * Get optional scenarios that user can choose to enable/disable
 */
export function getOptionalScenarios(): EmergencyScenario[] {
  return Object.values(EMERGENCY_SCENARIOS)
    .filter(s => !s.isMandatory)
    .map(s => s.id);
}

/**
 * Get scenarios grouped by category
 */
export function getScenariosByCategory(): Record<EmergencyScenarioInfo['category'], EmergencyScenarioInfo[]> {
  const grouped: Record<EmergencyScenarioInfo['category'], EmergencyScenarioInfo[]> = {
    life_threatening: [],
    child_safety: [],
    domestic_safety: [],
    property: [],
    welfare: [],
  };

  Object.values(EMERGENCY_SCENARIOS).forEach(scenario => {
    grouped[scenario.category].push(scenario);
  });

  return grouped;
}

/**
 * Default home entry preferences with all mandatory scenarios
 * By default, sharing with emergency workers is ON (opt-out model for safety)
 */
export function getDefaultHomeEntryPreferences(userId: string): HomeEntryPreferences {
  return {
    userId,
    emergencyPermissions: getMandatoryScenarios(),
    keyHolders: [],
    shareWithEmergencyWorkers: true, // Default to sharing for safety
    doorBreakingPreference: 'break_fast_call_naybors', // Default: call naybors but don't hesitate
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get naybors who have keys, sorted by key type
 */
export function getKeyHolders(preferences: HomeEntryPreferences, naybors: Friend[]): (Friend & { keyAccess: NayborKeyAccess })[] {
  return preferences.keyHolders
    .map(kh => {
      const naybor = naybors.find(n => n.id === kh.nayborId);
      if (!naybor) return null;
      return { ...naybor, keyAccess: kh };
    })
    .filter((n): n is Friend & { keyAccess: NayborKeyAccess } => n !== null)
    .sort((a, b) => {
      // Sort by key type: both > physical > digital
      const typeOrder: Record<KeyType, number> = { both: 0, physical: 1, digital: 2 };
      return typeOrder[a.keyAccess.keyType] - typeOrder[b.keyAccess.keyType];
    });
}

/**
 * Check if a naybor has any key access
 */
export function hasKeyAccess(preferences: HomeEntryPreferences, nayborId: string): boolean {
  return preferences.keyHolders.some(kh => kh.nayborId === nayborId);
}

/**
 * Get key access summary for display
 */
export function getKeyAccessSummary(preferences: HomeEntryPreferences): {
  total: number;
  physical: number;
  digital: number;
  both: number;
} {
  const holders = preferences.keyHolders;
  return {
    total: holders.length,
    physical: holders.filter(h => h.keyType === 'physical').length,
    digital: holders.filter(h => h.keyType === 'digital').length,
    both: holders.filter(h => h.keyType === 'both').length,
  };
}

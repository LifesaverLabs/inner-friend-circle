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
 * User's home entry preferences
 */
export interface HomeEntryPreferences {
  userId: string;
  address?: string;
  unitNumber?: string;
  entryInstructions?: string; // Special instructions for entry
  emergencyPermissions: EmergencyScenario[]; // Which scenarios allow entry (mandatory ones always included)
  keyHolders: NayborKeyAccess[];
  createdAt: Date;
  updatedAt: Date;
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
 */
export function getDefaultHomeEntryPreferences(userId: string): HomeEntryPreferences {
  return {
    userId,
    emergencyPermissions: getMandatoryScenarios(),
    keyHolders: [],
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

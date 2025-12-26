/**
 * Naybor SOS™ - Emergency Contact System
 *
 * Your naybors are your first line of help in emergencies.
 * This system integrates your Naybor list into a quick-access
 * emergency contact network.
 */

import { Friend, ContactMethod } from './friend';

export type SOSCategory =
  | 'medical'      // Medical emergency - need immediate help
  | 'safety'       // Safety concern - feeling unsafe
  | 'lockout'      // Locked out of home
  | 'utility'      // Utility emergency (water leak, power outage, etc.)
  | 'pet'          // Pet emergency - need help with pet
  | 'childcare'    // Childcare emergency - need someone to watch kids
  | 'transport'    // Need emergency ride
  | 'other';       // Other emergency

export interface SOSCategoryInfo {
  id: SOSCategory;
  name: string;
  icon: string;
  description: string;
  urgencyLevel: 'critical' | 'urgent' | 'standard';
  suggestedActions: string[];
}

export const SOS_CATEGORIES: Record<SOSCategory, SOSCategoryInfo> = {
  medical: {
    id: 'medical',
    name: 'Medical',
    icon: '🏥',
    description: 'Medical emergency - need immediate assistance',
    urgencyLevel: 'critical',
    suggestedActions: [
      'Call 911 first if life-threatening',
      'Ask naybor to come over',
      'Request naybor to call for help',
    ],
  },
  safety: {
    id: 'safety',
    name: 'Safety',
    icon: '🛡️',
    description: 'Feeling unsafe - need a naybor nearby',
    urgencyLevel: 'critical',
    suggestedActions: [
      'Call 911 if in immediate danger',
      'Go to a naybor\'s place',
      'Ask naybor to come check on you',
    ],
  },
  lockout: {
    id: 'lockout',
    name: 'Locked Out',
    icon: '🔑',
    description: 'Locked out of your home',
    urgencyLevel: 'standard',
    suggestedActions: [
      'Wait at naybor\'s place',
      'Borrow phone to call locksmith',
      'Get spare key if naybor has one',
    ],
  },
  utility: {
    id: 'utility',
    name: 'Utility Issue',
    icon: '🔧',
    description: 'Water leak, power outage, gas smell, etc.',
    urgencyLevel: 'urgent',
    suggestedActions: [
      'Shut off main if gas smell - evacuate',
      'Ask naybor for help locating shutoffs',
      'Borrow supplies (flashlight, water, etc.)',
    ],
  },
  pet: {
    id: 'pet',
    name: 'Pet Help',
    icon: '🐕',
    description: 'Need help with pet - emergency vet trip, etc.',
    urgencyLevel: 'urgent',
    suggestedActions: [
      'Ask naybor to watch other pets',
      'Get ride to emergency vet',
      'Borrow pet supplies',
    ],
  },
  childcare: {
    id: 'childcare',
    name: 'Childcare',
    icon: '👶',
    description: 'Emergency childcare needed',
    urgencyLevel: 'urgent',
    suggestedActions: [
      'Ask naybor to watch kids briefly',
      'Have naybor meet kids at bus stop',
      'Emergency babysitting swap',
    ],
  },
  transport: {
    id: 'transport',
    name: 'Ride Needed',
    icon: '🚗',
    description: 'Need emergency transportation',
    urgencyLevel: 'urgent',
    suggestedActions: [
      'Get ride to hospital/urgent care',
      'Airport emergency',
      'Car broke down nearby',
    ],
  },
  other: {
    id: 'other',
    name: 'Other',
    icon: '❓',
    description: 'Other emergency or urgent need',
    urgencyLevel: 'standard',
    suggestedActions: [
      'Describe your situation',
      'Ask for specific help needed',
    ],
  },
};

export interface SOSMessage {
  id: string;
  category: SOSCategory;
  customMessage?: string;
  createdAt: Date;
  resolvedAt?: Date;
  contactedNaybors: string[]; // Friend IDs that were contacted
}

export interface NayborSOSConfig {
  enabled: boolean;
  quickAccessEnabled: boolean;
  preferredContactMethod: ContactMethod;
  autoIncludeLocation: boolean;
  emergencyMessage?: string; // Custom default message
}

export const DEFAULT_SOS_CONFIG: NayborSOSConfig = {
  enabled: true,
  quickAccessEnabled: true,
  preferredContactMethod: 'tel',
  autoIncludeLocation: false,
};

/**
 * Get naybors sorted by contact priority for SOS
 * Prioritizes those with phone numbers and recent contact
 */
export function getSortedSOSContacts(naybors: Friend[]): Friend[] {
  return [...naybors].sort((a, b) => {
    // Prioritize those with phone numbers
    const aHasPhone = !!a.phone;
    const bHasPhone = !!b.phone;
    if (aHasPhone !== bHasPhone) {
      return aHasPhone ? -1 : 1;
    }

    // Then by last contacted (more recent first)
    const aLastContact = a.lastContacted?.getTime() || 0;
    const bLastContact = b.lastContacted?.getTime() || 0;
    if (aLastContact !== bLastContact) {
      return bLastContact - aLastContact;
    }

    // Then by sort order if set
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }

    // Finally alphabetically
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get the quick contact list (top 3-5 naybors for SOS)
 */
export function getQuickSOSContacts(naybors: Friend[], count: number = 3): Friend[] {
  const sorted = getSortedSOSContacts(naybors);
  return sorted.slice(0, Math.min(count, sorted.length));
}

/**
 * Generate SOS message for a given category
 */
export function generateSOSMessage(
  category: SOSCategory,
  customMessage?: string,
  includeLocation?: boolean
): string {
  const categoryInfo = SOS_CATEGORIES[category];
  let message = `🆘 Naybor SOS - ${categoryInfo.name}\n\n`;

  if (customMessage) {
    message += customMessage;
  } else {
    message += categoryInfo.description;
  }

  if (includeLocation) {
    message += '\n\n📍 [Location will be shared]';
  }

  message += '\n\n— Sent via Inner Friend Circle Naybor SOS™';

  return message;
}

/**
 * Check if user has enough naybors for effective SOS network
 */
export function hasMinimumSOSNetwork(nayborCount: number): boolean {
  return nayborCount >= 3;
}

/**
 * Get SOS network status message
 */
export function getSOSNetworkStatus(nayborCount: number): {
  status: 'none' | 'minimal' | 'good' | 'strong';
  message: string;
  color: string;
} {
  if (nayborCount === 0) {
    return {
      status: 'none',
      message: 'No naybors yet - add naybors to enable Naybor SOS™',
      color: 'text-destructive',
    };
  }
  if (nayborCount < 3) {
    return {
      status: 'minimal',
      message: `Only ${nayborCount} naybor${nayborCount === 1 ? '' : 's'} - add more for a reliable SOS network`,
      color: 'text-warning',
    };
  }
  if (nayborCount < 10) {
    return {
      status: 'good',
      message: `${nayborCount} naybors in your SOS network`,
      color: 'text-tier-naybor',
    };
  }
  return {
    status: 'strong',
    message: `Strong SOS network with ${nayborCount} naybors`,
    color: 'text-tier-naybor',
  };
}

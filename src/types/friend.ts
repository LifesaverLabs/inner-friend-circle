export type TierType = 'core' | 'inner' | 'outer' | 'parasocial' | 'acquainted';

export type ContactMethod = 'tel' | 'facetime' | 'whatsapp' | 'signal' | 'telegram';

export const CONTACT_METHODS: Record<ContactMethod, { name: string; icon: string; getUrl: (phone: string) => string }> = {
  tel: { name: 'Phone Call', icon: '📞', getUrl: (phone) => `tel:${phone}` },
  facetime: { name: 'FaceTime', icon: '📱', getUrl: (phone) => `facetime:${phone}` },
  whatsapp: { name: 'WhatsApp', icon: '💬', getUrl: (phone) => `https://wa.me/${phone.replace(/\D/g, '')}` },
  signal: { name: 'Signal', icon: '🔐', getUrl: (phone) => `https://signal.me/#p/${phone.replace(/\D/g, '')}` },
  telegram: { name: 'Telegram', icon: '✈️', getUrl: (phone) => `https://t.me/${phone.replace(/\D/g, '')}` },
};

export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  preferredContact?: ContactMethod;
  tier: TierType;
  addedAt: Date;
  lastContacted?: Date;
  notes?: string;
  sortOrder?: number; // Custom sort order; if undefined, sort alphabetically
}

export interface ReservedSpots {
  core: number;
  inner: number;
  outer: number;
  parasocial: number;
  acquainted: number;
  notes: {
    core?: string;
    inner?: string;
    outer?: string;
    parasocial?: string;
    acquainted?: string;
  };
}

export interface FriendLists {
  friends: Friend[];
  reservedSpots: ReservedSpots;
}

export interface UserPreferences {
  mutualMatchNotifications: boolean;
  emailVerified: boolean;
}

export const TIER_LIMITS: Record<TierType, number> = {
  core: 5,
  inner: 15,
  outer: 150,
  parasocial: 25,
  acquainted: 1000,
};

export const TIER_INFO: Record<TierType, { 
  name: string; 
  description: string; 
  limit: number;
  color: string;
}> = {
  core: {
    name: 'Core',
    description: 'Your closest confidants — those who know your deepest self',
    limit: 5,
    color: 'tier-core',
  },
  inner: {
    name: 'Inner',
    description: 'Close friends you trust and turn to regularly',
    limit: 15,
    color: 'tier-inner',
  },
  outer: {
    name: 'Outer',
    description: 'Meaningful connections — acquaintances who matter',
    limit: 150,
    color: 'tier-outer',
  },
  parasocial: {
    name: 'Parasocials',
    description: 'One-sided connections — creators, celebrities, or figures you follow',
    limit: 25,
    color: 'tier-parasocial',
  },
  acquainted: {
    name: 'Acquainted Cousins',
    description: 'People you rarely see — reclassified here through lack of contact over time',
    limit: 1000,
    color: 'tier-acquainted',
  },
};
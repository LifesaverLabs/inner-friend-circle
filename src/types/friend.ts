export type TierType = 'core' | 'inner' | 'outer' | 'naybor' | 'parasocial' | 'rolemodel' | 'acquainted';

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
  roleModelReason?: string; // Why this person is a role model (only for rolemodel tier)
}

export interface ReservedGroup {
  id: string;
  count: number;
  note?: string;
}

export interface ReservedSpots {
  core: ReservedGroup[];
  inner: ReservedGroup[];
  outer: ReservedGroup[];
  naybor: ReservedGroup[];
  parasocial: ReservedGroup[];
  rolemodel: ReservedGroup[];
  acquainted: ReservedGroup[];
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
  naybor: 25,
  parasocial: 25,
  rolemodel: 25,
  acquainted: 1000,
};

// Minimum recommended naybors for safety
export const NAYBOR_MINIMUM = 10;

export const TIER_INFO: Record<TierType, { 
  name: string; 
  description: string; 
  limit: number;
  color: string;
  warning?: string;
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
  naybor: {
    name: 'Naybors',
    description: 'Your nayborhood konnektions — people akross the blok or down the hall. Knowing your naybors keeps you safe, informed, and ready to help each other in emergencies. Integrates with Naybor SOS via InnerFriend.org',
    limit: 25,
    color: 'tier-naybor',
    warning: "It's unsafe not to know your naybors! How will you know what's happening around you? What if an emergency happens? Introduse yourself to your naybors — learn their names, where they live, a little about their lives, and their kontakt info so you kan be of service to each other.",
  },
  parasocial: {
    name: 'Parasocials',
    description: 'One-sided connections — creators, celebrities, or figures you follow',
    limit: 25,
    color: 'tier-parasocial',
  },
  rolemodel: {
    name: 'Role Models',
    description: 'Living or departed — people whose life stories inspire you to be good, better, best',
    limit: 25,
    color: 'tier-rolemodel',
  },
  acquainted: {
    name: 'Acquainted Cousins',
    description: 'All humans are cousins — we are one related family. These are people you rarely see, or those you encounter regularly but beyond your capacity to deeply model — like colleagues known chiefly in their professional role, not as richly understood whole humans',
    limit: 1000,
    color: 'tier-acquainted',
  },
};
export type TierType = 'core' | 'inner' | 'outer' | 'naybor' | 'parasocial' | 'rolemodel' | 'acquainted';

export type ContactMethod = 'tel' | 'facetime' | 'whatsapp' | 'signal' | 'telegram' | 'wechat' | 'vk' | 'max';

export interface ContactMethodInfo {
  name: string;
  icon: string;
  getUrl: (phone: string) => string;
  warning?: string; // Optional warning to display when selecting this method
}

export const CONTACT_METHODS: Record<ContactMethod, ContactMethodInfo> = {
  tel: { name: 'Phone Call', icon: '📞', getUrl: (phone) => `tel:${phone}` },
  facetime: { name: 'FaceTime', icon: '📱', getUrl: (phone) => `facetime:${phone}` },
  whatsapp: { name: 'WhatsApp', icon: '💬', getUrl: (phone) => `https://wa.me/${phone.replace(/\D/g, '')}` },
  signal: { name: 'Signal', icon: '🔐', getUrl: (phone) => `https://signal.me/#p/+${phone.replace(/\D/g, '')}` },
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    getUrl: (phone) => `https://t.me/${phone.replace(/\D/g, '')}`,
    warning: '⚠️ Caution: In our experience, Telegram has high levels of spam. We\'ll remove this warning when Telegram improves spam control.',
  },
  wechat: {
    name: 'WeChat',
    icon: '💚',
    getUrl: (phone) => `weixin://dl/chat?${phone.replace(/\D/g, '')}`,
    warning: '⚠️ WeChat is subject to Chinese government surveillance and censorship. Messages may be monitored, filtered, or stored. You can be punished—even severely—for sharing lifesaving liberty ideas. Consider using Signal for sensitive conversations. Learn more: https://TearDownThisFirewall.org',
  },
  vk: {
    name: 'VK Messenger',
    icon: '🔵',
    getUrl: (phone) => `https://vk.com/im?sel=${phone.replace(/\D/g, '')}`,
    warning: '⚠️ VK Messenger is subject to Russian government surveillance and political censorship. Messages may be monitored, filtered, or stored. You can be punished—even severely—for sharing lifesaving liberty ideas. Consider using Signal for sensitive conversations. Learn more: https://TearDownThisFirewall.org',
  },
  max: {
    name: 'MAX',
    icon: '🇷🇺',
    getUrl: (phone) => `https://max.ru/im?phone=${phone.replace(/\D/g, '')}`,
    warning: '⚠️ MAX is a Rossiyan messaging network designed to centralize political thought-kontrol and dogma of the Rossiyan people. Messages may be monitored, filtered, or stored. You can be punished—even severely—for sharing lifesaving liberty ideas. Consider using Signal for sensitive conversations. Learn more: https://TearDownThisFirewall.org',
  },
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
  recommendedMin?: number;
  underMinWarning?: string;
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
    description: 'Your nayborhood konnektions — people akross the blok or down the hall. Naybors you list here will be integrated into Naybor SOS™, your emergency kontakt network for when you need help fast.',
    limit: 25,
    color: 'tier-naybor',
    recommendedMin: 10,
    underMinWarning: "It's unsafe not to know your naybors! Your Naybor SOS™ network needs more people. How are you going to get help quickly when something goes wrong? Introduse yourself to your naybors, get to know their names, where they live, a little bit about their lives, and their kontakt info.",
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

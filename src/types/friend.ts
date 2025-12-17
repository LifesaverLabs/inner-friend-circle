export type TierType = 'core' | 'inner' | 'outer';

export interface Friend {
  id: string;
  name: string;
  email?: string;
  tier: TierType;
  addedAt: Date;
  notes?: string;
}

export interface ReservedSpots {
  core: number;
  inner: number;
  outer: number;
  notes: {
    core?: string;
    inner?: string;
    outer?: string;
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
};
import { TierType, Friend } from './friend';
import { HomeEntryPreferences } from './keysShared';

// Post content types - high-fidelity interactions are boosted
export type PostContentType =
  | 'text'           // Low fidelity - standard text post
  | 'photo'          // Medium fidelity
  | 'voice_note'     // High fidelity - prioritized
  | 'video'          // High fidelity
  | 'call_invite'    // High fidelity - call button
  | 'meetup_invite'  // High fidelity - calendared meetup
  | 'proximity_ping' // High fidelity - "I'm nearby!"
  | 'life_update';   // Medium fidelity - significant life event

// Interaction types - likes are deprioritized in Core/Inner
export type InteractionType =
  | 'like'           // Low fidelity - deprioritized
  | 'comment'        // Medium fidelity
  | 'voice_reply'    // High fidelity
  | 'call_accepted'  // High fidelity
  | 'meetup_rsvp'    // High fidelity
  | 'share';         // Medium fidelity

// Fidelity levels for the bridging protocol
export type FidelityLevel = 'low' | 'medium' | 'high';

export const CONTENT_FIDELITY: Record<PostContentType, FidelityLevel> = {
  text: 'low',
  photo: 'medium',
  voice_note: 'high',
  video: 'high',
  call_invite: 'high',
  meetup_invite: 'high',
  proximity_ping: 'high',
  life_update: 'medium',
};

export const INTERACTION_FIDELITY: Record<InteractionType, FidelityLevel> = {
  like: 'low',
  comment: 'medium',
  voice_reply: 'high',
  call_accepted: 'high',
  meetup_rsvp: 'high',
  share: 'medium',
};

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTier: TierType;
  contentType: PostContentType;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  // For meetup/call invites
  scheduledAt?: Date;
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
  };
  // Interactions
  interactions: PostInteraction[];
  // Visibility - who can see this post
  visibility: TierType[];
  // Whether this is suggested/algorithmic content (should be filtered from Core feed)
  isSuggested: boolean;
  // Whether this is sponsored/ad content (should NEVER appear in Core feed)
  isSponsored: boolean;
}

export interface PostInteraction {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  type: InteractionType;
  content?: string; // For comments/voice replies
  createdAt: Date;
}

// Sunset nudge - reminder to contact friends
export interface SunsetNudge {
  id: string;
  friendId: string;
  friendName: string;
  friendTier: TierType;
  lastDeepContact: Date | null;
  daysSinceContact: number;
  suggestedAction: 'schedule_call' | 'send_voice_note' | 'plan_meetup';
  dismissed: boolean;
  dismissedAt?: Date;
}

// Notification with tier-based priority
export type NotificationType =
  | 'post'
  | 'interaction'
  | 'nudge'
  | 'proximity'
  | 'meetup_reminder'
  | 'call_invite';

export interface FeedNotification {
  id: string;
  type: NotificationType;
  fromTier: TierType;
  title: string;
  body: string;
  postId?: string;
  friendId?: string;
  createdAt: Date;
  read: boolean;
  // Priority based on tier (Core = highest)
  priority: 'immediate' | 'batched' | 'quiet';
}

// Notification settings per tier
export interface NotificationSettings {
  // Core: immediate by default
  core: {
    enabled: boolean;
    mode: 'immediate' | 'batched' | 'quiet';
    soundEnabled: boolean;
  };
  // Inner: immediate or batched
  inner: {
    enabled: boolean;
    mode: 'immediate' | 'batched' | 'quiet';
    soundEnabled: boolean;
  };
  // Outer: batched by default
  outer: {
    enabled: boolean;
    mode: 'batched' | 'quiet';
    batchIntervalMinutes: number;
  };
  // Others: quiet by default
  naybor: {
    enabled: boolean;
    mode: 'batched' | 'quiet';
  };
  parasocial: {
    enabled: boolean;
    mode: 'quiet';
  };
  rolemodel: {
    enabled: boolean;
    mode: 'quiet';
  };
  acquainted: {
    enabled: boolean;
    mode: 'quiet';
  };
}

// Privacy settings per tier - what each tier can see
export interface PrivacySettings {
  core: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  inner: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  outer: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  naybor: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  parasocial: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  rolemodel: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
  acquainted: {
    canSeeLocation: boolean;
    canSeeOnlineStatus: boolean;
    canSeeLastActive: boolean;
    canSeeFullProfile: boolean;
    canSeeLifeUpdates: boolean;
  };
}

// Default privacy settings - Core sees most, Outer sees less
export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  core: {
    canSeeLocation: true,
    canSeeOnlineStatus: true,
    canSeeLastActive: true,
    canSeeFullProfile: true,
    canSeeLifeUpdates: true,
  },
  inner: {
    canSeeLocation: true,
    canSeeOnlineStatus: true,
    canSeeLastActive: true,
    canSeeFullProfile: true,
    canSeeLifeUpdates: true,
  },
  outer: {
    canSeeLocation: false,
    canSeeOnlineStatus: true,
    canSeeLastActive: false,
    canSeeFullProfile: true,
    canSeeLifeUpdates: true,
  },
  naybor: {
    canSeeLocation: true, // Naybors need to know general location
    canSeeOnlineStatus: false,
    canSeeLastActive: false,
    canSeeFullProfile: false,
    canSeeLifeUpdates: false,
  },
  parasocial: {
    canSeeLocation: false,
    canSeeOnlineStatus: false,
    canSeeLastActive: false,
    canSeeFullProfile: false,
    canSeeLifeUpdates: false,
  },
  rolemodel: {
    canSeeLocation: false,
    canSeeOnlineStatus: false,
    canSeeLastActive: false,
    canSeeFullProfile: false,
    canSeeLifeUpdates: false,
  },
  acquainted: {
    canSeeLocation: false,
    canSeeOnlineStatus: false,
    canSeeLastActive: false,
    canSeeFullProfile: false,
    canSeeLifeUpdates: false,
  },
};

// Default notification settings
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  core: {
    enabled: true,
    mode: 'immediate',
    soundEnabled: true,
  },
  inner: {
    enabled: true,
    mode: 'immediate',
    soundEnabled: true,
  },
  outer: {
    enabled: true,
    mode: 'batched',
    batchIntervalMinutes: 60,
  },
  naybor: {
    enabled: true,
    mode: 'quiet',
  },
  parasocial: {
    enabled: true,
    mode: 'quiet',
  },
  rolemodel: {
    enabled: false,
    mode: 'quiet',
  },
  acquainted: {
    enabled: false,
    mode: 'quiet',
  },
};

// Sunset nudge thresholds per tier (days without deep contact)
// Note: Acquainted uses a special annual review system, not day-based threshold
export const SUNSET_NUDGE_THRESHOLDS: Record<TierType, number> = {
  core: 14,      // 2 weeks
  inner: 30,     // 1 month
  outer: 90,     // 3 months
  naybor: 60,    // 2 months
  parasocial: Infinity, // No nudges for parasocial
  rolemodel: Infinity,  // No nudges for role models
  acquainted: Infinity, // Uses annual review system instead (see ACQUAINTED_NUDGE_CONFIG)
};

// Acquainted Cousins use a special annual review system:
// - Only eligible after 12 months of being added
// - Nudges appear on the 1st of each month
// - ~1/12 of eligible cousins per month (spread evenly)
// - Systematic coverage of all eligible cousins over 12 months
// - Bulk adds are spread out using deterministic hash assignment
export const ACQUAINTED_NUDGE_CONFIG = {
  minimumAgeMonths: 12,     // Must be in circles for 1 year before first nudge
  nudgeDayOfMonth: 1,       // First day of each month
  monthlyBatchFraction: 12, // Divide eligible list into 12 monthly batches
} as const;

// Actions available when responding to an acquainted cousin nudge
export type AcquaintedNudgeAction =
  | 'keep_in_circles'      // Confirm they're still relevant
  | 'promote_to_outer'     // They've become more important
  | 'remove_from_circles'  // No longer relevant
  | 'snooze_6_months';     // Check again later

// Acquainted nudge batch for monthly processing
export interface AcquaintedNudgeBatch {
  friends: Array<{
    id: string;
    name: string;
    addedAt: Date;
    lastContacted?: Date;
  }>;
  currentMonth: number;    // 1-12
  currentYear: number;
  totalEligible: number;
  isNudgeDay: boolean;
}

// Exportable social graph format for data portability
// Follows Data Liberation Front principles: your data belongs to you
export interface ExportableSocialGraph {
  version: string;
  exportedAt: Date;
  userId: string;
  friends: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    tier: TierType;
    addedAt: Date;
    lastContacted?: Date;
    notes?: string;
  }>;
  posts: Array<{
    id: string;
    contentType: PostContentType;
    content: string;
    createdAt: Date;
    visibility: TierType[];
  }>;
  interactions: Array<{
    postId: string;
    type: InteractionType;
    createdAt: Date;
  }>;
  settings: {
    privacy: PrivacySettings;
    notifications: NotificationSettings;
  };
  /**
   * Keys Shared preferences for emergency home access
   * GDPR: This is personal data about your home security preferences
   */
  keysShared?: HomeEntryPreferences;
}

// Feed filter options
export interface FeedFilters {
  tiers: TierType[];
  contentTypes: PostContentType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  fidelityLevel?: FidelityLevel;
  excludeSuggested: boolean;
  excludeSponsored: boolean;
}

// Feed state
export interface FeedState {
  posts: FeedPost[];
  nudges: SunsetNudge[];
  notifications: FeedNotification[];
  unreadCount: number;
  filters: FeedFilters;
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  lastFetched: Date | null;
  isLoading: boolean;
  error: string | null;
}

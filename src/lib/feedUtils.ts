import { TierType, Friend } from '@/types/friend';
import {
  FeedPost,
  PostInteraction,
  SunsetNudge,
  FeedNotification,
  FidelityLevel,
  PostContentType,
  InteractionType,
  CONTENT_FIDELITY,
  INTERACTION_FIDELITY,
  SUNSET_NUDGE_THRESHOLDS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  PrivacySettings,
} from '@/types/feed';

// ============================================================================
// Feed Filtering & Sorting
// ============================================================================

/**
 * Get Core feed posts - chronological, no suggested content, no ads
 */
export function getCoreFeed(posts: FeedPost[]): FeedPost[] {
  return posts
    .filter(p => p.authorTier === 'core' && !p.isSuggested && !p.isSponsored)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get feed posts for a specific tier
 */
export function getTierFeed(posts: FeedPost[], tier: TierType): FeedPost[] {
  return posts
    .filter(p => p.authorTier === tier && !p.isSuggested && !p.isSponsored)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get filtered feed with multiple options
 */
export function getFilteredFeed(
  posts: FeedPost[],
  options: {
    tiers?: TierType[];
    fidelityLevel?: FidelityLevel;
    excludeSuggested?: boolean;
    excludeSponsored?: boolean;
    dateRange?: { start: Date; end: Date };
  }
): FeedPost[] {
  const {
    tiers,
    fidelityLevel,
    excludeSuggested = true,
    excludeSponsored = true,
    dateRange,
  } = options;

  return posts
    .filter(p => {
      // Filter by tiers
      if (tiers && !tiers.includes(p.authorTier)) return false;

      // Filter suggested content
      if (excludeSuggested && p.isSuggested) return false;

      // Filter sponsored content
      if (excludeSponsored && p.isSponsored) return false;

      // Filter by fidelity level
      if (fidelityLevel) {
        const postFidelity = CONTENT_FIDELITY[p.contentType];
        if (fidelityLevel === 'high' && postFidelity !== 'high') return false;
        if (fidelityLevel === 'medium' && postFidelity === 'low') return false;
      }

      // Filter by date range
      if (dateRange) {
        const postTime = p.createdAt.getTime();
        if (postTime < dateRange.start.getTime() || postTime > dateRange.end.getTime()) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// ============================================================================
// Fidelity & Bridging Protocol
// ============================================================================

/**
 * Get content fidelity level
 */
export function getContentFidelity(contentType: PostContentType): FidelityLevel {
  return CONTENT_FIDELITY[contentType];
}

/**
 * Get interaction fidelity level
 */
export function getInteractionFidelity(interactionType: InteractionType): FidelityLevel {
  return INTERACTION_FIDELITY[interactionType];
}

/**
 * Check if likes should be shown prominently (deprioritized in Core/Inner)
 */
export function shouldShowLikeCount(tier: TierType): boolean {
  // Don't prominently show likes in Core/Inner - friction for low-fidelity
  return tier !== 'core' && tier !== 'inner';
}

/**
 * Sort interactions by fidelity (high fidelity first)
 */
export function sortInteractionsByFidelity(interactions: PostInteraction[]): PostInteraction[] {
  const fidelityOrder: Record<FidelityLevel, number> = { high: 0, medium: 1, low: 2 };

  return [...interactions].sort((a, b) => {
    const fidelityA = INTERACTION_FIDELITY[a.type];
    const fidelityB = INTERACTION_FIDELITY[b.type];
    return fidelityOrder[fidelityA] - fidelityOrder[fidelityB];
  });
}

/**
 * Get notification priority based on tier and interaction fidelity
 */
export function getNotificationPriority(
  tier: TierType,
  interactionType?: InteractionType
): 'immediate' | 'batched' | 'quiet' {
  const settings = DEFAULT_NOTIFICATION_SETTINGS[tier];

  if (!settings.enabled) return 'quiet';

  // For Core/Inner with interaction type
  if (interactionType && (tier === 'core' || tier === 'inner')) {
    const fidelity = INTERACTION_FIDELITY[interactionType];
    // Low fidelity interactions (likes) are batched even from Core/Inner
    if (fidelity === 'low') return 'batched';
    // High fidelity gets immediate
    if (fidelity === 'high') return 'immediate';
  }

  return settings.mode as 'immediate' | 'batched' | 'quiet';
}

/**
 * Get content notification priority based on tier and content type
 */
export function getContentNotificationPriority(
  tier: TierType,
  contentType: PostContentType
): 'immediate' | 'batched' | 'quiet' {
  const settings = DEFAULT_NOTIFICATION_SETTINGS[tier];

  if (!settings.enabled) return 'quiet';

  const fidelity = CONTENT_FIDELITY[contentType];

  // High fidelity content from close tiers gets immediate notification
  if ((tier === 'core' || tier === 'inner') && fidelity === 'high') {
    return 'immediate';
  }

  return settings.mode as 'immediate' | 'batched' | 'quiet';
}

// ============================================================================
// Sunset Nudges (Non-Acquainted Tiers)
// ============================================================================

/**
 * Calculate days since last contact
 */
export function getDaysSinceContact(lastContacted: Date | undefined | null, now: Date = new Date()): number {
  if (!lastContacted) return Infinity;
  return Math.floor((now.getTime() - lastContacted.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * Check if a friend should receive a sunset nudge (non-acquainted tiers)
 */
export function shouldNudgeFriend(friend: Friend, now: Date = new Date()): boolean {
  const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];

  // Infinity means no nudges for this tier
  if (threshold === Infinity) return false;

  const daysSince = getDaysSinceContact(friend.lastContacted, now);
  return daysSince >= threshold;
}

/**
 * Get suggested action for a nudge based on tier
 */
export function getSuggestedNudgeAction(tier: TierType): 'schedule_call' | 'send_voice_note' | 'plan_meetup' {
  switch (tier) {
    case 'core':
      return 'schedule_call';
    case 'inner':
      return 'send_voice_note';
    default:
      return 'plan_meetup';
  }
}

/**
 * Generate sunset nudges for friends (excludes acquainted - they use annual system)
 */
export function generateSunsetNudges(friends: Friend[], now: Date = new Date()): SunsetNudge[] {
  return friends
    .filter(f => shouldNudgeFriend(f, now))
    .map(friend => ({
      id: `nudge-${friend.id}-${now.getTime()}`,
      friendId: friend.id,
      friendName: friend.name,
      friendTier: friend.tier,
      lastDeepContact: friend.lastContacted || null,
      daysSinceContact: getDaysSinceContact(friend.lastContacted, now),
      suggestedAction: getSuggestedNudgeAction(friend.tier),
      dismissed: false,
    }));
}

/**
 * Generate nudge message
 */
export function generateNudgeMessage(friend: Friend): string {
  const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
  return `No deep contact with ${friend.name} in ${threshold} days—schedule?`;
}

// ============================================================================
// Privacy & Visibility
// ============================================================================

/**
 * Check if a viewer tier can see a specific field
 */
export function canViewerSee(
  viewerTier: TierType,
  field: keyof PrivacySettings['core'],
  privacySettings: PrivacySettings = DEFAULT_PRIVACY_SETTINGS
): boolean {
  return privacySettings[viewerTier][field];
}

/**
 * Check if a post is visible to a viewer based on visibility array
 */
export function canViewPost(viewerTier: TierType, postVisibility: TierType[]): boolean {
  return postVisibility.includes(viewerTier);
}

/**
 * Get visible content based on viewer's tier privacy settings
 */
export function getVisibleContent(
  viewerTier: TierType,
  post: FeedPost,
  privacySettings: PrivacySettings = DEFAULT_PRIVACY_SETTINGS
): Partial<FeedPost> {
  const settings = privacySettings[viewerTier];

  const visible: Partial<FeedPost> = {
    id: post.id,
    authorId: post.authorId,
    authorName: post.authorName,
    authorTier: post.authorTier,
    contentType: post.contentType,
    content: post.content,
    createdAt: post.createdAt,
    interactions: post.interactions,
    visibility: post.visibility,
    isSuggested: post.isSuggested,
    isSponsored: post.isSponsored,
  };

  // Only include location if viewer can see it
  if (settings.canSeeLocation && post.location) {
    visible.location = post.location;
  }

  // Only include scheduled time if viewer can see it (based on life updates permission)
  if (settings.canSeeLifeUpdates && post.scheduledAt) {
    visible.scheduledAt = post.scheduledAt;
  }

  return visible;
}

// ============================================================================
// Notification Helpers
// ============================================================================

/**
 * Check if notifications are enabled for a tier
 */
export function isNotificationEnabled(tier: TierType): boolean {
  return DEFAULT_NOTIFICATION_SETTINGS[tier].enabled;
}

/**
 * Get batch interval for outer notifications
 */
export function getOuterBatchInterval(): number {
  return DEFAULT_NOTIFICATION_SETTINGS.outer.batchIntervalMinutes;
}

/**
 * Filter notifications by priority
 */
export function filterNotificationsByPriority(
  notifications: FeedNotification[],
  priority: 'immediate' | 'batched' | 'quiet'
): FeedNotification[] {
  return notifications.filter(n => n.priority === priority);
}

/**
 * Get unread notification count
 */
export function getUnreadCount(notifications: FeedNotification[]): number {
  return notifications.filter(n => !n.read).length;
}

/**
 * Create a notification with proper priority
 */
export function createNotification(
  type: FeedNotification['type'],
  fromTier: TierType,
  title: string,
  body: string,
  options: {
    postId?: string;
    friendId?: string;
    interactionType?: InteractionType;
  } = {}
): FeedNotification {
  const priority = options.interactionType
    ? getNotificationPriority(fromTier, options.interactionType)
    : getNotificationPriority(fromTier);

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    fromTier,
    title,
    body,
    postId: options.postId,
    friendId: options.friendId,
    createdAt: new Date(),
    read: false,
    priority,
  };
}

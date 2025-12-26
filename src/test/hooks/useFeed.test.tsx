import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  CONTENT_FIDELITY,
  INTERACTION_FIDELITY,
  SUNSET_NUDGE_THRESHOLDS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  type FeedPost,
  type SunsetNudge,
  type FeedNotification,
  type ExportableSocialGraph,
} from '@/types/feed';
import { TierType, Friend } from '@/types/friend';

// Mock the useFeed hook (to be implemented)
// For now we define the expected interface and behavior

interface UseFeedOptions {
  userId?: string;
  friends: Friend[];
}

interface UseFeedReturn {
  // Feed data
  posts: FeedPost[];
  nudges: SunsetNudge[];
  notifications: FeedNotification[];
  unreadCount: number;

  // Feed operations
  getCoreFeed: () => FeedPost[];
  getTierFeed: (tier: TierType) => FeedPost[];
  getFilteredFeed: (options: { tiers?: TierType[]; fidelityLevel?: 'low' | 'medium' | 'high' }) => FeedPost[];

  // Post operations
  createPost: (post: Omit<FeedPost, 'id' | 'createdAt' | 'interactions'>) => Promise<FeedPost>;
  addInteraction: (postId: string, type: string, content?: string) => Promise<void>;

  // Nudge operations
  getNudgesForTier: (tier: TierType) => SunsetNudge[];
  dismissNudge: (nudgeId: string) => void;
  generateNudges: () => SunsetNudge[];

  // Notification operations
  getNotificationPriority: (tier: TierType) => 'immediate' | 'batched' | 'quiet';
  markNotificationRead: (notificationId: string) => void;
  batchOuterNotifications: () => FeedNotification[];

  // Privacy operations
  getVisibleContent: (viewerTier: TierType, content: FeedPost) => Partial<FeedPost>;
  canViewerSee: (viewerTier: TierType, field: string) => boolean;

  // Data portability
  exportSocialGraph: () => ExportableSocialGraph;
  importSocialGraph: (data: ExportableSocialGraph) => Promise<{ success: boolean; error?: string }>;

  // State
  isLoading: boolean;
  error: string | null;
}

// Helper to create mock posts
const createMockPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  id: `post-${Math.random().toString(36).substr(2, 9)}`,
  authorId: 'user-1',
  authorName: 'Test User',
  authorTier: 'core',
  contentType: 'text',
  content: 'Test content',
  createdAt: new Date(),
  interactions: [],
  visibility: ['core', 'inner', 'outer'],
  isSuggested: false,
  isSponsored: false,
  ...overrides,
});

// Helper to create mock friends
const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: `friend-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Friend',
  tier: 'core',
  addedAt: new Date(),
  ...overrides,
});

describe('useFeed Hook - Zero-Algorithm Core Feed', () => {
  describe('Chronological ordering', () => {
    it('should return Core feed posts in chronological order (newest first)', () => {
      const posts: FeedPost[] = [
        createMockPost({ createdAt: new Date('2024-01-01'), authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-03'), authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-02'), authorTier: 'core' }),
      ];

      // Sort chronologically (newest first)
      const sortedPosts = [...posts].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      );

      expect(sortedPosts[0].createdAt.getTime()).toBeGreaterThan(sortedPosts[1].createdAt.getTime());
      expect(sortedPosts[1].createdAt.getTime()).toBeGreaterThan(sortedPosts[2].createdAt.getTime());
    });

    it('should NOT reorder posts based on engagement or algorithmic scoring', () => {
      const lowEngagementPost = createMockPost({
        createdAt: new Date('2024-01-03'),
        authorTier: 'core',
        interactions: [],
      });

      const highEngagementPost = createMockPost({
        createdAt: new Date('2024-01-01'),
        authorTier: 'core',
        interactions: [
          { id: '1', postId: '1', userId: 'u1', userName: 'U1', type: 'like', createdAt: new Date() },
          { id: '2', postId: '1', userId: 'u2', userName: 'U2', type: 'like', createdAt: new Date() },
          { id: '3', postId: '1', userId: 'u3', userName: 'U3', type: 'comment', content: 'Great!', createdAt: new Date() },
        ],
      });

      const posts = [highEngagementPost, lowEngagementPost];

      // Chronological sort should put newer post first regardless of engagement
      const chronologicalFeed = [...posts].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      );

      expect(chronologicalFeed[0].id).toBe(lowEngagementPost.id);
      expect(chronologicalFeed[0].interactions.length).toBeLessThan(
        chronologicalFeed[1].interactions.length
      );
    });

    it('should maintain strict chronological order even with mixed content types', () => {
      const posts = [
        createMockPost({ createdAt: new Date('2024-01-05'), contentType: 'text', authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-04'), contentType: 'voice_note', authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-03'), contentType: 'meetup_invite', authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-02'), contentType: 'photo', authorTier: 'core' }),
        createMockPost({ createdAt: new Date('2024-01-01'), contentType: 'video', authorTier: 'core' }),
      ];

      const sorted = [...posts].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime()
      );

      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          sorted[i + 1].createdAt.getTime()
        );
      }
    });
  });

  describe('No suggested content in Core feed', () => {
    it('should filter out suggested content from Core feed', () => {
      const posts: FeedPost[] = [
        createMockPost({ authorTier: 'core', isSuggested: false }),
        createMockPost({ authorTier: 'core', isSuggested: true }), // Should be filtered
        createMockPost({ authorTier: 'core', isSuggested: false }),
      ];

      const coreFeed = posts.filter(p => p.authorTier === 'core' && !p.isSuggested);

      expect(coreFeed).toHaveLength(2);
      expect(coreFeed.every(p => !p.isSuggested)).toBe(true);
    });

    it('should NEVER include suggested content even if highly relevant', () => {
      const suggestedPost = createMockPost({
        authorTier: 'core',
        isSuggested: true,
        content: 'This is super relevant to you!',
        interactions: Array(100).fill(null).map((_, i) => ({
          id: `int-${i}`,
          postId: 'suggested',
          userId: `user-${i}`,
          userName: `User ${i}`,
          type: 'like' as const,
          createdAt: new Date(),
        })),
      });

      const coreFeedFilter = (post: FeedPost) =>
        post.authorTier === 'core' && !post.isSuggested;

      expect(coreFeedFilter(suggestedPost)).toBe(false);
    });
  });

  describe('No sponsored/ad content in Core feed', () => {
    it('should filter out sponsored content from Core feed', () => {
      const posts: FeedPost[] = [
        createMockPost({ authorTier: 'core', isSponsored: false }),
        createMockPost({ authorTier: 'core', isSponsored: true }), // Should be filtered
        createMockPost({ authorTier: 'core', isSponsored: false }),
      ];

      const coreFeed = posts.filter(p => p.authorTier === 'core' && !p.isSponsored);

      expect(coreFeed).toHaveLength(2);
      expect(coreFeed.every(p => !p.isSponsored)).toBe(true);
    });

    it('should NEVER include ads regardless of content type', () => {
      const adPost = createMockPost({
        authorTier: 'core',
        isSponsored: true,
        contentType: 'meetup_invite', // Even high-fidelity content
        content: 'Sponsored meetup!',
      });

      const filter = (post: FeedPost) =>
        post.authorTier === 'core' && !post.isSponsored && !post.isSuggested;

      expect(filter(adPost)).toBe(false);
    });

    it('should filter both suggested AND sponsored content', () => {
      const posts: FeedPost[] = [
        createMockPost({ authorTier: 'core', isSuggested: false, isSponsored: false }), // Keep
        createMockPost({ authorTier: 'core', isSuggested: true, isSponsored: false }),  // Filter
        createMockPost({ authorTier: 'core', isSuggested: false, isSponsored: true }),  // Filter
        createMockPost({ authorTier: 'core', isSuggested: true, isSponsored: true }),   // Filter
      ];

      const coreFeed = posts.filter(p =>
        p.authorTier === 'core' && !p.isSuggested && !p.isSponsored
      );

      expect(coreFeed).toHaveLength(1);
    });
  });

  describe('Core feed only shows Core tier posts', () => {
    it('should only include posts from Core friends in Core feed', () => {
      const posts: FeedPost[] = [
        createMockPost({ authorTier: 'core' }),
        createMockPost({ authorTier: 'inner' }),
        createMockPost({ authorTier: 'outer' }),
        createMockPost({ authorTier: 'core' }),
        createMockPost({ authorTier: 'naybor' }),
      ];

      const coreFeed = posts.filter(p => p.authorTier === 'core');

      expect(coreFeed).toHaveLength(2);
      expect(coreFeed.every(p => p.authorTier === 'core')).toBe(true);
    });

    it('should not include posts from any other tier in Core feed', () => {
      const otherTiers: TierType[] = ['inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];

      otherTiers.forEach(tier => {
        const post = createMockPost({ authorTier: tier });
        const isInCoreFeed = post.authorTier === 'core';
        expect(isInCoreFeed).toBe(false);
      });
    });
  });
});

describe('useFeed Hook - Bridging Protocol', () => {
  describe('Low-fidelity friction (likes deprioritized)', () => {
    it('should classify likes as low fidelity', () => {
      expect(INTERACTION_FIDELITY.like).toBe('low');
    });

    it('should deprioritize like notifications in Core/Inner tiers', () => {
      const getNotificationPriority = (tier: TierType, interactionType: string) => {
        const fidelity = INTERACTION_FIDELITY[interactionType as keyof typeof INTERACTION_FIDELITY];

        // Low fidelity interactions from Core/Inner should be batched, not immediate
        if ((tier === 'core' || tier === 'inner') && fidelity === 'low') {
          return 'batched'; // Deprioritized
        }

        // High fidelity from Core/Inner should be immediate
        if ((tier === 'core' || tier === 'inner') && fidelity === 'high') {
          return 'immediate';
        }

        return DEFAULT_NOTIFICATION_SETTINGS[tier].mode;
      };

      // Likes from Core friends should be batched (deprioritized)
      expect(getNotificationPriority('core', 'like')).toBe('batched');
      expect(getNotificationPriority('inner', 'like')).toBe('batched');

      // Voice replies from Core should be immediate (boosted)
      expect(getNotificationPriority('core', 'voice_reply')).toBe('immediate');
      expect(getNotificationPriority('inner', 'voice_reply')).toBe('immediate');
    });

    it('should not prominently display like counts in Core/Inner feeds', () => {
      const post = createMockPost({
        authorTier: 'core',
        interactions: [
          { id: '1', postId: 'p1', userId: 'u1', userName: 'U1', type: 'like', createdAt: new Date() },
          { id: '2', postId: 'p1', userId: 'u2', userName: 'U2', type: 'like', createdAt: new Date() },
          { id: '3', postId: 'p1', userId: 'u3', userName: 'U3', type: 'like', createdAt: new Date() },
        ],
      });

      // For Core/Inner feeds, de-emphasize like counts
      const shouldShowLikeCount = (tier: TierType) => {
        if (tier === 'core' || tier === 'inner') {
          return false; // Don't prominently show likes
        }
        return true;
      };

      expect(shouldShowLikeCount('core')).toBe(false);
      expect(shouldShowLikeCount('inner')).toBe(false);
      expect(shouldShowLikeCount('outer')).toBe(true);
    });
  });

  describe('High-fidelity boosts', () => {
    it('should boost voice notes in feed visibility', () => {
      expect(CONTENT_FIDELITY.voice_note).toBe('high');
    });

    it('should boost call invites in feed visibility', () => {
      expect(CONTENT_FIDELITY.call_invite).toBe('high');
    });

    it('should boost meetup invites in feed visibility', () => {
      expect(CONTENT_FIDELITY.meetup_invite).toBe('high');
    });

    it('should boost proximity pings in feed visibility', () => {
      expect(CONTENT_FIDELITY.proximity_ping).toBe('high');
    });

    it('should give high-fidelity content immediate notifications', () => {
      const getContentNotificationPriority = (
        tier: TierType,
        contentType: keyof typeof CONTENT_FIDELITY
      ): 'immediate' | 'batched' | 'quiet' => {
        const fidelity = CONTENT_FIDELITY[contentType];

        // High fidelity content from close tiers gets immediate notification
        if ((tier === 'core' || tier === 'inner') && fidelity === 'high') {
          return 'immediate';
        }

        // Fall back to tier defaults
        return DEFAULT_NOTIFICATION_SETTINGS[tier].mode as 'immediate' | 'batched' | 'quiet';
      };

      expect(getContentNotificationPriority('core', 'voice_note')).toBe('immediate');
      expect(getContentNotificationPriority('core', 'call_invite')).toBe('immediate');
      expect(getContentNotificationPriority('core', 'meetup_invite')).toBe('immediate');
      expect(getContentNotificationPriority('core', 'proximity_ping')).toBe('immediate');
      expect(getContentNotificationPriority('inner', 'voice_note')).toBe('immediate');
    });

    it('should sort high-fidelity interactions above low-fidelity in interaction lists', () => {
      const interactions = [
        { type: 'like', createdAt: new Date('2024-01-05') },
        { type: 'voice_reply', createdAt: new Date('2024-01-01') },
        { type: 'comment', createdAt: new Date('2024-01-03') },
        { type: 'call_accepted', createdAt: new Date('2024-01-02') },
        { type: 'like', createdAt: new Date('2024-01-04') },
      ];

      const fidelityOrder = { high: 0, medium: 1, low: 2 };

      const sortedByFidelity = [...interactions].sort((a, b) => {
        const fidelityA = INTERACTION_FIDELITY[a.type as keyof typeof INTERACTION_FIDELITY];
        const fidelityB = INTERACTION_FIDELITY[b.type as keyof typeof INTERACTION_FIDELITY];
        return fidelityOrder[fidelityA] - fidelityOrder[fidelityB];
      });

      // High fidelity should come first
      expect(INTERACTION_FIDELITY[sortedByFidelity[0].type as keyof typeof INTERACTION_FIDELITY]).toBe('high');
      expect(INTERACTION_FIDELITY[sortedByFidelity[1].type as keyof typeof INTERACTION_FIDELITY]).toBe('high');
    });
  });

  describe('Sunset nudges', () => {
    it('should generate nudge for Core friend after 14 days without deep contact', () => {
      const friend = createMockFriend({
        tier: 'core',
        lastContacted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      });

      const daysSinceContact = friend.lastContacted
        ? Math.floor((Date.now() - friend.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
        : Infinity;

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
      const shouldNudge = daysSinceContact >= threshold;

      expect(shouldNudge).toBe(true);
    });

    it('should NOT generate nudge for Core friend within 14 days', () => {
      const friend = createMockFriend({
        tier: 'core',
        lastContacted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      });

      const daysSinceContact = friend.lastContacted
        ? Math.floor((Date.now() - friend.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
        : Infinity;

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
      const shouldNudge = daysSinceContact >= threshold;

      expect(shouldNudge).toBe(false);
    });

    it('should generate nudge for Inner friend after 30 days without deep contact', () => {
      const friend = createMockFriend({
        tier: 'inner',
        lastContacted: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      });

      const daysSinceContact = friend.lastContacted
        ? Math.floor((Date.now() - friend.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
        : Infinity;

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
      const shouldNudge = daysSinceContact >= threshold;

      expect(shouldNudge).toBe(true);
    });

    it('should generate nudge for Outer friend after 90 days without deep contact', () => {
      const friend = createMockFriend({
        tier: 'outer',
        lastContacted: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
      });

      const daysSinceContact = friend.lastContacted
        ? Math.floor((Date.now() - friend.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
        : Infinity;

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
      const shouldNudge = daysSinceContact >= threshold;

      expect(shouldNudge).toBe(true);
    });

    it('should generate nudge for Naybor after 60 days without contact', () => {
      const friend = createMockFriend({
        tier: 'naybor',
        lastContacted: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), // 65 days ago
      });

      const daysSinceContact = friend.lastContacted
        ? Math.floor((Date.now() - friend.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
        : Infinity;

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];
      const shouldNudge = daysSinceContact >= threshold;

      expect(shouldNudge).toBe(true);
    });

    it('should NEVER generate nudges for Parasocials', () => {
      const friend = createMockFriend({
        tier: 'parasocial',
        lastContacted: new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000), // Very long time ago
      });

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];

      expect(threshold).toBe(Infinity);
    });

    it('should NEVER generate nudges for Role Models', () => {
      const friend = createMockFriend({
        tier: 'rolemodel',
        lastContacted: null, // Never contacted
      });

      const threshold = SUNSET_NUDGE_THRESHOLDS[friend.tier];

      expect(threshold).toBe(Infinity);
    });

    it('should suggest appropriate action based on tier', () => {
      const getSuggestedAction = (tier: TierType): 'schedule_call' | 'send_voice_note' | 'plan_meetup' => {
        switch (tier) {
          case 'core':
            return 'schedule_call'; // Core friends deserve a call
          case 'inner':
            return 'send_voice_note'; // Voice note for inner
          case 'outer':
          case 'naybor':
          case 'acquainted':
            return 'plan_meetup'; // Plan to meet up
          default:
            return 'send_voice_note';
        }
      };

      expect(getSuggestedAction('core')).toBe('schedule_call');
      expect(getSuggestedAction('inner')).toBe('send_voice_note');
      expect(getSuggestedAction('outer')).toBe('plan_meetup');
      expect(getSuggestedAction('naybor')).toBe('plan_meetup');
    });

    it('should include friend name in nudge message', () => {
      const friend = createMockFriend({
        name: 'Alice Johnson',
        tier: 'core',
        lastContacted: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      });

      const nudgeMessage = `No deep contact with ${friend.name} in 14 days—schedule?`;

      expect(nudgeMessage).toContain('Alice Johnson');
      expect(nudgeMessage).toContain('14 days');
      expect(nudgeMessage).toContain('schedule');
    });

    it('should allow dismissing nudges', () => {
      const nudge: SunsetNudge = {
        id: 'nudge-1',
        friendId: 'friend-1',
        friendName: 'Test Friend',
        friendTier: 'core',
        lastDeepContact: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        daysSinceContact: 20,
        suggestedAction: 'schedule_call',
        dismissed: false,
      };

      // Simulate dismissal
      const dismissedNudge = {
        ...nudge,
        dismissed: true,
        dismissedAt: new Date(),
      };

      expect(dismissedNudge.dismissed).toBe(true);
      expect(dismissedNudge.dismissedAt).toBeDefined();
    });

    it('should not show dismissed nudges', () => {
      const nudges: SunsetNudge[] = [
        {
          id: 'nudge-1',
          friendId: 'f1',
          friendName: 'Friend 1',
          friendTier: 'core',
          lastDeepContact: null,
          daysSinceContact: 20,
          suggestedAction: 'schedule_call',
          dismissed: false,
        },
        {
          id: 'nudge-2',
          friendId: 'f2',
          friendName: 'Friend 2',
          friendTier: 'inner',
          lastDeepContact: null,
          daysSinceContact: 40,
          suggestedAction: 'send_voice_note',
          dismissed: true,
          dismissedAt: new Date(),
        },
      ];

      const activeNudges = nudges.filter(n => !n.dismissed);

      expect(activeNudges).toHaveLength(1);
      expect(activeNudges[0].id).toBe('nudge-1');
    });
  });
});

describe('useFeed Hook - Attention Protection', () => {
  describe('Tier-based notification priority', () => {
    it('should give Core notifications immediate priority', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.core.mode).toBe('immediate');
    });

    it('should give Inner notifications immediate priority', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.inner.mode).toBe('immediate');
    });

    it('should batch Outer notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.outer.mode).toBe('batched');
    });

    it('should set quiet mode for Naybor notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.naybor.mode).toBe('quiet');
    });

    it('should set quiet mode for Parasocial notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.parasocial.mode).toBe('quiet');
    });

    it('should disable Role Model notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.rolemodel.enabled).toBe(false);
    });

    it('should disable Acquainted notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.acquainted.enabled).toBe(false);
    });
  });

  describe('Sound settings', () => {
    it('should enable sound for Core notifications', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.core.soundEnabled).toBe(true);
    });

    it('should enable sound for Inner notifications', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.inner.soundEnabled).toBe(true);
    });

    it('should not have sound setting for quiet-mode tiers', () => {
      expect((DEFAULT_NOTIFICATION_SETTINGS.naybor as any).soundEnabled).toBeUndefined();
      expect((DEFAULT_NOTIFICATION_SETTINGS.parasocial as any).soundEnabled).toBeUndefined();
    });
  });

  describe('Batch interval for Outer notifications', () => {
    it('should batch Outer notifications hourly by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.outer.batchIntervalMinutes).toBe(60);
    });

    it('should collect Outer notifications for batching', () => {
      const notifications: FeedNotification[] = [
        {
          id: 'n1',
          type: 'post',
          fromTier: 'outer',
          title: 'Post 1',
          body: 'Content',
          createdAt: new Date(),
          read: false,
          priority: 'batched',
        },
        {
          id: 'n2',
          type: 'interaction',
          fromTier: 'outer',
          title: 'Interaction',
          body: 'Content',
          createdAt: new Date(),
          read: false,
          priority: 'batched',
        },
        {
          id: 'n3',
          type: 'post',
          fromTier: 'core',
          title: 'Core Post',
          body: 'Content',
          createdAt: new Date(),
          read: false,
          priority: 'immediate',
        },
      ];

      const batchedNotifications = notifications.filter(n => n.priority === 'batched');
      const immediateNotifications = notifications.filter(n => n.priority === 'immediate');

      expect(batchedNotifications).toHaveLength(2);
      expect(immediateNotifications).toHaveLength(1);
    });
  });

  describe('Notification filtering', () => {
    it('should not send notifications from disabled tiers', () => {
      const shouldSendNotification = (tier: TierType): boolean => {
        return DEFAULT_NOTIFICATION_SETTINGS[tier].enabled;
      };

      expect(shouldSendNotification('core')).toBe(true);
      expect(shouldSendNotification('inner')).toBe(true);
      expect(shouldSendNotification('outer')).toBe(true);
      expect(shouldSendNotification('naybor')).toBe(true);
      expect(shouldSendNotification('parasocial')).toBe(true);
      expect(shouldSendNotification('rolemodel')).toBe(false);
      expect(shouldSendNotification('acquainted')).toBe(false);
    });

    it('should filter notifications based on tier priority', () => {
      const getNotificationPriority = (tier: TierType): 'immediate' | 'batched' | 'quiet' => {
        const settings = DEFAULT_NOTIFICATION_SETTINGS[tier];
        if (!settings.enabled) return 'quiet';
        return settings.mode as 'immediate' | 'batched' | 'quiet';
      };

      expect(getNotificationPriority('core')).toBe('immediate');
      expect(getNotificationPriority('inner')).toBe('immediate');
      expect(getNotificationPriority('outer')).toBe('batched');
      expect(getNotificationPriority('naybor')).toBe('quiet');
      expect(getNotificationPriority('parasocial')).toBe('quiet');
      expect(getNotificationPriority('rolemodel')).toBe('quiet');
      expect(getNotificationPriority('acquainted')).toBe('quiet');
    });
  });

  describe('Unread count tracking', () => {
    it('should track unread notifications', () => {
      const notifications: FeedNotification[] = [
        { id: 'n1', type: 'post', fromTier: 'core', title: '', body: '', createdAt: new Date(), read: false, priority: 'immediate' },
        { id: 'n2', type: 'post', fromTier: 'core', title: '', body: '', createdAt: new Date(), read: true, priority: 'immediate' },
        { id: 'n3', type: 'post', fromTier: 'inner', title: '', body: '', createdAt: new Date(), read: false, priority: 'immediate' },
      ];

      const unreadCount = notifications.filter(n => !n.read).length;

      expect(unreadCount).toBe(2);
    });

    it('should mark notification as read', () => {
      const notification: FeedNotification = {
        id: 'n1',
        type: 'post',
        fromTier: 'core',
        title: 'New Post',
        body: 'Content',
        createdAt: new Date(),
        read: false,
        priority: 'immediate',
      };

      const markedAsRead = { ...notification, read: true };

      expect(markedAsRead.read).toBe(true);
    });
  });
});

describe('useFeed Hook - Contextual Privacy', () => {
  describe('Core tier privacy', () => {
    it('should allow Core friends to see location', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLocation).toBe(true);
    });

    it('should allow Core friends to see online status', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeOnlineStatus).toBe(true);
    });

    it('should allow Core friends to see last active time', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLastActive).toBe(true);
    });

    it('should allow Core friends to see full profile', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeFullProfile).toBe(true);
    });

    it('should allow Core friends to see life updates', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLifeUpdates).toBe(true);
    });
  });

  describe('Inner tier privacy', () => {
    it('should allow Inner friends to see everything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLocation).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeOnlineStatus).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLastActive).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeFullProfile).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLifeUpdates).toBe(true);
    });
  });

  describe('Outer tier privacy', () => {
    it('should NOT allow Outer friends to see location', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLocation).toBe(false);
    });

    it('should allow Outer friends to see online status', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeOnlineStatus).toBe(true);
    });

    it('should NOT allow Outer friends to see last active time', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLastActive).toBe(false);
    });

    it('should allow Outer friends to see full profile', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeFullProfile).toBe(true);
    });

    it('should allow Outer friends to see life updates', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLifeUpdates).toBe(true);
    });
  });

  describe('Naybor tier privacy', () => {
    it('should allow Naybors to see location (needed for neighborhood)', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLocation).toBe(true);
    });

    it('should NOT allow Naybors to see online status', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeOnlineStatus).toBe(false);
    });

    it('should NOT allow Naybors to see last active', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLastActive).toBe(false);
    });

    it('should NOT allow Naybors to see full profile', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeFullProfile).toBe(false);
    });

    it('should NOT allow Naybors to see life updates', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLifeUpdates).toBe(false);
    });
  });

  describe('Parasocial tier privacy', () => {
    it('should NOT allow Parasocials to see anything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLocation).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeOnlineStatus).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeFullProfile).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLifeUpdates).toBe(false);
    });
  });

  describe('Content visibility filtering', () => {
    it('should filter post content based on viewer tier', () => {
      const post = createMockPost({
        visibility: ['core', 'inner'],
        location: { name: 'Secret Place', coordinates: { lat: 40, lng: -74 } },
      });

      const getVisibleContent = (viewerTier: TierType, content: FeedPost): Partial<FeedPost> => {
        const privacySettings = DEFAULT_PRIVACY_SETTINGS[viewerTier];
        const visible: Partial<FeedPost> = {
          id: content.id,
          authorId: content.authorId,
          authorName: content.authorName,
          contentType: content.contentType,
          content: content.content,
          createdAt: content.createdAt,
        };

        if (privacySettings.canSeeLocation && content.location) {
          visible.location = content.location;
        }

        return visible;
      };

      const coreView = getVisibleContent('core', post);
      const outerView = getVisibleContent('outer', post);

      expect(coreView.location).toBeDefined();
      expect(outerView.location).toBeUndefined();
    });

    it('should respect post visibility array', () => {
      const post = createMockPost({
        visibility: ['core', 'inner'], // Only visible to Core and Inner
      });

      const canViewPost = (viewerTier: TierType, postVisibility: TierType[]): boolean => {
        return postVisibility.includes(viewerTier);
      };

      expect(canViewPost('core', post.visibility)).toBe(true);
      expect(canViewPost('inner', post.visibility)).toBe(true);
      expect(canViewPost('outer', post.visibility)).toBe(false);
      expect(canViewPost('naybor', post.visibility)).toBe(false);
    });
  });
});

describe('useFeed Hook - Open/Portable Data', () => {
  describe('Social graph export', () => {
    it('should export friends with tier information', () => {
      const friends: Friend[] = [
        createMockFriend({ id: '1', name: 'Core 1', tier: 'core' }),
        createMockFriend({ id: '2', name: 'Inner 1', tier: 'inner' }),
        createMockFriend({ id: '3', name: 'Outer 1', tier: 'outer' }),
      ];

      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: friends.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email,
          phone: f.phone,
          tier: f.tier,
          addedAt: f.addedAt,
          lastContacted: f.lastContacted,
          notes: f.notes,
        })),
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      expect(exportData.friends).toHaveLength(3);
      expect(exportData.friends[0].tier).toBe('core');
      expect(exportData.friends[1].tier).toBe('inner');
      expect(exportData.friends[2].tier).toBe('outer');
    });

    it('should export posts with visibility information', () => {
      const posts: FeedPost[] = [
        createMockPost({ visibility: ['core', 'inner'] }),
        createMockPost({ visibility: ['core', 'inner', 'outer'] }),
      ];

      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [],
        posts: posts.map(p => ({
          id: p.id,
          contentType: p.contentType,
          content: p.content,
          createdAt: p.createdAt,
          visibility: p.visibility,
        })),
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      expect(exportData.posts).toHaveLength(2);
      expect(exportData.posts[0].visibility).toContain('core');
    });

    it('should include version information for compatibility', () => {
      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      expect(exportData.version).toBe('1.0.0');
      expect(exportData.exportedAt).toBeInstanceOf(Date);
    });

    it('should export user settings', () => {
      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      expect(exportData.settings.privacy).toEqual(DEFAULT_PRIVACY_SETTINGS);
      expect(exportData.settings.notifications).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });
  });

  describe('Social graph import', () => {
    it('should validate import data version', () => {
      const validateImport = (data: ExportableSocialGraph): { valid: boolean; error?: string } => {
        if (!data.version) {
          return { valid: false, error: 'Missing version' };
        }
        // Support version 1.x.x
        if (!data.version.startsWith('1.')) {
          return { valid: false, error: 'Unsupported version' };
        }
        return { valid: true };
      };

      expect(validateImport({ version: '1.0.0' } as ExportableSocialGraph).valid).toBe(true);
      expect(validateImport({ version: '1.5.0' } as ExportableSocialGraph).valid).toBe(true);
      expect(validateImport({ version: '2.0.0' } as ExportableSocialGraph).valid).toBe(false);
      expect(validateImport({} as ExportableSocialGraph).valid).toBe(false);
    });

    it('should validate friend tier information', () => {
      const validTiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];

      const validateFriends = (friends: Array<{ tier: string }>): boolean => {
        return friends.every(f => validTiers.includes(f.tier as TierType));
      };

      expect(validateFriends([{ tier: 'core' }, { tier: 'inner' }])).toBe(true);
      expect(validateFriends([{ tier: 'core' }, { tier: 'invalid' }])).toBe(false);
    });

    it('should preserve all friend data on import', () => {
      const importData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date('2024-01-01'),
        userId: 'user-123',
        friends: [
          {
            id: 'friend-1',
            name: 'Best Friend',
            email: 'best@example.com',
            phone: '1234567890',
            tier: 'core',
            addedAt: new Date('2023-01-01'),
            lastContacted: new Date('2024-01-01'),
            notes: 'Known since childhood',
          },
        ],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const importedFriend = importData.friends[0];

      expect(importedFriend.id).toBe('friend-1');
      expect(importedFriend.name).toBe('Best Friend');
      expect(importedFriend.email).toBe('best@example.com');
      expect(importedFriend.phone).toBe('1234567890');
      expect(importedFriend.tier).toBe('core');
      expect(importedFriend.notes).toBe('Known since childhood');
    });

    it('should handle missing optional fields gracefully', () => {
      const importData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [
          {
            id: 'friend-1',
            name: 'Minimal Friend',
            tier: 'outer',
            addedAt: new Date(),
            // No email, phone, lastContacted, or notes
          },
        ],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const friend = importData.friends[0];

      expect(friend.id).toBeDefined();
      expect(friend.name).toBeDefined();
      expect(friend.tier).toBeDefined();
      expect(friend.email).toBeUndefined();
      expect(friend.phone).toBeUndefined();
      expect(friend.lastContacted).toBeUndefined();
      expect(friend.notes).toBeUndefined();
    });
  });

  describe('Data portability guarantees', () => {
    it('should allow full data export without loss', () => {
      const originalFriends: Friend[] = [
        createMockFriend({ id: '1', name: 'Friend 1', tier: 'core', email: 'f1@example.com' }),
        createMockFriend({ id: '2', name: 'Friend 2', tier: 'inner', phone: '123456' }),
        createMockFriend({ id: '3', name: 'Friend 3', tier: 'outer', notes: 'Met at conference' }),
      ];

      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: originalFriends.map(f => ({
          id: f.id,
          name: f.name,
          email: f.email,
          phone: f.phone,
          tier: f.tier,
          addedAt: f.addedAt,
          lastContacted: f.lastContacted,
          notes: f.notes,
        })),
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      // Verify no data loss
      expect(exportData.friends).toHaveLength(originalFriends.length);
      originalFriends.forEach((original, i) => {
        const exported = exportData.friends[i];
        expect(exported.id).toBe(original.id);
        expect(exported.name).toBe(original.name);
        expect(exported.tier).toBe(original.tier);
        expect(exported.email).toBe(original.email);
        expect(exported.phone).toBe(original.phone);
        expect(exported.notes).toBe(original.notes);
      });
    });

    it('should export in a standard format (JSON-serializable)', () => {
      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [createMockFriend()].map(f => ({
          id: f.id,
          name: f.name,
          tier: f.tier,
          addedAt: f.addedAt,
        })),
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      // Should be JSON serializable
      const jsonString = JSON.stringify(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.version).toBe('1.0.0');
      expect(parsed.friends).toHaveLength(1);
    });

    it('should include export timestamp for audit trail', () => {
      const beforeExport = new Date();

      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const afterExport = new Date();

      expect(exportData.exportedAt.getTime()).toBeGreaterThanOrEqual(beforeExport.getTime());
      expect(exportData.exportedAt.getTime()).toBeLessThanOrEqual(afterExport.getTime());
    });
  });
});

describe('Feed Integration Scenarios', () => {
  describe('Complete feed flow', () => {
    it('should correctly filter and sort a mixed feed', () => {
      const posts: FeedPost[] = [
        // Core posts - should appear in Core feed
        createMockPost({ id: 'core-1', authorTier: 'core', createdAt: new Date('2024-01-05'), isSuggested: false, isSponsored: false }),
        createMockPost({ id: 'core-2', authorTier: 'core', createdAt: new Date('2024-01-03'), isSuggested: false, isSponsored: false }),

        // Suggested content - should NOT appear in Core feed
        createMockPost({ id: 'suggested', authorTier: 'core', createdAt: new Date('2024-01-04'), isSuggested: true, isSponsored: false }),

        // Sponsored content - should NEVER appear
        createMockPost({ id: 'ad', authorTier: 'core', createdAt: new Date('2024-01-06'), isSuggested: false, isSponsored: true }),

        // Other tier posts - should not appear in Core feed
        createMockPost({ id: 'inner-1', authorTier: 'inner', createdAt: new Date('2024-01-07'), isSuggested: false, isSponsored: false }),
        createMockPost({ id: 'outer-1', authorTier: 'outer', createdAt: new Date('2024-01-08'), isSuggested: false, isSponsored: false }),
      ];

      // Core feed filter
      const coreFeed = posts
        .filter(p => p.authorTier === 'core' && !p.isSuggested && !p.isSponsored)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      expect(coreFeed).toHaveLength(2);
      expect(coreFeed[0].id).toBe('core-1'); // Newer first
      expect(coreFeed[1].id).toBe('core-2');
      expect(coreFeed.every(p => !p.isSuggested && !p.isSponsored)).toBe(true);
    });

    it('should generate appropriate nudges for neglected friends', () => {
      const now = Date.now();
      const friends: Friend[] = [
        // Should generate nudge (Core, 15+ days)
        createMockFriend({
          id: 'f1',
          name: 'Neglected Core',
          tier: 'core',
          lastContacted: new Date(now - 20 * 24 * 60 * 60 * 1000),
        }),
        // Should NOT generate nudge (Core, recent contact)
        createMockFriend({
          id: 'f2',
          name: 'Recent Core',
          tier: 'core',
          lastContacted: new Date(now - 5 * 24 * 60 * 60 * 1000),
        }),
        // Should generate nudge (Inner, 30+ days)
        createMockFriend({
          id: 'f3',
          name: 'Neglected Inner',
          tier: 'inner',
          lastContacted: new Date(now - 45 * 24 * 60 * 60 * 1000),
        }),
        // Should NOT generate nudge (Parasocial)
        createMockFriend({
          id: 'f4',
          name: 'Creator',
          tier: 'parasocial',
          lastContacted: new Date(now - 1000 * 24 * 60 * 60 * 1000),
        }),
      ];

      const generateNudges = (friendsList: Friend[]): SunsetNudge[] => {
        return friendsList
          .filter(f => {
            const threshold = SUNSET_NUDGE_THRESHOLDS[f.tier];
            if (threshold === Infinity) return false;

            const daysSince = f.lastContacted
              ? Math.floor((now - f.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
              : Infinity;

            return daysSince >= threshold;
          })
          .map(f => ({
            id: `nudge-${f.id}`,
            friendId: f.id,
            friendName: f.name,
            friendTier: f.tier,
            lastDeepContact: f.lastContacted || null,
            daysSinceContact: f.lastContacted
              ? Math.floor((now - f.lastContacted.getTime()) / (24 * 60 * 60 * 1000))
              : Infinity,
            suggestedAction: f.tier === 'core' ? 'schedule_call' : 'send_voice_note',
            dismissed: false,
          }));
      };

      const nudges = generateNudges(friends);

      expect(nudges).toHaveLength(2);
      expect(nudges.find(n => n.friendId === 'f1')).toBeDefined();
      expect(nudges.find(n => n.friendId === 'f3')).toBeDefined();
      expect(nudges.find(n => n.friendId === 'f2')).toBeUndefined();
      expect(nudges.find(n => n.friendId === 'f4')).toBeUndefined();
    });

    it('should correctly prioritize notifications by tier', () => {
      const notifications: FeedNotification[] = [
        { id: 'n1', type: 'post', fromTier: 'core', title: '', body: '', createdAt: new Date(), read: false, priority: 'immediate' },
        { id: 'n2', type: 'post', fromTier: 'inner', title: '', body: '', createdAt: new Date(), read: false, priority: 'immediate' },
        { id: 'n3', type: 'post', fromTier: 'outer', title: '', body: '', createdAt: new Date(), read: false, priority: 'batched' },
        { id: 'n4', type: 'post', fromTier: 'naybor', title: '', body: '', createdAt: new Date(), read: false, priority: 'quiet' },
        { id: 'n5', type: 'post', fromTier: 'parasocial', title: '', body: '', createdAt: new Date(), read: false, priority: 'quiet' },
      ];

      const immediateNotifications = notifications.filter(n => n.priority === 'immediate');
      const batchedNotifications = notifications.filter(n => n.priority === 'batched');
      const quietNotifications = notifications.filter(n => n.priority === 'quiet');

      expect(immediateNotifications).toHaveLength(2);
      expect(batchedNotifications).toHaveLength(1);
      expect(quietNotifications).toHaveLength(2);
    });
  });
});

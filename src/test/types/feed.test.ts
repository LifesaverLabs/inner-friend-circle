import { describe, it, expect } from 'vitest';
import {
  CONTENT_FIDELITY,
  INTERACTION_FIDELITY,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  SUNSET_NUDGE_THRESHOLDS,
  type FeedPost,
  type PostInteraction,
  type SunsetNudge,
  type FeedNotification,
  type NotificationSettings,
  type PrivacySettings,
  type ExportableSocialGraph,
  type FeedFilters,
  type FeedState,
  type PostContentType,
  type InteractionType,
  type FidelityLevel,
} from '@/types/feed';
import { TierType } from '@/types/friend';

describe('Feed Types and Constants', () => {
  describe('Content Fidelity Mapping', () => {
    it('should classify text posts as low fidelity', () => {
      expect(CONTENT_FIDELITY.text).toBe('low');
    });

    it('should classify photo posts as medium fidelity', () => {
      expect(CONTENT_FIDELITY.photo).toBe('medium');
    });

    it('should classify voice notes as high fidelity', () => {
      expect(CONTENT_FIDELITY.voice_note).toBe('high');
    });

    it('should classify video as high fidelity', () => {
      expect(CONTENT_FIDELITY.video).toBe('high');
    });

    it('should classify call invites as high fidelity', () => {
      expect(CONTENT_FIDELITY.call_invite).toBe('high');
    });

    it('should classify meetup invites as high fidelity', () => {
      expect(CONTENT_FIDELITY.meetup_invite).toBe('high');
    });

    it('should classify proximity pings as high fidelity', () => {
      expect(CONTENT_FIDELITY.proximity_ping).toBe('high');
    });

    it('should classify life updates as medium fidelity', () => {
      expect(CONTENT_FIDELITY.life_update).toBe('medium');
    });

    it('should have exactly 8 content types defined', () => {
      expect(Object.keys(CONTENT_FIDELITY)).toHaveLength(8);
    });
  });

  describe('Interaction Fidelity Mapping', () => {
    it('should classify likes as low fidelity', () => {
      expect(INTERACTION_FIDELITY.like).toBe('low');
    });

    it('should classify comments as medium fidelity', () => {
      expect(INTERACTION_FIDELITY.comment).toBe('medium');
    });

    it('should classify voice replies as high fidelity', () => {
      expect(INTERACTION_FIDELITY.voice_reply).toBe('high');
    });

    it('should classify call accepted as high fidelity', () => {
      expect(INTERACTION_FIDELITY.call_accepted).toBe('high');
    });

    it('should classify meetup RSVP as high fidelity', () => {
      expect(INTERACTION_FIDELITY.meetup_rsvp).toBe('high');
    });

    it('should classify shares as medium fidelity', () => {
      expect(INTERACTION_FIDELITY.share).toBe('medium');
    });

    it('should have exactly 6 interaction types defined', () => {
      expect(Object.keys(INTERACTION_FIDELITY)).toHaveLength(6);
    });
  });

  describe('Default Privacy Settings', () => {
    it('should allow Core friends to see everything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLocation).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeOnlineStatus).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLastActive).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeFullProfile).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.core.canSeeLifeUpdates).toBe(true);
    });

    it('should allow Inner friends to see everything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLocation).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeOnlineStatus).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLastActive).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeFullProfile).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.inner.canSeeLifeUpdates).toBe(true);
    });

    it('should restrict Outer friends from seeing location and last active', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLocation).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeOnlineStatus).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeFullProfile).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.outer.canSeeLifeUpdates).toBe(true);
    });

    it('should allow Naybors to see location but not much else', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLocation).toBe(true);
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeOnlineStatus).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeFullProfile).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.naybor.canSeeLifeUpdates).toBe(false);
    });

    it('should restrict Parasocials from seeing anything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLocation).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeOnlineStatus).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeFullProfile).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.parasocial.canSeeLifeUpdates).toBe(false);
    });

    it('should restrict Role Models from seeing anything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.rolemodel.canSeeLocation).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.rolemodel.canSeeOnlineStatus).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.rolemodel.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.rolemodel.canSeeFullProfile).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.rolemodel.canSeeLifeUpdates).toBe(false);
    });

    it('should restrict Acquainted from seeing anything', () => {
      expect(DEFAULT_PRIVACY_SETTINGS.acquainted.canSeeLocation).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.acquainted.canSeeOnlineStatus).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.acquainted.canSeeLastActive).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.acquainted.canSeeFullProfile).toBe(false);
      expect(DEFAULT_PRIVACY_SETTINGS.acquainted.canSeeLifeUpdates).toBe(false);
    });

    it('should have settings for all 7 tiers', () => {
      const tiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
      tiers.forEach(tier => {
        expect(DEFAULT_PRIVACY_SETTINGS[tier]).toBeDefined();
      });
    });
  });

  describe('Default Notification Settings', () => {
    it('should set Core notifications to immediate with sound', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.core.enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.core.mode).toBe('immediate');
      expect(DEFAULT_NOTIFICATION_SETTINGS.core.soundEnabled).toBe(true);
    });

    it('should set Inner notifications to immediate with sound', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.inner.enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.inner.mode).toBe('immediate');
      expect(DEFAULT_NOTIFICATION_SETTINGS.inner.soundEnabled).toBe(true);
    });

    it('should set Outer notifications to batched by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.outer.enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.outer.mode).toBe('batched');
      expect(DEFAULT_NOTIFICATION_SETTINGS.outer.batchIntervalMinutes).toBe(60);
    });

    it('should set Naybor notifications to quiet by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.naybor.enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.naybor.mode).toBe('quiet');
    });

    it('should set Parasocial notifications to quiet by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.parasocial.enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.parasocial.mode).toBe('quiet');
    });

    it('should disable Role Model notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.rolemodel.enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_SETTINGS.rolemodel.mode).toBe('quiet');
    });

    it('should disable Acquainted notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.acquainted.enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_SETTINGS.acquainted.mode).toBe('quiet');
    });

    it('should have settings for all 7 tiers', () => {
      const tiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
      tiers.forEach(tier => {
        expect(DEFAULT_NOTIFICATION_SETTINGS[tier]).toBeDefined();
      });
    });
  });

  describe('Sunset Nudge Thresholds', () => {
    it('should nudge Core friends after 14 days', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.core).toBe(14);
    });

    it('should nudge Inner friends after 30 days', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.inner).toBe(30);
    });

    it('should nudge Outer friends after 90 days', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.outer).toBe(90);
    });

    it('should nudge Naybors after 60 days', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.naybor).toBe(60);
    });

    it('should never nudge for Parasocials', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.parasocial).toBe(Infinity);
    });

    it('should never nudge for Role Models', () => {
      expect(SUNSET_NUDGE_THRESHOLDS.rolemodel).toBe(Infinity);
    });

    it('should use annual review system for Acquainted (not day-based)', () => {
      // Acquainted uses a special monthly batch system, not day-based threshold
      expect(SUNSET_NUDGE_THRESHOLDS.acquainted).toBe(Infinity);
    });

    it('should have thresholds for all 7 tiers', () => {
      const tiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
      tiers.forEach(tier => {
        expect(SUNSET_NUDGE_THRESHOLDS[tier]).toBeDefined();
      });
    });
  });

  describe('FeedPost Type Structure', () => {
    it('should accept valid FeedPost object', () => {
      const post: FeedPost = {
        id: 'post-1',
        authorId: 'user-1',
        authorName: 'John Doe',
        authorTier: 'core',
        contentType: 'text',
        content: 'Hello world!',
        createdAt: new Date(),
        interactions: [],
        visibility: ['core', 'inner'],
        isSuggested: false,
        isSponsored: false,
      };

      expect(post.id).toBe('post-1');
      expect(post.isSuggested).toBe(false);
      expect(post.isSponsored).toBe(false);
    });

    it('should accept FeedPost with high-fidelity content', () => {
      const post: FeedPost = {
        id: 'post-2',
        authorId: 'user-1',
        authorName: 'Jane Doe',
        authorTier: 'inner',
        contentType: 'voice_note',
        content: 'Voice message',
        mediaUrl: 'https://example.com/voice.mp3',
        createdAt: new Date(),
        interactions: [],
        visibility: ['core', 'inner', 'outer'],
        isSuggested: false,
        isSponsored: false,
      };

      expect(post.contentType).toBe('voice_note');
      expect(CONTENT_FIDELITY[post.contentType]).toBe('high');
    });

    it('should accept FeedPost with meetup invite', () => {
      const post: FeedPost = {
        id: 'post-3',
        authorId: 'user-1',
        authorName: 'Friend',
        authorTier: 'core',
        contentType: 'meetup_invite',
        content: 'Coffee tomorrow?',
        createdAt: new Date(),
        scheduledAt: new Date(Date.now() + 86400000),
        location: {
          name: 'Local Coffee Shop',
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        interactions: [],
        visibility: ['core'],
        isSuggested: false,
        isSponsored: false,
      };

      expect(post.scheduledAt).toBeDefined();
      expect(post.location?.name).toBe('Local Coffee Shop');
    });
  });

  describe('PostInteraction Type Structure', () => {
    it('should accept valid PostInteraction', () => {
      const interaction: PostInteraction = {
        id: 'int-1',
        postId: 'post-1',
        userId: 'user-2',
        userName: 'Responder',
        type: 'comment',
        content: 'Great post!',
        createdAt: new Date(),
      };

      expect(interaction.type).toBe('comment');
      expect(INTERACTION_FIDELITY[interaction.type]).toBe('medium');
    });

    it('should accept like interaction (low fidelity)', () => {
      const interaction: PostInteraction = {
        id: 'int-2',
        postId: 'post-1',
        userId: 'user-3',
        userName: 'Liker',
        type: 'like',
        createdAt: new Date(),
      };

      expect(INTERACTION_FIDELITY[interaction.type]).toBe('low');
    });

    it('should accept high-fidelity interactions', () => {
      const voiceReply: PostInteraction = {
        id: 'int-3',
        postId: 'post-1',
        userId: 'user-4',
        userName: 'Voice Responder',
        type: 'voice_reply',
        content: 'https://example.com/reply.mp3',
        createdAt: new Date(),
      };

      const callAccepted: PostInteraction = {
        id: 'int-4',
        postId: 'post-2',
        userId: 'user-5',
        userName: 'Caller',
        type: 'call_accepted',
        createdAt: new Date(),
      };

      const meetupRsvp: PostInteraction = {
        id: 'int-5',
        postId: 'post-3',
        userId: 'user-6',
        userName: 'Attendee',
        type: 'meetup_rsvp',
        createdAt: new Date(),
      };

      expect(INTERACTION_FIDELITY[voiceReply.type]).toBe('high');
      expect(INTERACTION_FIDELITY[callAccepted.type]).toBe('high');
      expect(INTERACTION_FIDELITY[meetupRsvp.type]).toBe('high');
    });
  });

  describe('SunsetNudge Type Structure', () => {
    it('should accept valid SunsetNudge', () => {
      // Core friends get 'plan_meetup' as highest-fidelity action per bridging protocol
      const nudge: SunsetNudge = {
        id: 'nudge-1',
        friendId: 'friend-1',
        friendName: 'Close Friend',
        friendTier: 'core',
        lastDeepContact: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        daysSinceContact: 15,
        suggestedAction: 'plan_meetup',
        dismissed: false,
      };

      expect(nudge.daysSinceContact).toBe(15);
      expect(nudge.suggestedAction).toBe('plan_meetup');
    });

    it('should accept nudge with null last contact', () => {
      const nudge: SunsetNudge = {
        id: 'nudge-2',
        friendId: 'friend-2',
        friendName: 'New Friend',
        friendTier: 'inner',
        lastDeepContact: null,
        daysSinceContact: Infinity,
        suggestedAction: 'send_voice_note',
        dismissed: false,
      };

      expect(nudge.lastDeepContact).toBeNull();
    });

    it('should accept dismissed nudge', () => {
      const nudge: SunsetNudge = {
        id: 'nudge-3',
        friendId: 'friend-3',
        friendName: 'Dismissed Friend',
        friendTier: 'outer',
        lastDeepContact: new Date(),
        daysSinceContact: 100,
        suggestedAction: 'plan_meetup',
        dismissed: true,
        dismissedAt: new Date(),
      };

      expect(nudge.dismissed).toBe(true);
      expect(nudge.dismissedAt).toBeDefined();
    });
  });

  describe('FeedNotification Type Structure', () => {
    it('should accept valid FeedNotification', () => {
      const notification: FeedNotification = {
        id: 'notif-1',
        type: 'post',
        fromTier: 'core',
        title: 'New post from Core friend',
        body: 'Check out their update',
        postId: 'post-1',
        createdAt: new Date(),
        read: false,
        priority: 'immediate',
      };

      expect(notification.priority).toBe('immediate');
      expect(notification.fromTier).toBe('core');
    });

    it('should set immediate priority for Core notifications', () => {
      const notification: FeedNotification = {
        id: 'notif-2',
        type: 'interaction',
        fromTier: 'core',
        title: 'Core friend commented',
        body: 'On your post',
        createdAt: new Date(),
        read: false,
        priority: 'immediate',
      };

      expect(notification.priority).toBe('immediate');
    });

    it('should set batched priority for Outer notifications', () => {
      const notification: FeedNotification = {
        id: 'notif-3',
        type: 'post',
        fromTier: 'outer',
        title: 'Outer friend posted',
        body: 'New update',
        createdAt: new Date(),
        read: false,
        priority: 'batched',
      };

      expect(notification.priority).toBe('batched');
    });

    it('should set quiet priority for Parasocial notifications', () => {
      const notification: FeedNotification = {
        id: 'notif-4',
        type: 'post',
        fromTier: 'parasocial',
        title: 'Creator posted',
        body: 'New content',
        createdAt: new Date(),
        read: false,
        priority: 'quiet',
      };

      expect(notification.priority).toBe('quiet');
    });
  });

  describe('ExportableSocialGraph Type Structure', () => {
    it('should accept valid ExportableSocialGraph', () => {
      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [
          {
            id: 'friend-1',
            name: 'Best Friend',
            email: 'friend@example.com',
            tier: 'core',
            addedAt: new Date(),
          },
        ],
        posts: [
          {
            id: 'post-1',
            contentType: 'text',
            content: 'Hello!',
            createdAt: new Date(),
            visibility: ['core', 'inner'],
          },
        ],
        interactions: [
          {
            postId: 'post-1',
            type: 'comment',
            createdAt: new Date(),
          },
        ],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      expect(exportData.version).toBe('1.0.0');
      expect(exportData.friends).toHaveLength(1);
      expect(exportData.posts).toHaveLength(1);
      expect(exportData.interactions).toHaveLength(1);
    });

    it('should preserve tier information in export', () => {
      const exportData: ExportableSocialGraph = {
        version: '1.0.0',
        exportedAt: new Date(),
        userId: 'user-123',
        friends: [
          { id: '1', name: 'Core 1', tier: 'core', addedAt: new Date() },
          { id: '2', name: 'Inner 1', tier: 'inner', addedAt: new Date() },
          { id: '3', name: 'Outer 1', tier: 'outer', addedAt: new Date() },
          { id: '4', name: 'Naybor 1', tier: 'naybor', addedAt: new Date() },
        ],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const tierCounts = exportData.friends.reduce((acc, f) => {
        acc[f.tier] = (acc[f.tier] || 0) + 1;
        return acc;
      }, {} as Record<TierType, number>);

      expect(tierCounts.core).toBe(1);
      expect(tierCounts.inner).toBe(1);
      expect(tierCounts.outer).toBe(1);
      expect(tierCounts.naybor).toBe(1);
    });
  });

  describe('FeedFilters Type Structure', () => {
    it('should accept valid FeedFilters', () => {
      const filters: FeedFilters = {
        tiers: ['core', 'inner'],
        contentTypes: ['text', 'voice_note', 'video'],
        excludeSuggested: true,
        excludeSponsored: true,
      };

      expect(filters.tiers).toContain('core');
      expect(filters.excludeSuggested).toBe(true);
      expect(filters.excludeSponsored).toBe(true);
    });

    it('should accept filters with date range', () => {
      const filters: FeedFilters = {
        tiers: ['core', 'inner', 'outer'],
        contentTypes: ['text'],
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
        },
        excludeSuggested: false,
        excludeSponsored: true,
      };

      expect(filters.dateRange?.start).toBeDefined();
      expect(filters.dateRange?.end).toBeDefined();
    });

    it('should accept filters with fidelity level', () => {
      const filters: FeedFilters = {
        tiers: ['core'],
        contentTypes: ['voice_note', 'video', 'call_invite'],
        fidelityLevel: 'high',
        excludeSuggested: true,
        excludeSponsored: true,
      };

      expect(filters.fidelityLevel).toBe('high');
    });
  });

  describe('FeedState Type Structure', () => {
    it('should accept valid FeedState', () => {
      const state: FeedState = {
        posts: [],
        nudges: [],
        notifications: [],
        unreadCount: 0,
        filters: {
          tiers: ['core', 'inner', 'outer'],
          contentTypes: ['text', 'photo', 'voice_note'],
          excludeSuggested: true,
          excludeSponsored: true,
        },
        privacySettings: DEFAULT_PRIVACY_SETTINGS,
        notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
        lastFetched: null,
        isLoading: false,
        error: null,
      };

      expect(state.posts).toHaveLength(0);
      expect(state.isLoading).toBe(false);
    });
  });
});

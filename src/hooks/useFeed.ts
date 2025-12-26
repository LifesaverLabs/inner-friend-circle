import { useState, useCallback, useMemo, useEffect } from 'react';
import { Friend, TierType } from '@/types/friend';
import {
  FeedPost,
  SunsetNudge,
  FeedNotification,
  FidelityLevel,
  PrivacySettings,
  NotificationSettings,
  ExportableSocialGraph,
  AcquaintedNudgeBatch,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  PostContentType,
  InteractionType,
} from '@/types/feed';
import {
  getCoreFeed,
  getTierFeed,
  getFilteredFeed,
  generateSunsetNudges,
  shouldNudgeFriend,
  getSuggestedNudgeAction,
  getNotificationPriority,
  getContentNotificationPriority,
  canViewerSee,
  canViewPost,
  getVisibleContent,
  getUnreadCount,
  filterNotificationsByPriority,
  createNotification,
  shouldShowLikeCount,
  sortInteractionsByFidelity,
} from '@/lib/feedUtils';
import {
  getEligibleAcquaintedCousins,
  generateAcquaintedNudgeBatch,
  isAcquaintedNudgeDay,
  getAssignedMonth,
  hasBeenNudgedThisCycle,
  createNudgeHistoryEntry,
  recordNudgeAction,
  AcquaintedNudgeHistoryEntry,
} from '@/lib/acquaintedNudgeUtils';
import {
  exportSocialGraph,
  importSocialGraph,
  convertImportedFriends,
} from '@/lib/dataPortability';

const FEED_STORAGE_KEY = 'inner-friend-feed';
const NUDGE_HISTORY_KEY = 'inner-friend-nudge-history';

interface UseFeedOptions {
  userId?: string;
  friends: Friend[];
}

interface UseFeedReturn {
  // Feed data
  posts: FeedPost[];
  nudges: SunsetNudge[];
  acquaintedNudgeBatch: AcquaintedNudgeBatch & { shouldShow: boolean };
  notifications: FeedNotification[];
  unreadCount: number;

  // Feed operations
  getCoreFeed: () => FeedPost[];
  getTierFeed: (tier: TierType) => FeedPost[];
  getFilteredFeed: (options: {
    tiers?: TierType[];
    fidelityLevel?: FidelityLevel;
    excludeSuggested?: boolean;
    excludeSponsored?: boolean;
  }) => FeedPost[];

  // Post operations
  createPost: (post: Omit<FeedPost, 'id' | 'createdAt' | 'interactions'>) => FeedPost;
  addInteraction: (postId: string, type: InteractionType, content?: string) => void;

  // Nudge operations
  dismissNudge: (nudgeId: string) => void;
  dismissAcquaintedNudge: (friendId: string, action: string) => void;

  // Notification operations
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  getImmediateNotifications: () => FeedNotification[];
  getBatchedNotifications: () => FeedNotification[];

  // Privacy operations
  canViewerSee: (viewerTier: TierType, field: string) => boolean;
  getVisibleContent: (viewerTier: TierType, post: FeedPost) => Partial<FeedPost>;

  // Utility functions
  shouldShowLikeCount: (tier: TierType) => boolean;
  sortInteractionsByFidelity: (interactions: FeedPost['interactions']) => FeedPost['interactions'];
  getNotificationPriority: (tier: TierType, interactionType?: InteractionType) => 'immediate' | 'batched' | 'quiet';

  // Data portability
  exportSocialGraph: () => ExportableSocialGraph;
  importSocialGraph: (data: string) => Promise<{ success: boolean; error?: string }>;

  // Settings
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // State
  isLoading: boolean;
  error: string | null;
}

export function useFeed({ userId, friends }: UseFeedOptions): UseFeedReturn {
  // State
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [notifications, setNotifications] = useState<FeedNotification[]>([]);
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set());
  const [acquaintedNudgeHistory, setAcquaintedNudgeHistory] = useState<AcquaintedNudgeHistoryEntry[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(NUDGE_HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setAcquaintedNudgeHistory(
          parsed.map((h: AcquaintedNudgeHistoryEntry) => ({
            ...h,
            nudgedAt: new Date(h.nudgedAt),
            actionTakenAt: h.actionTakenAt ? new Date(h.actionTakenAt) : undefined,
          }))
        );
      }
    } catch (e) {
      console.error('Failed to load nudge history:', e);
    }
    setIsLoading(false);
  }, []);

  // Save nudge history to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(NUDGE_HISTORY_KEY, JSON.stringify(acquaintedNudgeHistory));
    }
  }, [acquaintedNudgeHistory, isLoading]);

  // Generate sunset nudges for non-acquainted friends
  const nudges = useMemo(() => {
    const allNudges = generateSunsetNudges(friends);
    return allNudges.filter(n => !dismissedNudges.has(n.id));
  }, [friends, dismissedNudges]);

  // Generate acquainted nudge batch
  const acquaintedNudgeBatch = useMemo(() => {
    return generateAcquaintedNudgeBatch(friends, acquaintedNudgeHistory);
  }, [friends, acquaintedNudgeHistory]);

  // Unread notification count
  const unreadCount = useMemo(() => getUnreadCount(notifications), [notifications]);

  // Feed operations
  const getCoreFeedPosts = useCallback(() => {
    return getCoreFeed(posts);
  }, [posts]);

  const getTierFeedPosts = useCallback((tier: TierType) => {
    return getTierFeed(posts, tier);
  }, [posts]);

  const getFilteredFeedPosts = useCallback((options: {
    tiers?: TierType[];
    fidelityLevel?: FidelityLevel;
    excludeSuggested?: boolean;
    excludeSponsored?: boolean;
  }) => {
    return getFilteredFeed(posts, options);
  }, [posts]);

  // Post operations
  const createPostFn = useCallback((
    postData: Omit<FeedPost, 'id' | 'createdAt' | 'interactions'>
  ): FeedPost => {
    const newPost: FeedPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      interactions: [],
    };

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const addInteraction = useCallback((
    postId: string,
    type: InteractionType,
    content?: string
  ) => {
    if (!userId) return;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const newInteraction = {
        id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postId,
        userId,
        userName: 'You', // Should come from user profile
        type,
        content,
        createdAt: new Date(),
      };

      return {
        ...post,
        interactions: [...post.interactions, newInteraction],
      };
    }));
  }, [userId]);

  // Nudge operations
  const dismissNudge = useCallback((nudgeId: string) => {
    setDismissedNudges(prev => new Set([...prev, nudgeId]));
  }, []);

  const dismissAcquaintedNudge = useCallback((friendId: string, action: string) => {
    const cycleYear = new Date().getFullYear();
    const entry = createNudgeHistoryEntry(friendId, cycleYear);
    const updatedEntry = recordNudgeAction(entry, action as any);

    setAcquaintedNudgeHistory(prev => [...prev, updatedEntry]);
  }, []);

  // Notification operations
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getImmediateNotifications = useCallback(() => {
    return filterNotificationsByPriority(notifications, 'immediate');
  }, [notifications]);

  const getBatchedNotifications = useCallback(() => {
    return filterNotificationsByPriority(notifications, 'batched');
  }, [notifications]);

  // Privacy operations
  const canViewerSeeFn = useCallback((viewerTier: TierType, field: string) => {
    return canViewerSee(viewerTier, field as any, privacySettings);
  }, [privacySettings]);

  const getVisibleContentFn = useCallback((viewerTier: TierType, post: FeedPost) => {
    return getVisibleContent(viewerTier, post, privacySettings);
  }, [privacySettings]);

  // Utility functions
  const shouldShowLikeCountFn = useCallback((tier: TierType) => {
    return shouldShowLikeCount(tier);
  }, []);

  const sortInteractionsByFidelityFn = useCallback((interactions: FeedPost['interactions']) => {
    return sortInteractionsByFidelity(interactions);
  }, []);

  const getNotificationPriorityFn = useCallback((
    tier: TierType,
    interactionType?: InteractionType
  ) => {
    return getNotificationPriority(tier, interactionType);
  }, []);

  // Data portability
  const exportSocialGraphFn = useCallback((): ExportableSocialGraph => {
    return exportSocialGraph(
      userId || 'anonymous',
      friends,
      posts,
      privacySettings,
      notificationSettings
    );
  }, [userId, friends, posts, privacySettings, notificationSettings]);

  const importSocialGraphFn = useCallback(async (
    jsonString: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = importSocialGraph(jsonString);

    if (!result.success) {
      return { success: false, error: result.errors.join('; ') };
    }

    // Data is valid - the calling component should handle the actual import
    // as it may need to merge with existing data
    return { success: true };
  }, []);

  // Settings operations
  const updatePrivacySettings = useCallback((settings: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => ({ ...prev, ...settings }));
  }, []);

  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  }, []);

  return {
    // Feed data
    posts,
    nudges,
    acquaintedNudgeBatch,
    notifications,
    unreadCount,

    // Feed operations
    getCoreFeed: getCoreFeedPosts,
    getTierFeed: getTierFeedPosts,
    getFilteredFeed: getFilteredFeedPosts,

    // Post operations
    createPost: createPostFn,
    addInteraction,

    // Nudge operations
    dismissNudge,
    dismissAcquaintedNudge,

    // Notification operations
    markNotificationRead,
    markAllNotificationsRead,
    getImmediateNotifications,
    getBatchedNotifications,

    // Privacy operations
    canViewerSee: canViewerSeeFn,
    getVisibleContent: getVisibleContentFn,

    // Utility functions
    shouldShowLikeCount: shouldShowLikeCountFn,
    sortInteractionsByFidelity: sortInteractionsByFidelityFn,
    getNotificationPriority: getNotificationPriorityFn,

    // Data portability
    exportSocialGraph: exportSocialGraphFn,
    importSocialGraph: importSocialGraphFn,

    // Settings
    privacySettings,
    notificationSettings,
    updatePrivacySettings,
    updateNotificationSettings,

    // State
    isLoading,
    error,
  };
}

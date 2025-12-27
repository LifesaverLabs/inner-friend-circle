import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeed } from '@/hooks/useFeed';
import { Friend, TierType, ContactMethod, CONTACT_METHODS } from '@/types/friend';
import { FeedHeader } from './FeedHeader';
import { FeedList } from './FeedList';
import { EmptyFeedState } from './EmptyFeedState';
import { SunsetNudgePanel } from './SunsetNudgePanel';
import { toast } from 'sonner';
import {
  isWarningSuppressed,
  suppressWarningUntilNextMonth,
  SUPPRESSIBLE_METHODS,
} from '@/lib/warningSuppressionUtils';

type FeedTier = 'core' | 'inner' | 'outer';

// Outer+ includes these additional tiers beyond just 'outer'
const OUTER_PLUS_TIERS: TierType[] = ['outer', 'naybor', 'parasocial', 'rolemodel'];

// Threshold for "critical" reconnection needs (show nudges prominently above posts)
// If more than this percentage of friends need reconnection, show nudges first
const CRITICAL_NUDGE_THRESHOLD = 0.5; // 50% of tier friends

// Thresholds for days overdue that indicate urgency
const URGENT_DAYS_OVERDUE: Record<FeedTier, number> = {
  core: 7,   // 1 week past threshold (21 days total for Core)
  inner: 14, // 2 weeks past threshold (44 days total for Inner)
  outer: 30, // 1 month past threshold (120 days total for Outer)
};

interface TierFeedProps {
  tier: FeedTier;
  friends: Friend[];
  userId?: string;
  isLoggedIn: boolean;
  onGoToManage?: () => void;
  onRequestContactInfo?: (friendId: string) => void;
  onUpdateLastContacted?: (friendId: string, date: Date) => void;
}

const TIER_BG_COLORS: Record<FeedTier, string> = {
  core: 'bg-tier-core/5',
  inner: 'bg-tier-inner/5',
  outer: 'bg-tier-outer/5',
};

const TIER_BORDER_COLORS: Record<FeedTier, string> = {
  core: 'border-tier-core/20',
  inner: 'border-tier-inner/20',
  outer: 'border-tier-outer/20',
};

// Default contact methods per tier (more intimate for Core)
const DEFAULT_CONTACT_METHODS: Record<FeedTier, ContactMethod> = {
  core: 'facetime',  // Core: Most intimate - FaceTime
  inner: 'tel',      // Inner: Phone call
  outer: 'tel',      // Outer: Phone call
};

export function TierFeed({
  tier,
  friends,
  userId,
  isLoggedIn,
  onGoToManage,
  onRequestContactInfo,
  onUpdateLastContacted,
}: TierFeedProps) {
  const { t } = useTranslation();
  const {
    nudges,
    getTierFeed,
    addInteraction,
    dismissNudge,
    shouldShowLikeCount,
    createPost,
    isLoading,
    error,
  } = useFeed({ userId, friends });

  // Feed-level default contact method
  const [defaultContactMethod, setDefaultContactMethod] = useState<ContactMethod>(
    DEFAULT_CONTACT_METHODS[tier]
  );

  // Compose post dialog state (shared between FeedHeader and EmptyFeedState)
  const [composeOpen, setComposeOpen] = useState(false);

  // Get posts for this tier
  const posts = useMemo(() => {
    return getTierFeed(tier);
  }, [getTierFeed, tier]);

  // Filter nudges for this tier (Outer+ includes naybor, parasocial, rolemodel)
  const tierNudges = useMemo(() => {
    if (tier === 'outer') {
      return nudges.filter(n => OUTER_PLUS_TIERS.includes(n.friendTier as TierType));
    }
    return nudges.filter(n => n.friendTier === tier);
  }, [nudges, tier]);

  // Check if user has friends in this tier (Outer+ includes naybor, parasocial, rolemodel)
  const hasFriendsInTier = useMemo(() => {
    if (tier === 'outer') {
      return friends.some(f => OUTER_PLUS_TIERS.includes(f.tier));
    }
    return friends.some(f => f.tier === tier);
  }, [friends, tier]);

  // Count friends in this tier for percentage calculation
  const friendsInTierCount = useMemo(() => {
    if (tier === 'outer') {
      return friends.filter(f => OUTER_PLUS_TIERS.includes(f.tier)).length;
    }
    return friends.filter(f => f.tier === tier).length;
  }, [friends, tier]);

  // Determine if nudges are "critical" (should show before posts)
  // Critical means: high percentage of friends need reconnection OR there are urgent nudges
  const isNudgeCritical = useMemo(() => {
    if (tierNudges.length === 0) return false;

    // Check percentage threshold
    const nudgePercentage = friendsInTierCount > 0
      ? tierNudges.length / friendsInTierCount
      : 0;
    if (nudgePercentage >= CRITICAL_NUDGE_THRESHOLD) return true;

    // Check for urgent nudges (significantly overdue)
    const urgentThreshold = URGENT_DAYS_OVERDUE[tier];
    const hasUrgentNudge = tierNudges.some(n => {
      const baseThreshold = tier === 'core' ? 14 : tier === 'inner' ? 30 : 90;
      return n.daysSinceContact > baseThreshold + urgentThreshold;
    });
    if (hasUrgentNudge) return true;

    return false;
  }, [tierNudges, friendsInTierCount, tier]);

  // Get like count visibility for this tier
  const showLikeCount = shouldShowLikeCount(tier);

  // Handle nudge actions (schedule call, send voice note, plan meetup)
  const handleNudgeAction = useCallback((
    nudgeId: string,
    action: 'schedule_call' | 'send_voice_note' | 'plan_meetup'
  ) => {
    // Find the nudge and friend
    const nudge = tierNudges.find(n => n.id === nudgeId);
    if (!nudge) return;

    const friend = friends.find(f => f.id === nudge.friendId);
    if (!friend) return;

    // Get contact method and phone
    const contactMethod = defaultContactMethod;
    const phone = friend.phone;

    if (!phone) {
      // No phone number - request contact info
      if (onRequestContactInfo) {
        onRequestContactInfo(friend.id);
        toast.info(t('tierFeed.toasts.addContactInfo', { name: friend.name }));
      } else {
        toast.error(t('tierFeed.toasts.noContactInfo', { name: friend.name }));
      }
      return;
    }

    const methodInfo = CONTACT_METHODS[contactMethod];

    // Show warning for surveilled platforms unless suppressed
    if (methodInfo.warning && !isWarningSuppressed(contactMethod)) {
      toast.warning(methodInfo.warning, {
        duration: 10000,
        action: SUPPRESSIBLE_METHODS.includes(contactMethod)
          ? {
              label: t('tierFeed.toasts.dontShowMonth'),
              onClick: () => {
                suppressWarningUntilNextMonth(contactMethod);
                toast.info(t('tierFeed.toasts.warningSilenced', { method: methodInfo.name }));
              },
            }
          : undefined,
      });
    }

    // Execute the action based on type
    switch (action) {
      case 'schedule_call':
      case 'send_voice_note': {
        // Open contact method
        const url = methodInfo.getUrl(phone);
        window.open(url, '_blank');
        toast.success(t('tierFeed.toasts.connecting', { name: friend.name, method: methodInfo.name }));
        break;
      }
      case 'plan_meetup': {
        // For now, initiate contact to plan the meetup
        // Future: Could open a meetup scheduling dialog
        const url = methodInfo.getUrl(phone);
        window.open(url, '_blank');
        toast.success(t('tierFeed.toasts.planMeetup', { name: friend.name }));
        break;
      }
    }

    // Dismiss the nudge after action
    dismissNudge(nudgeId);
  }, [tierNudges, friends, defaultContactMethod, onRequestContactInfo, dismissNudge, t]);

  // Handle marking a friend as connected (update lastContacted date)
  const handleMarkConnected = useCallback((
    nudgeId: string,
    friendId: string,
    date: Date
  ) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    if (onUpdateLastContacted) {
      onUpdateLastContacted(friendId, date);
      toast.success(t('tierFeed.toasts.markedConnected', { name: friend.name }));
    }

    // Dismiss the nudge
    dismissNudge(nudgeId);
  }, [friends, onUpdateLastContacted, dismissNudge, t]);

  // Handle creating a new post
  const handleCreatePost = useCallback(async (postData: {
    content: string;
    contentType: import('@/types/feed').PostContentType;
    visibility: import('@/types/friend').TierType[];
  }) => {
    if (!userId) {
      toast.error(t('tierFeed.toasts.notLoggedIn'));
      return;
    }

    const result = await createPost({
      authorId: userId,
      authorName: 'You', // Will be populated from profile
      authorTier: 'core', // Default, will be determined by connections
      contentType: postData.contentType,
      content: postData.content,
      createdAt: new Date(),
      visibility: postData.visibility,
      isSuggested: false,
      isSponsored: false,
      interactions: [],
    });

    if (result) {
      toast.success(t('tierFeed.toasts.postCreated'));
    }
  }, [userId, createPost, t]);

  const bgColor = TIER_BG_COLORS[tier];
  const borderColor = TIER_BORDER_COLORS[tier];

  if (isLoading) {
    return (
      <div
        data-testid="feed-loading"
        className={`rounded-xl border ${borderColor} ${bgColor} p-8`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="ml-2 text-muted-foreground">{t('feed.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid={`tier-feed-${tier}`}
        className={`rounded-xl border ${borderColor} ${bgColor} p-8`}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center">
          <p className="text-destructive mb-4">{t('feed.errorLoadFeed')}</p>
          <Button variant="outline" onClick={() => window.location.reload()} aria-label={t('feed.retryLoadFeed')}>
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            {t('actions.retry')}
          </Button>
        </div>
      </div>
    );
  }

  // Render nudge panel
  const nudgePanel = tierNudges.length > 0 && (
    <SunsetNudgePanel
      nudges={tierNudges}
      onDismiss={dismissNudge}
      onAction={handleNudgeAction}
      onMarkConnected={onUpdateLastContacted ? handleMarkConnected : undefined}
    />
  );

  // Render posts or empty state
  const postsContent = posts.length === 0 ? (
    <div className="p-4">
      <EmptyFeedState
        tier={tier}
        hasFriends={hasFriendsInTier}
        isLoggedIn={isLoggedIn}
        onGoToManage={onGoToManage}
        onCreatePost={() => setComposeOpen(true)}
      />
    </div>
  ) : (
    <FeedList
      posts={posts}
      tier={tier}
      showLikeCount={showLikeCount}
      onInteract={addInteraction}
      friends={friends}
      feedDefaultContactMethod={defaultContactMethod}
      onRequestContactInfo={onRequestContactInfo}
    />
  );

  return (
    <motion.div
      data-testid={`tier-feed-${tier}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-xl border ${borderColor} ${bgColor} min-h-[400px]`}
    >
      <FeedHeader
        tier={tier}
        isLoggedIn={isLoggedIn}
        postCount={posts.length}
        defaultContactMethod={defaultContactMethod}
        onDefaultContactMethodChange={setDefaultContactMethod}
        composeOpen={composeOpen}
        onComposeOpenChange={setComposeOpen}
        onCreatePost={handleCreatePost}
      />

      {/*
        Layout order depends on urgency:
        - Critical nudges: Show Time to Reconnect ABOVE posts (urgent attention needed)
        - Normal: Show posts ABOVE Time to Reconnect (natural browsing flow)
      */}
      {isNudgeCritical ? (
        <>
          {nudgePanel}
          {postsContent}
        </>
      ) : (
        <>
          {postsContent}
          {nudgePanel}
        </>
      )}
    </motion.div>
  );
}

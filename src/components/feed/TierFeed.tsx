import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeed } from '@/hooks/useFeed';
import { Friend, TierType, ContactMethod } from '@/types/friend';
import { FeedHeader } from './FeedHeader';
import { FeedList } from './FeedList';
import { EmptyFeedState } from './EmptyFeedState';
import { SunsetNudgePanel } from './SunsetNudgePanel';

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
}: TierFeedProps) {
  const {
    nudges,
    getTierFeed,
    addInteraction,
    dismissNudge,
    shouldShowLikeCount,
    isLoading,
    error,
  } = useFeed({ userId, friends });

  // Feed-level default contact method
  const [defaultContactMethod, setDefaultContactMethod] = useState<ContactMethod>(
    DEFAULT_CONTACT_METHODS[tier]
  );

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

  const bgColor = TIER_BG_COLORS[tier];
  const borderColor = TIER_BORDER_COLORS[tier];

  if (isLoading) {
    return (
      <div
        data-testid="feed-loading"
        className={`rounded-xl border ${borderColor} ${bgColor} p-8`}
      >
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading feed...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid={`tier-feed-${tier}`}
        className={`rounded-xl border ${borderColor} ${bgColor} p-8`}
      >
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load feed</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
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

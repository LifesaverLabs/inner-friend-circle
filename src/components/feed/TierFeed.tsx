import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeed } from '@/hooks/useFeed';
import { Friend, TierType } from '@/types/friend';
import { FeedHeader } from './FeedHeader';
import { FeedList } from './FeedList';
import { EmptyFeedState } from './EmptyFeedState';
import { SunsetNudgePanel } from './SunsetNudgePanel';

type FeedTier = 'core' | 'inner' | 'outer';

// Outer+ includes these additional tiers beyond just 'outer'
const OUTER_PLUS_TIERS: TierType[] = ['outer', 'naybor', 'parasocial', 'rolemodel'];

interface TierFeedProps {
  tier: FeedTier;
  friends: Friend[];
  userId?: string;
  isLoggedIn: boolean;
  onGoToManage?: () => void;
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

export function TierFeed({
  tier,
  friends,
  userId,
  isLoggedIn,
  onGoToManage,
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
      />

      {tierNudges.length > 0 && (
        <SunsetNudgePanel
          nudges={tierNudges}
          onDismiss={dismissNudge}
        />
      )}

      {posts.length === 0 ? (
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
        />
      )}
    </motion.div>
  );
}

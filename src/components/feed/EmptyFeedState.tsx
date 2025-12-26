import { motion } from 'framer-motion';
import { Users, MessageCircle, PenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

type FeedTier = 'core' | 'inner' | 'outer';

interface EmptyFeedStateProps {
  tier: FeedTier;
  hasFriends?: boolean;
  isLoggedIn?: boolean;
  isNewUser?: boolean;
  onAddFriends?: (tier: FeedTier) => void;
  onCreatePost?: () => void;
  onGoToManage?: () => void;
}

const TIER_ICON_COLORS: Record<FeedTier, string> = {
  core: 'text-tier-core',
  inner: 'text-tier-inner',
  outer: 'text-tier-outer',
};

export function EmptyFeedState({
  tier,
  hasFriends = false,
  isLoggedIn = false,
  isNewUser = false,
  onAddFriends,
  onCreatePost,
  onGoToManage,
}: EmptyFeedStateProps) {
  const { t } = useTranslation();
  const iconColor = TIER_ICON_COLORS[tier];

  const handleAddClick = () => {
    if (onGoToManage) {
      onGoToManage();
    }
    if (onAddFriends) {
      onAddFriends(tier);
    }
  };

  return (
    <motion.div
      data-testid="empty-feed-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30"
    >
      <div
        data-testid="empty-feed-icon"
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 ${iconColor}`}
      >
        {hasFriends ? (
          <MessageCircle className="w-8 h-8" />
        ) : (
          <Users className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {hasFriends
          ? t('emptyState.noPostsYet')
          : t(`emptyState.noFriendsYet.${tier}`)}
      </h3>

      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        {hasFriends
          ? t(`emptyState.noPostsDescription.${tier}`)
          : t(`tiers.${tier}Description`)}
      </p>

      {!hasFriends && (
        <p className="text-sm text-muted-foreground mb-6">
          {isNewUser
            ? t(`emptyState.getStarted.${tier}`)
            : t(`emptyState.addToSee.${tier}`)}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!hasFriends && (
          <Button onClick={handleAddClick} variant="default">
            <Users className="w-4 h-4 mr-2" />
            {t(`emptyState.addFriends.${tier}`)}
          </Button>
        )}

        {hasFriends && isLoggedIn && (
          <Button onClick={onCreatePost} variant="default">
            <PenLine className="w-4 h-4 mr-2" />
            {t('emptyState.createPost')}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

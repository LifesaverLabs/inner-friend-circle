import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FeedPost, InteractionType } from '@/types/feed';
import { ContactMethod } from '@/types/friend';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';
import { Badge } from '@/components/ui/badge';

type FeedTier = 'core' | 'inner' | 'outer';

interface FeedPostCardProps {
  post: FeedPost;
  tier: FeedTier;
  showLikeCount: boolean;
  onInteract: (type: InteractionType, content?: string) => void;
  // Contact info for the post author
  authorPhone?: string;
  authorPreferredContact?: ContactMethod;
  // Feed-level default contact method
  feedDefaultContactMethod?: ContactMethod;
  // Callback to request adding contact info
  onRequestContactInfo?: (friendId: string) => void;
}

const TIER_BORDER_COLORS: Record<string, string> = {
  core: 'border-l-tier-core',
  inner: 'border-l-tier-inner',
  outer: 'border-l-tier-outer',
};

const TIER_BADGE_COLORS: Record<string, string> = {
  core: 'bg-tier-core/20 text-tier-core border-tier-core/30',
  inner: 'bg-tier-inner/20 text-tier-inner border-tier-inner/30',
  outer: 'bg-tier-outer/20 text-tier-outer border-tier-outer/30',
};

export const FeedPostCard = forwardRef<HTMLElement, FeedPostCardProps>(function FeedPostCard({
  post,
  tier,
  showLikeCount,
  onInteract,
  authorPhone,
  authorPreferredContact,
  feedDefaultContactMethod,
  onRequestContactInfo,
}, ref) {
  const { t } = useTranslation();
  const borderColor = TIER_BORDER_COLORS[post.authorTier] || TIER_BORDER_COLORS[tier];
  const badgeColor = TIER_BADGE_COLORS[post.authorTier] || TIER_BADGE_COLORS[tier];

  const likeCount = post.interactions.filter(i => i.type === 'like').length;
  const commentCount = post.interactions.filter(i => i.type === 'comment' || i.type === 'voice_reply').length;

  return (
    <motion.article
      ref={ref}
      data-testid={`feed-post-card-${post.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className={`bg-card rounded-xl p-4 border-l-4 ${borderColor} shadow-sm`}
    >
      {/* Author info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-lg font-medium">
            {post.authorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{post.authorName}</span>
            <Badge variant="outline" className={`text-xs ${badgeColor}`}>
              {post.authorTier}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Post content */}
      <PostContent post={post} />

      {/* Interaction counts (if shown) */}
      {(showLikeCount || commentCount > 0) && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
          {showLikeCount && likeCount > 0 && (
            <span>{t('feedPost.likeCount', { count: likeCount })}</span>
          )}
          {commentCount > 0 && (
            <span>{t('feedPost.commentCount', { count: commentCount })}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <PostActions
        post={post}
        tier={tier}
        showLikeCount={showLikeCount}
        onInteract={onInteract}
        authorPhone={authorPhone}
        authorPreferredContact={authorPreferredContact}
        feedDefaultContactMethod={feedDefaultContactMethod}
        onRequestContactInfo={onRequestContactInfo}
      />
    </motion.article>
  );
});

import { AnimatePresence } from 'framer-motion';
import { FeedPost, InteractionType } from '@/types/feed';
import { FeedPostCard } from './FeedPostCard';

type FeedTier = 'core' | 'inner' | 'outer';

interface FeedListProps {
  posts: FeedPost[];
  tier: FeedTier;
  showLikeCount: boolean;
  onInteract: (postId: string, type: InteractionType, content?: string) => void;
}

export function FeedList({
  posts,
  tier,
  showLikeCount,
  onInteract,
}: FeedListProps) {
  return (
    <div className="p-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <FeedPostCard
            key={post.id}
            post={post}
            tier={tier}
            showLikeCount={showLikeCount}
            onInteract={(type, content) => onInteract(post.id, type, content)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

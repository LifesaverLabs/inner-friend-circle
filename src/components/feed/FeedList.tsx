import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FeedPost, InteractionType } from '@/types/feed';
import { Friend, ContactMethod } from '@/types/friend';
import { FeedPostCard } from './FeedPostCard';

type FeedTier = 'core' | 'inner' | 'outer';

interface FeedListProps {
  posts: FeedPost[];
  tier: FeedTier;
  showLikeCount: boolean;
  onInteract: (postId: string, type: InteractionType, content?: string) => void;
  friends?: Friend[];
  feedDefaultContactMethod?: ContactMethod;
  onRequestContactInfo?: (friendId: string) => void;
}

export function FeedList({
  posts,
  tier,
  showLikeCount,
  onInteract,
  friends = [],
  feedDefaultContactMethod,
  onRequestContactInfo,
}: FeedListProps) {
  // Create a map of friend IDs to contact info for quick lookup
  const friendContactMap = useMemo(() => {
    const map = new Map<string, { phone?: string; preferredContact?: ContactMethod }>();
    for (const friend of friends) {
      map.set(friend.id, {
        phone: friend.phone,
        preferredContact: friend.preferredContact,
      });
    }
    return map;
  }, [friends]);

  return (
    <div className="p-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => {
          const contactInfo = friendContactMap.get(post.authorId);
          return (
            <FeedPostCard
              key={post.id}
              post={post}
              tier={tier}
              showLikeCount={showLikeCount}
              onInteract={(type, content) => onInteract(post.id, type, content)}
              authorPhone={contactInfo?.phone}
              authorPreferredContact={contactInfo?.preferredContact}
              feedDefaultContactMethod={feedDefaultContactMethod}
              onRequestContactInfo={onRequestContactInfo}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Rss, Sparkles } from 'lucide-react';
import { ParasocialFeedCard } from './ParasocialFeedCard';
import { ParasocialShare } from '@/hooks/useParasocial';

interface ParasocialFeedProps {
  shares: ParasocialShare[];
  seenShares: Set<string>;
  onEngage: (shareId: string) => void;
}

export function ParasocialFeed({ shares, seenShares, onEngage }: ParasocialFeedProps) {
  if (shares.length === 0) {
    return null;
  }

  const unseenCount = shares.filter(s => !seenShares.has(s.id)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-lg border border-tier-parasocial/30 bg-tier-parasocial/5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Rss className="w-4 h-4 text-tier-parasocial" />
        <h4 className="font-medium text-sm">Latest from your Parasocials</h4>
        {unseenCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs bg-tier-parasocial/20 text-tier-parasocial px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            {unseenCount} new
          </span>
        )}
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {shares.slice(0, 5).map((share) => (
            <ParasocialFeedCard
              key={share.id}
              share={share}
              isSeen={seenShares.has(share.id)}
              onEngage={onEngage}
            />
          ))}
        </AnimatePresence>
      </div>
      {shares.length > 5 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          And {shares.length - 5} more...
        </p>
      )}
    </motion.div>
  );
}

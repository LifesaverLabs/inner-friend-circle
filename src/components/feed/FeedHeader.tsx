import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComposePostDialog } from './ComposePostDialog';

type FeedTier = 'core' | 'inner' | 'outer';

interface FeedHeaderProps {
  tier: FeedTier;
  isLoggedIn: boolean;
  postCount: number;
}

const TIER_NAMES: Record<FeedTier, string> = {
  core: 'Core',
  inner: 'Inner',
  outer: 'Outer',
};

const TIER_DESCRIPTIONS: Record<FeedTier, string> = {
  core: 'Updates from your closest friends',
  inner: 'Updates from your close friends',
  outer: 'Updates from your meaningful connections',
};

export function FeedHeader({
  tier,
  isLoggedIn,
  postCount,
}: FeedHeaderProps) {
  const [composeOpen, setComposeOpen] = useState(false);

  return (
    <>
      <div
        data-testid="feed-header"
        className="flex items-center justify-between p-4 border-b border-inherit"
      >
        <div>
          <h2 className="text-lg font-semibold">{TIER_NAMES[tier]} Feed</h2>
          <p className="text-sm text-muted-foreground">
            {TIER_DESCRIPTIONS[tier]}
            {postCount > 0 && (
              <span className="ml-2">• {postCount} post{postCount !== 1 ? 's' : ''}</span>
            )}
          </p>
        </div>

        {isLoggedIn && (
          <Button
            onClick={() => setComposeOpen(true)}
            size="sm"
            className="gap-2"
          >
            <PenLine className="w-4 h-4" />
            Share
          </Button>
        )}
      </div>

      <ComposePostDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        defaultVisibility={[tier]}
      />
    </>
  );
}

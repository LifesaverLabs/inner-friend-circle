import { useState } from 'react';
import { Heart, MessageCircle, Mic, Phone, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedPost, InteractionType } from '@/types/feed';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type FeedTier = 'core' | 'inner' | 'outer';

interface PostActionsProps {
  post: FeedPost;
  tier: FeedTier;
  showLikeCount: boolean;
  onInteract: (type: InteractionType, content?: string) => void;
}

export function PostActions({
  post,
  tier,
  showLikeCount,
  onInteract,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false);

  // In Core/Inner, high-fidelity actions are prominent, likes are deprioritized
  const isHighFidelityTier = tier === 'core' || tier === 'inner';

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      onInteract('like');
    }
  };

  const handleComment = () => {
    // Would open comment dialog
    onInteract('comment', '');
  };

  const handleVoiceReply = () => {
    // Would open voice recorder
    onInteract('voice_reply', '');
  };

  const handleCall = () => {
    onInteract('call_accepted');
  };

  const handleMeetupRsvp = () => {
    onInteract('meetup_rsvp');
  };

  const handleShare = () => {
    onInteract('share');
  };

  return (
    <div className="flex items-center gap-1 mt-3 pt-3 border-t">
      {/* High-fidelity actions - prominent in Core/Inner */}
      {isHighFidelityTier && (
        <>
          {/* Voice Reply - high fidelity */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceReply}
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send a voice reply (high-fidelity)</TooltipContent>
          </Tooltip>

          {/* Call - high fidelity */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCall}
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start a call (high-fidelity)</TooltipContent>
          </Tooltip>

          {/* Meetup - high fidelity */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMeetupRsvp}
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Meetup</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Schedule a meetup (high-fidelity)</TooltipContent>
          </Tooltip>
        </>
      )}

      {/* Comment - medium fidelity, always shown */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add a comment</TooltipContent>
      </Tooltip>

      {/* Like - deprioritized in Core/Inner */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${
              isHighFidelityTier
                ? 'text-muted-foreground/50 hover:text-muted-foreground text-xs'
                : ''
            } ${liked ? 'text-red-500 hover:text-red-600' : ''}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {!isHighFidelityTier && <span className="hidden sm:inline">Like</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isHighFidelityTier
            ? 'Like (consider a more meaningful interaction)'
            : 'Like this post'}
        </TooltipContent>
      </Tooltip>

      {/* Share - always available */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2 ml-auto"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>

      {/* Outer tier has normal layout */}
      {!isHighFidelityTier && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceReply}
                className="gap-2"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice reply</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCall}
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}

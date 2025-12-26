import { useState } from 'react';
import { Heart, MessageCircle, Mic, Phone, Calendar, Share2, ChevronDown, Plus, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedPost, InteractionType } from '@/types/feed';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactMethod, CONTACT_METHODS, ContactMethodInfo } from '@/types/friend';
import { toast } from 'sonner';
import {
  isWarningSuppressed,
  suppressWarningUntilNextMonth,
  SUPPRESSIBLE_METHODS,
} from '@/lib/warningSuppressionUtils';

type FeedTier = 'core' | 'inner' | 'outer';

interface PostActionsProps {
  post: FeedPost;
  tier: FeedTier;
  showLikeCount: boolean;
  onInteract: (type: InteractionType, content?: string) => void;
  // Contact info - passed from parent
  authorPhone?: string;
  authorEmail?: string;
  authorPreferredContact?: ContactMethod;
  // Feed-level default overrides individual preferences
  feedDefaultContactMethod?: ContactMethod;
  // Callbacks
  onRequestContactInfo?: (authorId: string) => void;
  onContactMethodChange?: (authorId: string, method: ContactMethod) => void;
}

export function PostActions({
  post,
  tier,
  showLikeCount,
  onInteract,
  authorPhone,
  authorEmail,
  authorPreferredContact,
  feedDefaultContactMethod,
  onRequestContactInfo,
  onContactMethodChange,
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

  // Initiate actual contact via preferred method
  const initiateContact = (method: ContactMethod) => {
    if (!authorPhone) {
      toast.error('No contact information available');
      return;
    }

    try {
      const methodInfo = CONTACT_METHODS[method];

      // Show warning if the contact method has one (e.g., WeChat censorship warning)
      // unless the user has suppressed it for this month
      if (methodInfo.warning && !isWarningSuppressed(method)) {
        // Show warning with option to suppress for 1 month
        toast.warning(methodInfo.warning, {
          duration: 10000, // Show warning longer to allow reading and action
          action: SUPPRESSIBLE_METHODS.includes(method)
            ? {
                label: "Don't show for 1 month",
                onClick: () => {
                  suppressWarningUntilNextMonth(method);
                  toast.info(`${methodInfo.name} warnings silenced until next month`);
                },
              }
            : undefined,
        });
      }

      const url = methodInfo.getUrl(authorPhone);
      window.open(url, '_blank');
      toast.success(`Connecting via ${methodInfo.name}`);

      // Also log the interaction
      onInteract('call_accepted');
    } catch (error) {
      toast.error('Failed to initiate contact');
    }
  };

  const handleCall = () => {
    if (!authorPhone) {
      // No phone, show add contact info option
      if (onRequestContactInfo) {
        onRequestContactInfo(post.authorId);
      } else {
        toast.info('No contact information available for this person');
      }
      return;
    }

    // Use feed default > author preference > tel
    const method = feedDefaultContactMethod || authorPreferredContact || 'tel';
    initiateContact(method);
  };

  const handleContactMethodSelect = (method: ContactMethod) => {
    if (!authorPhone) {
      toast.error('No contact information available');
      return;
    }

    initiateContact(method);

    // Notify parent of method change if callback provided
    if (onContactMethodChange) {
      onContactMethodChange(post.authorId, method);
    }
  };

  const handleMeetupRsvp = () => {
    onInteract('meetup_rsvp');
  };

  const handleShare = () => {
    onInteract('share');
  };

  const handleAddContactInfo = () => {
    if (onRequestContactInfo) {
      onRequestContactInfo(post.authorId);
    }
  };

  // Get the currently effective contact method
  const effectiveMethod = feedDefaultContactMethod || authorPreferredContact || 'tel';

  // Render call button with dropdown for contact method selection
  const renderCallButton = (prominent: boolean) => {
    const hasPhone = !!authorPhone;
    const buttonClass = prominent
      ? 'gap-1 text-primary hover:text-primary hover:bg-primary/10'
      : 'gap-1';

    // If no phone, show "Add Contact Info" button
    if (!hasPhone) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddContactInfo}
              className={buttonClass}
              aria-label="Add contact info"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline text-xs">Add Contact Info</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add contact information for {post.authorName}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <DropdownMenu>
        <div className="flex items-center">
          {/* Main call button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCall}
                className={`${buttonClass} rounded-r-none pr-1`}
                aria-label={`Call via ${CONTACT_METHODS[effectiveMethod].name}`}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {prominent && <span className="hidden sm:inline">Call</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {prominent
                ? `Call via ${CONTACT_METHODS[effectiveMethod].name} (high-fidelity)`
                : `Call via ${CONTACT_METHODS[effectiveMethod].name}`}
            </TooltipContent>
          </Tooltip>

          {/* Dropdown trigger for contact method selection */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonClass} rounded-l-none pl-0 px-1`}
              data-testid="contact-method-dropdown"
              aria-label="Select contact method"
            >
              <ChevronDown className="w-3 h-3" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent align="start">
          {(Object.entries(CONTACT_METHODS) as [ContactMethod, ContactMethodInfo][]).map(([key, method]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleContactMethodSelect(key)}
              role="menuitem"
              aria-selected={key === effectiveMethod}
              className={`flex items-center gap-2 ${method.warning ? 'text-amber-600 dark:text-amber-500' : ''}`}
            >
              <span aria-hidden="true">{method.icon}</span>
              <span>{method.name}</span>
              {method.warning && (
                <span className="text-amber-500" aria-label="Warning: platform may have surveillance concerns">
                  <span aria-hidden="true">⚠️</span>
                </span>
              )}
              {key === effectiveMethod && (
                <span className="ml-auto text-xs text-muted-foreground">
                  <span className="sr-only">Currently selected</span>
                  <span aria-hidden="true">✓</span>
                </span>
              )}
            </DropdownMenuItem>
          ))}

          {onRequestContactInfo && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleAddContactInfo}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add more contact info</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex flex-col gap-1 mt-3 pt-3 border-t">
      {/* Mobile recommendation for contact actions */}
      {isHighFidelityTier && authorPhone && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <Smartphone className="w-3 h-3" aria-hidden="true" />
          <span>For best results, use your phone for calls</span>
        </div>
      )}
      <div className="flex items-center gap-1">
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
                aria-label="Voice Reply"
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Voice Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send a voice reply (high-fidelity)</TooltipContent>
          </Tooltip>

          {/* Call - high fidelity with dropdown */}
          {renderCallButton(true)}

          {/* Meetup - high fidelity */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMeetupRsvp}
                className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                aria-label="Schedule a meetup"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
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
            aria-label="Add a comment"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
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
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
            aria-pressed={liked}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} aria-hidden="true" />
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
            aria-label="Share this post"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
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
                aria-label="Send a voice reply"
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice reply</TooltipContent>
          </Tooltip>

          {/* Call button with dropdown for outer tier */}
          {renderCallButton(false)}
        </>
      )}
      </div>
    </div>
  );
}

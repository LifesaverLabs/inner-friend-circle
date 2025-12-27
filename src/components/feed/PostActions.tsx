import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.error(t('post.toasts.noContact'));
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
                label: t('post.dontShowMonth'),
                onClick: () => {
                  suppressWarningUntilNextMonth(method);
                  toast.info(t('post.warningSilenced', { method: methodInfo.name }));
                },
              }
            : undefined,
        });
      }

      const url = methodInfo.getUrl(authorPhone);
      window.open(url, '_blank');
      toast.success(t('post.connectingVia', { method: methodInfo.name }));

      // Also log the interaction
      onInteract('call_accepted');
    } catch (error) {
      toast.error(t('post.toasts.contactFailed'));
    }
  };

  const handleCall = () => {
    if (!authorPhone) {
      // No phone, show add contact info option
      if (onRequestContactInfo) {
        onRequestContactInfo(post.authorId);
      } else {
        toast.info(t('post.toasts.noContactPerson'));
      }
      return;
    }

    // Use feed default > author preference > tel
    const method = feedDefaultContactMethod || authorPreferredContact || 'tel';
    initiateContact(method);
  };

  const handleContactMethodSelect = (method: ContactMethod) => {
    if (!authorPhone) {
      toast.error(t('post.toasts.noContact'));
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
              aria-label={t('post.addContactInfo')}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline text-xs">{t('post.addContactInfo')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('post.addContactInfoTooltip', { name: post.authorName })}</TooltipContent>
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
                aria-label={t('post.callVia', { method: CONTACT_METHODS[effectiveMethod].name })}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {prominent && <span className="hidden sm:inline">{t('post.call')}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {prominent
                ? t('post.callViaHighFidelity', { method: CONTACT_METHODS[effectiveMethod].name })
                : t('post.callVia', { method: CONTACT_METHODS[effectiveMethod].name })}
            </TooltipContent>
          </Tooltip>

          {/* Dropdown trigger for contact method selection */}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`${buttonClass} rounded-l-none pl-0 px-1`}
              data-testid="contact-method-dropdown"
              aria-label={t('post.selectContactMethod')}
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
                <span className="text-amber-500" aria-label={t('post.warningPlatform')}>
                  <span aria-hidden="true">⚠️</span>
                </span>
              )}
              {key === effectiveMethod && (
                <span className="ml-auto text-xs text-muted-foreground">
                  <span className="sr-only">{t('post.currentlySelected')}</span>
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
                <span>{t('post.addMoreContactInfo')}</span>
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
          <span>{t('post.usePhoneRecommendation')}</span>
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
                aria-label={t('post.voiceReply')}
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('post.voiceReply')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('post.voiceReplyTooltip')}</TooltipContent>
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
                aria-label={t('post.meetup')}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('post.meetup')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('post.meetupTooltip')}</TooltipContent>
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
            aria-label={t('post.commentTooltip')}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('post.comment')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('post.commentTooltip')}</TooltipContent>
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
            aria-label={liked ? t('feed.unlike') : t('post.likeTooltip')}
            aria-pressed={liked}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} aria-hidden="true" />
            {!isHighFidelityTier && <span className="hidden sm:inline">{t('post.like')}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isHighFidelityTier
            ? t('post.likeTooltipHighFidelity')
            : t('post.likeTooltip')}
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
            aria-label={t('post.shareTooltip')}
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('post.shareTooltip')}</TooltipContent>
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
                aria-label={t('post.voiceReply')}
              >
                <Mic className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('feed.voiceReply')}</TooltipContent>
          </Tooltip>

          {/* Call button with dropdown for outer tier */}
          {renderCallButton(false)}
        </>
      )}
      </div>
    </div>
  );
}

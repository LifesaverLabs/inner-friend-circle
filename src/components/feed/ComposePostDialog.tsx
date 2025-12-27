import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Type,
  Image,
  Mic,
  Video,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  Send,
} from 'lucide-react';
import { TierType } from '@/types/friend';
import { PostContentType } from '@/types/feed';

type FeedTier = 'core' | 'inner' | 'outer';

interface ComposePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultVisibility?: FeedTier[];
  onSubmit?: (post: {
    content: string;
    contentType: PostContentType;
    visibility: TierType[];
  }) => Promise<void>;
}

const CONTENT_TYPES: Array<{
  type: PostContentType;
  icon: typeof Type;
  labelKey: string;
}> = [
  { type: 'text', icon: Type, labelKey: 'compose.types.text' },
  { type: 'photo', icon: Image, labelKey: 'compose.types.photo' },
  { type: 'voice_note', icon: Mic, labelKey: 'compose.types.voice' },
  { type: 'video', icon: Video, labelKey: 'compose.types.video' },
  { type: 'call_invite', icon: Phone, labelKey: 'compose.types.call' },
  { type: 'meetup_invite', icon: Calendar, labelKey: 'compose.types.meetup' },
  { type: 'proximity_ping', icon: MapPin, labelKey: 'compose.types.nearby' },
  { type: 'life_update', icon: Sparkles, labelKey: 'compose.types.update' },
];

const VISIBILITY_OPTIONS: Array<{ tier: FeedTier; labelKey: string }> = [
  { tier: 'core', labelKey: 'compose.visibilityOptions.core' },
  { tier: 'inner', labelKey: 'compose.visibilityOptions.inner' },
  { tier: 'outer', labelKey: 'compose.visibilityOptions.outer' },
];

export function ComposePostDialog({
  open,
  onOpenChange,
  defaultVisibility = ['core', 'inner', 'outer'],
  onSubmit,
}: ComposePostDialogProps) {
  const { t } = useTranslation();
  const [contentType, setContentType] = useState<PostContentType>('text');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Set<FeedTier>>(
    new Set(defaultVisibility)
  );

  const getPlaceholder = (type: PostContentType): string => {
    switch (type) {
      case 'text':
        return t('compose.placeholders.text');
      case 'photo':
        return t('compose.placeholders.photo');
      case 'video':
        return t('compose.placeholders.video');
      case 'call_invite':
        return t('compose.placeholders.call');
      case 'meetup_invite':
        return t('compose.placeholders.meetup');
      case 'proximity_ping':
        return t('compose.placeholders.nearby');
      case 'life_update':
        return t('compose.placeholders.update');
      default:
        return t('compose.placeholders.default');
    }
  };

  const handleVisibilityChange = (tier: FeedTier, checked: boolean) => {
    const newVisibility = new Set(visibility);
    if (checked) {
      newVisibility.add(tier);
    } else {
      newVisibility.delete(tier);
    }
    setVisibility(newVisibility);
  };

  const handleSubmit = async () => {
    if (!content.trim() || visibility.size === 0) return;

    try {
      await onSubmit?.({
        content: content.trim(),
        contentType,
        visibility: Array.from(visibility) as TierType[],
      });

      // Reset form only after successful submission
      setContent('');
      setContentType('text');
      setVisibility(new Set(defaultVisibility));
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the onSubmit function
      console.error('Failed to create post:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('compose.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content type selector */}
          <div>
            <Label className="text-sm font-medium mb-2 block">{t('compose.type')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {CONTENT_TYPES.map(({ type, icon: Icon, labelKey }) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                    contentType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{t(labelKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content input */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium mb-2 block">
              {t('compose.content')}
            </Label>
            {contentType === 'voice_note' ? (
              <div className="p-4 border rounded-lg text-center text-muted-foreground">
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{t('compose.voiceComingSoon')}</p>
              </div>
            ) : (
              <Textarea
                id="content"
                placeholder={getPlaceholder(contentType)}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
            )}
          </div>

          {/* Visibility selector */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('compose.visibility')}
            </Label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map(({ tier, labelKey }) => (
                <div key={tier} className="flex items-center gap-2">
                  <Checkbox
                    id={`visibility-${tier}`}
                    checked={visibility.has(tier)}
                    onCheckedChange={(checked) =>
                      handleVisibilityChange(tier, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`visibility-${tier}`}
                    className="text-sm cursor-pointer"
                  >
                    {t(labelKey)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || visibility.size === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('compose.shareButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

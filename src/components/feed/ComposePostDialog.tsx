import { useState } from 'react';
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
  }) => void;
}

const CONTENT_TYPES: Array<{
  type: PostContentType;
  icon: typeof Type;
  label: string;
  description: string;
}> = [
  { type: 'text', icon: Type, label: 'Text', description: 'Share a thought' },
  { type: 'photo', icon: Image, label: 'Photo', description: 'Share a photo' },
  { type: 'voice_note', icon: Mic, label: 'Voice', description: 'Record a voice note' },
  { type: 'video', icon: Video, label: 'Video', description: 'Share a video' },
  { type: 'call_invite', icon: Phone, label: 'Call', description: 'Invite to a call' },
  { type: 'meetup_invite', icon: Calendar, label: 'Meetup', description: 'Plan a meetup' },
  { type: 'proximity_ping', icon: MapPin, label: 'Nearby', description: "I'm nearby!" },
  { type: 'life_update', icon: Sparkles, label: 'Update', description: 'Share a life update' },
];

const VISIBILITY_OPTIONS: Array<{ tier: FeedTier; label: string }> = [
  { tier: 'core', label: 'Core (5 closest)' },
  { tier: 'inner', label: 'Inner Circle (15)' },
  { tier: 'outer', label: 'Outer Circle (150)' },
];

export function ComposePostDialog({
  open,
  onOpenChange,
  defaultVisibility = ['core', 'inner', 'outer'],
  onSubmit,
}: ComposePostDialogProps) {
  const [contentType, setContentType] = useState<PostContentType>('text');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Set<FeedTier>>(
    new Set(defaultVisibility)
  );

  const handleVisibilityChange = (tier: FeedTier, checked: boolean) => {
    const newVisibility = new Set(visibility);
    if (checked) {
      newVisibility.add(tier);
    } else {
      newVisibility.delete(tier);
    }
    setVisibility(newVisibility);
  };

  const handleSubmit = () => {
    if (!content.trim() || visibility.size === 0) return;

    onSubmit?.({
      content: content.trim(),
      contentType,
      visibility: Array.from(visibility) as TierType[],
    });

    // Reset form
    setContent('');
    setContentType('text');
    setVisibility(new Set(defaultVisibility));
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share with your circles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content type selector */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {CONTENT_TYPES.map(({ type, icon: Icon, label }) => (
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
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content input */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium mb-2 block">
              Content
            </Label>
            {contentType === 'voice_note' ? (
              <div className="p-4 border rounded-lg text-center text-muted-foreground">
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Voice recording coming soon</p>
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
              Who can see this?
            </Label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map(({ tier, label }) => (
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
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || visibility.size === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getPlaceholder(type: PostContentType): string {
  switch (type) {
    case 'text':
      return "What's on your mind?";
    case 'photo':
      return 'Add a caption to your photo...';
    case 'video':
      return 'Add a description to your video...';
    case 'call_invite':
      return 'Add details about the call...';
    case 'meetup_invite':
      return 'What are you planning?';
    case 'proximity_ping':
      return "Let your friends know you're nearby...";
    case 'life_update':
      return 'Share your exciting news...';
    default:
      return 'Write something...';
  }
}

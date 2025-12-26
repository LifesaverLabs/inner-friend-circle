import { Calendar, MapPin, Phone, Video, Mic } from 'lucide-react';
import { FeedPost } from '@/types/feed';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';

interface PostContentProps {
  post: FeedPost;
}

export function PostContent({ post }: PostContentProps) {
  switch (post.contentType) {
    case 'text':
      return <TextContent content={post.content} />;

    case 'photo':
      return <PhotoContent content={post.content} mediaUrl={post.mediaUrl} />;

    case 'video':
      return <VideoContent content={post.content} mediaUrl={post.mediaUrl} />;

    case 'voice_note':
      return <VoiceNoteContent content={post.content} mediaUrl={post.mediaUrl} />;

    case 'call_invite':
      return <CallInviteContent content={post.content} scheduledAt={post.scheduledAt} />;

    case 'meetup_invite':
      return (
        <MeetupInviteContent
          content={post.content}
          scheduledAt={post.scheduledAt}
          location={post.location}
        />
      );

    case 'proximity_ping':
      return <ProximityPingContent content={post.content} location={post.location} />;

    case 'life_update':
      return <LifeUpdateContent content={post.content} />;

    default:
      return <TextContent content={post.content} />;
  }
}

function TextContent({ content }: { content: string }) {
  return (
    <p className="text-foreground whitespace-pre-wrap">{content}</p>
  );
}

function PhotoContent({ content, mediaUrl }: { content: string; mediaUrl?: string }) {
  return (
    <div className="space-y-2">
      {content && <p className="text-foreground">{content}</p>}
      {mediaUrl && (
        <img
          src={mediaUrl}
          alt="Shared photo"
          className="rounded-lg max-h-96 w-full object-cover"
        />
      )}
    </div>
  );
}

function VideoContent({ content, mediaUrl }: { content: string; mediaUrl?: string }) {
  return (
    <div className="space-y-2">
      {content && <p className="text-foreground">{content}</p>}
      {mediaUrl && (
        <video
          src={mediaUrl}
          controls
          className="rounded-lg max-h-96 w-full"
        />
      )}
    </div>
  );
}

function VoiceNoteContent({ content, mediaUrl }: { content: string; mediaUrl?: string }) {
  return (
    <div className="space-y-2">
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Voice Note</p>
            {mediaUrl ? (
              <audio src={mediaUrl} controls className="w-full mt-2" />
            ) : (
              <p className="text-xs text-muted-foreground">Audio unavailable</p>
            )}
          </div>
        </div>
      </Card>
      {content && <p className="text-sm text-muted-foreground">{content}</p>}
    </div>
  );
}

function CallInviteContent({ content, scheduledAt }: { content: string; scheduledAt?: Date }) {
  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Call Invitation</p>
          {scheduledAt && (
            <p className="text-sm text-muted-foreground">
              {format(scheduledAt, 'PPp')}
            </p>
          )}
          {content && <p className="text-sm mt-1">{content}</p>}
        </div>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Phone className="w-4 h-4 mr-2" />
          Join
        </Button>
      </div>
    </Card>
  );
}

function MeetupInviteContent({
  content,
  scheduledAt,
  location,
}: {
  content: string;
  scheduledAt?: Date;
  location?: { name: string; coordinates?: { lat: number; lng: number } };
}) {
  return (
    <Card className="p-4 bg-gradient-to-r from-tier-core/10 to-tier-core/5 border-tier-core/20">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-tier-core/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-tier-core" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Meetup Invitation</p>
            {scheduledAt && (
              <p className="text-sm text-muted-foreground">
                {format(scheduledAt, 'EEEE, MMMM do')} at {format(scheduledAt, 'h:mm a')}
              </p>
            )}
          </div>
        </div>

        {location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{location.name}</span>
          </div>
        )}

        {content && <p className="text-sm">{content}</p>}

        <div className="flex gap-2">
          <Button size="sm" variant="default">
            RSVP Yes
          </Button>
          <Button size="sm" variant="outline">
            Maybe
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProximityPingContent({
  content,
  location,
}: {
  content: string;
  location?: { name: string; coordinates?: { lat: number; lng: number } };
}) {
  return (
    <Card className="p-4 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center animate-pulse">
          <MapPin className="w-6 h-6 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-medium">I'm nearby!</p>
          {location && (
            <p className="text-sm text-muted-foreground">{location.name}</p>
          )}
          {content && <p className="text-sm mt-1">{content}</p>}
        </div>
        <Button size="sm" variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
      </div>
    </Card>
  );
}

function LifeUpdateContent({ content }: { content: string }) {
  return (
    <Card className="p-4 bg-gradient-to-r from-tier-inner/10 to-tier-inner/5 border-tier-inner/20">
      <div className="flex items-start gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <p className="font-medium text-sm text-tier-inner mb-1">Life Update</p>
          <p className="text-foreground">{content}</p>
        </div>
      </div>
    </Card>
  );
}

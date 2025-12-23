import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FriendConnection, CircleTier } from '@/hooks/useFriendConnections';

const TIER_LABELS: Record<CircleTier, { name: string; color: string }> = {
  core: { name: 'Core', color: 'bg-tier-core text-white' },
  inner: { name: 'Inner', color: 'bg-tier-inner text-white' },
  outer: { name: 'Outer', color: 'bg-tier-outer text-white' },
};

interface ConnectionRequestsPanelProps {
  requests: FriendConnection[];
  onAccept: (connectionId: string) => void;
  onDecline: (connectionId: string) => void;
}

export function ConnectionRequestsPanel({
  requests,
  onAccept,
  onDecline,
}: ConnectionRequestsPanelProps) {
  if (requests.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-primary" />
          Connection Requests
          <Badge variant="secondary" className="ml-2">
            {requests.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          People who want to connect with you. Accept to share contact info.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.requester_profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {request.requester_profile?.display_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {request.requester_profile?.display_name || 'Unknown User'}
                  </p>
                  {request.requester_profile?.user_handle && (
                    <p className="text-sm text-muted-foreground">
                      @{request.requester_profile.user_handle}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {request.disclose_circle ? (
                      <Badge className={TIER_LABELS[request.circle_tier].color}>
                        Added you as {TIER_LABELS[request.circle_tier].name}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Circle hidden
                      </Badge>
                    )}
                    {request.matched_contact_method && (
                      <span className="text-xs text-muted-foreground">
                        via {request.matched_contact_method.service_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDecline(request.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(request.id)}
                  className="bg-primary"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

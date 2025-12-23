import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Share2, Heart } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TierSection } from '@/components/TierSection';
import { AppHeader } from '@/components/AppHeader';
import { ShareDialog } from '@/components/ShareDialog';
import { TendingDialog } from '@/components/TendingDialog';
import { ProfileSettingsDialog } from '@/components/ProfileSettingsDialog';
import { ContactSetupOnboarding, useContactSetupNeeded } from '@/components/ContactSetupOnboarding';
import { MissionBanner } from '@/components/MissionBanner';
import { ConnectionRequestsPanel } from '@/components/ConnectionRequestsPanel';
import { useFriendLists } from '@/hooks/useFriendLists';
import { useAuth } from '@/hooks/useAuth';
import { useFriendConnections, CircleTier } from '@/hooks/useFriendConnections';
import { TierType } from '@/types/friend';

interface FriendDashboardProps {
  isLoggedIn: boolean;
  userEmail?: string;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function FriendDashboard({ 
  isLoggedIn, 
  userEmail, 
  onSignIn, 
  onSignOut 
}: FriendDashboardProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [tendingDialogOpen, setTendingDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { user } = useAuth();
  const { needsSetup, setNeedsSetup } = useContactSetupNeeded(user?.id);
  
  const {
    pendingRequests,
    createConnectionRequest,
    respondToRequest,
  } = useFriendConnections(user?.id);
  
  const {
    lists,
    isLoaded,
    lastTendedAt,
    getFriendsInTier,
    getTierCapacity,
    addFriend,
    moveFriend,
    removeFriend,
    reorderFriendsInTier,
    addReservedGroup,
    updateReservedGroup,
    removeReservedGroup,
    updateFriend,
    markTended,
  } = useFriendLists();

  const daysSinceLastTended = useMemo(() => {
    if (!lastTendedAt) return null;
    return differenceInDays(new Date(), lastTendedAt);
  }, [lastTendedAt]);

  const needsUrgentTending = daysSinceLastTended !== null && daysSinceLastTended >= 30;

  const handleAddFriend = (tier: TierType) => (name: string, email?: string, roleModelReason?: string) => {
    const result = addFriend({ name, email, tier, roleModelReason });
    if (result.success) {
      toast.success(`Added ${name} to your ${tier} circle`);
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateLastContacted = (id: string) => {
    updateFriend(id, { lastContacted: new Date() });
  };

  const handleMoveFriend = (id: string, newTier: TierType) => {
    const friend = lists.friends.find(f => f.id === id);
    const result = moveFriend(id, newTier);
    if (result.success && friend) {
      toast.success(`Moved ${friend.name} to ${newTier}`);
    } else {
      toast.error(result.error || 'Failed to move friend');
    }
  };

  const handleRemoveFriend = (id: string) => {
    const friend = lists.friends.find(f => f.id === id);
    removeFriend(id);
    if (friend) {
      toast.success(`Removed ${friend.name} from your lists`);
    }
  };

  const handleAddReservedGroup = (tier: TierType) => (count: number, note?: string) => {
    const result = addReservedGroup(tier, count, note);
    if (result.success) {
      toast.success(`Added reserved group to ${tier}`);
    } else {
      toast.error(result.error || 'Failed to add reserved group');
    }
  };

  const handleUpdateReservedGroup = (tier: TierType) => (groupId: string, count: number, note?: string) => {
    updateReservedGroup(tier, groupId, count, note);
    toast.success(`Updated reserved group`);
  };

  const handleRemoveReservedGroup = (tier: TierType) => (groupId: string) => {
    removeReservedGroup(tier, groupId);
    toast.success(`Removed reserved group`);
  };

  const handleReorderFriends = (tier: TierType) => (orderedIds: string[]) => {
    reorderFriendsInTier(tier, orderedIds);
  };

  const handleAddLinkedFriend = async (
    targetUserId: string,
    circleTier: CircleTier,
    matchedContactMethodId: string | null,
    discloseCircle: boolean
  ) => {
    return createConnectionRequest(targetUserId, circleTier, matchedContactMethodId, discloseCircle);
  };

  const handleAcceptRequest = async (connectionId: string) => {
    await respondToRequest(connectionId, true);
  };

  const handleDeclineRequest = async (connectionId: string) => {
    await respondToRequest(connectionId, false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-muted-foreground"
        >
          Loading your circles...
        </motion.div>
      </div>
    );
  }

  const tiers: TierType[] = ['core', 'inner', 'outer', 'parasocial', 'rolemodel', 'acquainted'];

  // Define allowed move transitions
  // acquainted can only move to outer; outer can move to inner or acquainted
  // rolemodel is standalone - no moves allowed
  const getAllowedMoves = (fromTier: TierType): TierType[] => {
    switch (fromTier) {
      case 'core': return ['inner'];
      case 'inner': return ['core', 'outer'];
      case 'outer': return ['inner', 'acquainted'];
      case 'parasocial': return ['outer'];
      case 'rolemodel': return []; // Role models don't move between tiers
      case 'acquainted': return ['outer'];
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoggedIn && user && needsSetup && (
        <ContactSetupOnboarding
          userId={user.id}
          onComplete={() => setNeedsSetup(false)}
          onSkip={() => setNeedsSetup(false)}
        />
      )}

      <AppHeader
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onSettings={isLoggedIn ? () => setSettingsOpen(true) : undefined}
      />

      <main className="container mx-auto px-4 py-8">
        <MissionBanner />
        
        {/* Connection Requests Panel */}
        {isLoggedIn && pendingRequests.length > 0 && (
          <div className="mb-6">
            <ConnectionRequestsPanel
              requests={pendingRequests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
            />
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Your Inner Circles
              </h1>
              <p className="text-muted-foreground">
                Curate and tend to your closest relationships
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setTendingDialogOpen(true)}
              className={`shrink-0 relative ${needsUrgentTending ? 'border-destructive' : ''}`}
            >
              <motion.div
                animate={needsUrgentTending ? { 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="flex items-center"
              >
                <Heart className={`h-4 w-4 mr-2 ${needsUrgentTending ? 'text-destructive fill-destructive' : ''}`} />
              </motion.div>
              <span className="flex flex-col items-start">
                <span>Tend</span>
                {lastTendedAt && (
                  <span className={`text-[10px] ${needsUrgentTending ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formatDistanceToNow(lastTendedAt, { addSuffix: true })}
                  </span>
                )}
              </span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShareDialogOpen(true)}
              className="shrink-0"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground mt-4 bg-muted/50 rounded-lg px-4 py-2 inline-block">
              💡 Your lists are saved locally. Create an account to sync across devices and enable mutual matching.
            </p>
          )}
        </motion.div>

        <div className="space-y-6">
          {tiers.map(tier => (
            <TierSection
              key={tier}
              tier={tier}
              friends={getFriendsInTier(tier)}
              reservedGroups={lists.reservedSpots[tier] || []}
              onAddFriend={handleAddFriend(tier)}
              onMoveFriend={handleMoveFriend}
              onRemoveFriend={handleRemoveFriend}
              onAddReservedGroup={handleAddReservedGroup(tier)}
              onUpdateReservedGroup={handleUpdateReservedGroup(tier)}
              onRemoveReservedGroup={handleRemoveReservedGroup(tier)}
              onReorderFriends={handleReorderFriends(tier)}
              getTierCapacity={getTierCapacity}
              isLoggedIn={isLoggedIn}
              onAddLinkedFriend={handleAddLinkedFriend}
              onUpdateFriend={updateFriend}
              getAllowedMoves={getAllowedMoves}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/70 italic max-w-2xl mx-auto">
            Note: These Dunbar-inspired tier limits are subject to change as community conscience science evolves. 
            Future modifications may include rules where certain tier counts affect others — for example, 
            parasocial connections might reduce your allowable outer friend capacity.
          </p>
        </motion.div>

        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          friends={lists.friends}
          getFriendsInTier={getFriendsInTier}
        />

        <TendingDialog
          open={tendingDialogOpen}
          onOpenChange={setTendingDialogOpen}
          friends={lists.friends}
          getFriendsInTier={getFriendsInTier}
          onUpdateLastContacted={handleUpdateLastContacted}
          onTendingComplete={markTended}
        />

        {user && (
          <ProfileSettingsDialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            userId={user.id}
          />
        )}
      </main>
    </div>
  );
}

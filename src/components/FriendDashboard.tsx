import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TierSection } from '@/components/TierSection';
import { AppHeader } from '@/components/AppHeader';
import { ShareDialog } from '@/components/ShareDialog';
import { TendingDialog } from '@/components/TendingDialog';
import { useFriendLists } from '@/hooks/useFriendLists';
import { TierType, ContactMethod } from '@/types/friend';

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
  
  const {
    lists,
    isLoaded,
    getFriendsInTier,
    getTierCapacity,
    addFriend,
    moveFriend,
    removeFriend,
    reorderFriendsInTier,
    setReservedSpots,
    updateFriend,
  } = useFriendLists();

  const handleAddFriend = (tier: TierType) => (name: string, email?: string, phone?: string, preferredContact?: ContactMethod) => {
    const result = addFriend({ name, email, phone, preferredContact, tier });
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

  const handleSetReserved = (tier: TierType) => (count: number, note?: string) => {
    setReservedSpots(tier, count, note);
    toast.success(`Updated reserved spots for ${tier}`);
  };

  const handleReorderFriends = (tier: TierType) => (orderedIds: string[]) => {
    reorderFriendsInTier(tier, orderedIds);
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

  const tiers: TierType[] = ['core', 'inner', 'outer', 'parasocial'];

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
              className="shrink-0"
            >
              <Heart className="h-4 w-4 mr-2" />
              Tend
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
              reservedCount={lists.reservedSpots[tier]}
              reservedNote={lists.reservedSpots.notes[tier]}
              onAddFriend={handleAddFriend(tier)}
              onMoveFriend={handleMoveFriend}
              onRemoveFriend={handleRemoveFriend}
              onSetReserved={handleSetReserved(tier)}
              onReorderFriends={handleReorderFriends(tier)}
              getTierCapacity={getTierCapacity}
            />
          ))}
        </div>

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
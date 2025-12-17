import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FriendCard } from './FriendCard';
import { AddFriendDialog } from './AddFriendDialog';
import { ReservedSpotsDialog } from './ReservedSpotsDialog';
import { Friend, TierType, TIER_INFO, TIER_LIMITS } from '@/types/friend';

interface TierSectionProps {
  tier: TierType;
  friends: Friend[];
  reservedCount: number;
  reservedNote?: string;
  onAddFriend: (name: string, email?: string) => void;
  onMoveFriend: (id: string, newTier: TierType) => void;
  onRemoveFriend: (id: string) => void;
  onSetReserved: (count: number, note?: string) => void;
  getTierCapacity: (tier: TierType) => { available: number; used: number; limit: number };
}

export function TierSection({
  tier,
  friends,
  reservedCount,
  reservedNote,
  onAddFriend,
  onMoveFriend,
  onRemoveFriend,
  onSetReserved,
  getTierCapacity,
}: TierSectionProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [reservedDialogOpen, setReservedDialogOpen] = useState(false);

  const tierInfo = TIER_INFO[tier];
  const capacity = getTierCapacity(tier);
  const progressPercent = (capacity.used / capacity.limit) * 100;

  const tierOrder: TierType[] = ['core', 'inner', 'outer'];
  const currentIndex = tierOrder.indexOf(tier);

  const canMoveUp = (friendTier: TierType) => {
    const targetTier = tierOrder[tierOrder.indexOf(friendTier) - 1];
    if (!targetTier) return false;
    return getTierCapacity(targetTier).available > 0;
  };

  const canMoveDown = (friendTier: TierType) => {
    const targetTier = tierOrder[tierOrder.indexOf(friendTier) + 1];
    if (!targetTier) return false;
    return getTierCapacity(targetTier).available > 0;
  };

  const bgColors: Record<TierType, string> = {
    core: 'bg-tier-core/5',
    inner: 'bg-tier-inner/5',
    outer: 'bg-tier-outer/5',
  };

  const borderColors: Record<TierType, string> = {
    core: 'border-tier-core/20',
    inner: 'border-tier-inner/20',
    outer: 'border-tier-outer/20',
  };

  const progressColors: Record<TierType, string> = {
    core: '[&>div]:bg-tier-core',
    inner: '[&>div]:bg-tier-inner',
    outer: '[&>div]:bg-tier-outer',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: currentIndex * 0.1 }}
      className={`tier-section border ${bgColors[tier]} ${borderColors[tier]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full bg-${tierInfo.color}`} />
            <h3 className="font-display text-xl font-semibold text-foreground">
              {tierInfo.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              ({capacity.used}/{capacity.limit})
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{tierInfo.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReservedDialogOpen(true)}
            className="gap-1"
          >
            <Lock className="w-4 h-4" />
            {reservedCount > 0 ? `${reservedCount} Reserved` : 'Reserve'}
          </Button>
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            disabled={capacity.available <= 0}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      <Progress 
        value={progressPercent} 
        className={`h-2 mb-4 ${progressColors[tier]}`} 
      />

      {friends.length === 0 && reservedCount === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No {tierInfo.name.toLowerCase()} friends yet</p>
          <p className="text-xs mt-1">Add someone to your closest circle</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {friends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onMove={onMoveFriend}
                onRemove={onRemoveFriend}
                canMoveUp={canMoveUp(tier)}
                canMoveDown={canMoveDown(tier)}
              />
            ))}
          </AnimatePresence>

          {reservedCount > 0 && (
            <motion.div
              layout
              className="friend-card bg-muted/50 border border-dashed border-border flex items-center gap-3 cursor-pointer hover:bg-muted/70"
              onClick={() => setReservedDialogOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-muted-foreground">
                  {reservedCount} Reserved Spot{reservedCount !== 1 ? 's' : ''}
                </h4>
                {reservedNote && (
                  <p className="text-xs text-muted-foreground/70 truncate italic">
                    {reservedNote}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      <AddFriendDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        tier={tier}
        onAdd={onAddFriend}
        capacity={capacity}
      />

      <ReservedSpotsDialog
        open={reservedDialogOpen}
        onOpenChange={setReservedDialogOpen}
        tier={tier}
        currentReserved={reservedCount}
        currentNote={reservedNote}
        friendCount={friends.length}
        onSave={onSetReserved}
      />
    </motion.section>
  );
}
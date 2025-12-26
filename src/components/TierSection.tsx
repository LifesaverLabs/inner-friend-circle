import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Plus, Lock, Users, Link2, Star, UserPlus, Key } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FriendCard } from './FriendCard';
import { RoleModelCard } from './RoleModelCard';
import { ReservedGroupCard } from './ReservedGroupCard';
import { AddFriendDialog } from './AddFriendDialog';
import { AddLinkedFriendDialog } from './AddLinkedFriendDialog';
import { AddRoleModelDialog } from './AddRoleModelDialog';
import { ReservedSpotsDialog } from './ReservedSpotsDialog';
import { ParasocialFeed } from './ParasocialFeed';
import { FollowCreatorDialog } from './FollowCreatorDialog';
import { NayborSOSBanner } from './naybor/NayborSOSBanner';
import { KeysSharedDialog } from './naybor/KeysSharedDialog';
import { HomeEntryPreferences } from '@/types/keysShared';
import { Friend, TierType, TIER_INFO, TIER_LIMITS, ReservedGroup } from '@/types/friend';
import { CircleTier } from '@/hooks/useFriendConnections';
import { ParasocialShare } from '@/hooks/useParasocial';

interface TierSectionProps {
  tier: TierType;
  friends: Friend[];
  reservedGroups: ReservedGroup[];
  onAddFriend: (name: string, email?: string, roleModelReason?: string) => void;
  onMoveFriend: (id: string, newTier: TierType) => void;
  onRemoveFriend: (id: string) => void;
  onUpdateFriend?: (id: string, updates: Partial<Friend>) => void;
  onAddReservedGroup: (count: number, note?: string) => void;
  onUpdateReservedGroup: (groupId: string, count: number, note?: string) => void;
  onRemoveReservedGroup: (groupId: string) => void;
  onReorderFriends: (orderedIds: string[]) => void;
  getTierCapacity: (tier: TierType) => {
    available: number;
    used: number;
    limit: number;
    reservedGroups: ReservedGroup[];
  };
  isLoggedIn?: boolean;
  onAddLinkedFriend?: (
    targetUserId: string,
    circleTier: CircleTier,
    matchedContactMethodId: string | null,
    discloseCircle: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  getAllowedMoves: (fromTier: TierType) => TierType[];
  // Parasocial feed props
  parasocialShares?: ParasocialShare[];
  parasocialSeenShares?: Set<string>;
  onParasocialEngage?: (shareId: string) => void;
  userId?: string;
  // Keys shared props (naybor tier only)
  keysSharedPreferences?: HomeEntryPreferences;
  onSaveKeysShared?: (preferences: HomeEntryPreferences) => void;
}

export function TierSection({
  tier,
  friends,
  reservedGroups,
  onAddFriend,
  onMoveFriend,
  onRemoveFriend,
  onUpdateFriend,
  onAddReservedGroup,
  onUpdateReservedGroup,
  onRemoveReservedGroup,
  onReorderFriends,
  getTierCapacity,
  isLoggedIn,
  onAddLinkedFriend,
  getAllowedMoves,
  parasocialShares,
  parasocialSeenShares,
  onParasocialEngage,
  userId,
  keysSharedPreferences,
  onSaveKeysShared,
}: TierSectionProps) {
  const { t } = useTranslation();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [linkedDialogOpen, setLinkedDialogOpen] = useState(false);
  const [reservedDialogOpen, setReservedDialogOpen] = useState(false);
  const [roleModelDialogOpen, setRoleModelDialogOpen] = useState(false);
  const [followCreatorDialogOpen, setFollowCreatorDialogOpen] = useState(false);
  const [keysSharedDialogOpen, setKeysSharedDialogOpen] = useState(false);

  // Only core, inner, outer can have linked friends (not naybor, parasocial, rolemodel, or acquainted)
  const canHaveLinkedFriends =
    tier !== 'naybor' && tier !== 'parasocial' && tier !== 'rolemodel' && tier !== 'acquainted';

  // Acquainted tier cannot have direct adds, role models has special add
  const canAddDirectly = tier !== 'acquainted' && tier !== 'rolemodel';

  // Role models tier has special behavior
  const isRoleModelTier = tier === 'rolemodel';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const tierInfo = TIER_INFO[tier];
  const capacity = getTierCapacity(tier);
  const progressPercent = (capacity.used / capacity.limit) * 100;
  const reservedTotal = reservedGroups.reduce((sum, g) => sum + g.count, 0);

  const tierOrder: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
  const currentIndex = tierOrder.indexOf(tier);

  const canMoveUp = (friendTier: TierType) => {
    const allowed = getAllowedMoves(friendTier);
    const tierIdx = tierOrder.indexOf(friendTier);
    // "Up" means closer to core (lower index)
    const upTier = allowed.find((t) => tierOrder.indexOf(t) < tierIdx);
    if (!upTier) return false;
    return getTierCapacity(upTier).available > 0;
  };

  const canMoveDown = (friendTier: TierType) => {
    const allowed = getAllowedMoves(friendTier);
    const tierIdx = tierOrder.indexOf(friendTier);
    // "Down" means further from core (higher index)
    const downTier = allowed.find((t) => tierOrder.indexOf(t) > tierIdx);
    if (!downTier) return false;
    return getTierCapacity(downTier).available > 0;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = friends.findIndex((f) => f.id === active.id);
      const newIndex = friends.findIndex((f) => f.id === over.id);
      const reordered = arrayMove(friends, oldIndex, newIndex);
      onReorderFriends(reordered.map((f) => f.id));
    }
  };

  const bgColors: Record<TierType, string> = {
    core: 'bg-tier-core/5',
    inner: 'bg-tier-inner/5',
    outer: 'bg-tier-outer/5',
    naybor: 'bg-tier-naybor/5',
    parasocial: 'bg-tier-parasocial/5',
    rolemodel: 'bg-tier-rolemodel/5',
    acquainted: 'bg-tier-acquainted/5',
  };

  const borderColors: Record<TierType, string> = {
    core: 'border-tier-core/20',
    inner: 'border-tier-inner/20',
    outer: 'border-tier-outer/20',
    naybor: 'border-tier-naybor/20',
    parasocial: 'border-tier-parasocial/20',
    rolemodel: 'border-tier-rolemodel/20',
    acquainted: 'border-tier-acquainted/20',
  };

  const progressColors: Record<TierType, string> = {
    core: '[&>div]:bg-tier-core',
    inner: '[&>div]:bg-tier-inner',
    outer: '[&>div]:bg-tier-outer',
    naybor: '[&>div]:bg-tier-naybor',
    parasocial: '[&>div]:bg-tier-parasocial',
    rolemodel: '[&>div]:bg-tier-rolemodel',
    acquainted: '[&>div]:bg-tier-acquainted',
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
            <h3 className="font-display text-xl font-semibold text-foreground">{tierInfo.name}</h3>
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
            disabled={capacity.available <= 0}
            className="gap-1"
          >
            <Lock className="w-4 h-4" />
            {reservedTotal > 0 ? t('tierSection.reservedCount', { count: reservedTotal }) : t('tierSection.reserve')}
          </Button>
          {isLoggedIn && canHaveLinkedFriends && onAddLinkedFriend && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLinkedDialogOpen(true)}
              disabled={capacity.available <= 0}
              className="gap-1"
            >
              <Link2 className="w-4 h-4" />
              {t('tierSection.link')}
            </Button>
          )}
          {tier === 'naybor' && isLoggedIn && userId && onSaveKeysShared && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKeysSharedDialogOpen(true)}
              className="gap-1"
            >
              <Key className="w-4 h-4" />
              {keysSharedPreferences?.keyHolders.length
                ? t('tierSection.keysSharedCount', { count: keysSharedPreferences.keyHolders.length })
                : t('tierSection.keysShared')}
            </Button>
          )}
          {tier === 'parasocial' && isLoggedIn && userId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFollowCreatorDialogOpen(true)}
              className="gap-1"
            >
              <UserPlus className="w-4 h-4" />
              {t('tierSection.followCreator')}
            </Button>
          )}
          {isRoleModelTier && (
            <Button
              size="sm"
              onClick={() => setRoleModelDialogOpen(true)}
              disabled={capacity.available <= 0}
              className="gap-1"
            >
              <Star className="w-4 h-4" />
              {t('tierSection.addRoleModel')}
            </Button>
          )}
          {canAddDirectly && (
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              disabled={capacity.available <= 0}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              {t('tierSection.add')}
            </Button>
          )}
        </div>
      </div>

      <Progress value={progressPercent} className={`h-2 mb-4 ${progressColors[tier]}`} />

      {/* Naybor SOS Banner - shows when naybors exist */}
      {tier === 'naybor' && friends.length > 0 && (
        <NayborSOSBanner naybors={friends} />
      )}

      {/* Naybor under-minimum warning with Mr. Rogers video */}
      {tier === 'naybor' && tierInfo.recommendedMin && friends.length < tierInfo.recommendedMin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium mb-2">
                {t('naybor.underMinWarning', { count: friends.length })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('naybor.underMinDescription')}
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                {t('naybor.mrRogersQuote')}
              </p>
            </div>
            <div className="w-full lg:w-80 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
              <iframe
                src="https://www.youtube.com/embed/AQS3JGqx46U"
                title="Mr. Rogers - Won't You Be My Naybor?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {friends.length === 0 && reservedGroups.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {tier === 'parasocial'
              ? t('emptyState.noParasoicalsYet')
              : tier === 'acquainted'
              ? t('emptyState.noAcquaintedYet')
              : tier === 'rolemodel'
              ? t('emptyState.noRoleModelsYet')
              : tier === 'naybor'
              ? t('emptyState.noNayborsYet')
              : t(`emptyState.noFriendsYet.${tier}`, { defaultValue: `No ${tierInfo.name.toLowerCase()} friends yet` })}
          </p>
          <p className="text-xs mt-1">
            {tier === 'parasocial'
              ? t('emptyState.addParasocialsHint')
              : tier === 'acquainted'
              ? t('emptyState.acquaintedHint')
              : tier === 'rolemodel'
              ? t('emptyState.roleModelsHint')
              : tier === 'naybor'
              ? t('emptyState.nayborsHint')
              : t('emptyState.addToCircleHint')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={friends.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence mode="popLayout">
                {friends.map((friend, index) =>
                  isRoleModelTier ? (
                    <RoleModelCard
                      key={friend.id}
                      friend={friend}
                      rank={index + 1}
                      onRemove={onRemoveFriend}
                      onUpdateReason={
                        onUpdateFriend ? (id, reason) => onUpdateFriend(id, { roleModelReason: reason }) : undefined
                      }
                    />
                  ) : (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onMove={onMoveFriend}
                      onRemove={onRemoveFriend}
                      onUpdate={onUpdateFriend}
                      canMoveUp={canMoveUp(tier)}
                      canMoveDown={canMoveDown(tier)}
                      getAllowedMoves={getAllowedMoves}
                      getTierCapacity={getTierCapacity}
                    />
                  ),
                )}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          {reservedGroups.map((group) => {
            const otherGroupsTotal = reservedGroups
              .filter((g) => g.id !== group.id)
              .reduce((sum, g) => sum + g.count, 0);
            return (
              <ReservedGroupCard
                key={group.id}
                group={group}
                tier={tier}
                friendCount={friends.length}
                tierLimit={TIER_LIMITS[tier]}
                otherGroupsTotal={otherGroupsTotal}
                onUpdate={onUpdateReservedGroup}
                onRemove={onRemoveReservedGroup}
              />
            );
          })}
        </div>
      )}

      {/* Show parasocial feed in the parasocial tier */}
      {tier === 'parasocial' && parasocialShares && parasocialSeenShares && onParasocialEngage && (
        <ParasocialFeed
          shares={parasocialShares}
          seenShares={parasocialSeenShares}
          onEngage={onParasocialEngage}
        />
      )}

      <AddFriendDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        tier={tier}
        onAdd={onAddFriend}
        capacity={capacity}
      />

      {isRoleModelTier && (
        <AddRoleModelDialog
          open={roleModelDialogOpen}
          onOpenChange={setRoleModelDialogOpen}
          onAdd={(name, reason) => onAddFriend(name, undefined, reason)}
          capacity={capacity}
        />
      )}

      {canHaveLinkedFriends && onAddLinkedFriend && (
        <AddLinkedFriendDialog
          open={linkedDialogOpen}
          onOpenChange={setLinkedDialogOpen}
          tier={tier as CircleTier}
          onAddConnection={onAddLinkedFriend}
        />
      )}

      <ReservedSpotsDialog
        open={reservedDialogOpen}
        onOpenChange={setReservedDialogOpen}
        tier={tier}
        friendCount={friends.length}
        currentReservedTotal={reservedTotal}
        onSave={onAddReservedGroup}
      />

      {tier === 'parasocial' && userId && (
        <FollowCreatorDialog
          open={followCreatorDialogOpen}
          onOpenChange={setFollowCreatorDialogOpen}
          userId={userId}
        />
      )}

      {tier === 'naybor' && userId && onSaveKeysShared && (
        <KeysSharedDialog
          open={keysSharedDialogOpen}
          onOpenChange={setKeysSharedDialogOpen}
          naybors={friends}
          userId={userId}
          preferences={keysSharedPreferences}
          onSave={onSaveKeysShared}
        />
      )}
    </motion.section>
  );
}

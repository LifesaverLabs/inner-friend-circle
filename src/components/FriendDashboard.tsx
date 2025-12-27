import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Share2, Heart, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { TierSection } from '@/components/TierSection';
import { AppHeader } from '@/components/AppHeader';
import { ShareDialog } from '@/components/ShareDialog';
import { TendingDialog } from '@/components/TendingDialog';
import { ProfileSettingsDialog } from '@/components/ProfileSettingsDialog';
import { ContactSetupOnboarding, useContactSetupNeeded } from '@/components/ContactSetupOnboarding';
import { MissionBanner } from '@/components/MissionBanner';
import { ConnectionRequestsPanel } from '@/components/ConnectionRequestsPanel';
import { Footer } from '@/components/Footer';
import { FeedTabs } from '@/components/feed';
import {
  DataLiberationBanner,
  DataExportDialog,
  DataImportDialog,
} from '@/components/dataLiberation';
import { ContactImportDialog } from '@/components/contactImport';
import { useFriendLists } from '@/hooks/useFriendLists';
import { useAuth } from '@/hooks/useAuth';
import { useFriendConnections, CircleTier } from '@/hooks/useFriendConnections';
import { useParasocial } from '@/hooks/useParasocial';
import { useKeysShared } from '@/hooks/useKeysShared';
import { TierType } from '@/types/friend';
import { ExportableSocialGraph } from '@/types/feed';
import { convertImportedFriends } from '@/lib/dataPortability';

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
  const { t } = useTranslation();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [tendingDialogOpen, setTendingDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [contactImportDialogOpen, setContactImportDialogOpen] = useState(false);

  const { user } = useAuth();
  const { needsSetup, setNeedsSetup } = useContactSetupNeeded(user?.id);
  
  const {
    pendingRequests,
    createConnectionRequest,
    respondToRequest,
  } = useFriendConnections(user?.id);

  const {
    feedShares,
    seenShares,
    recordEngagement,
  } = useParasocial(user?.id);

  const {
    preferences: keysSharedPreferences,
    savePreferences: saveKeysShared,
  } = useKeysShared(user?.id);

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

  const handleAddFriend = (tier: TierType) => async (name: string, email?: string, phone?: string, preferredContact?: string) => {
    // Add to local friend list
    const result = addFriend({ name, email, phone, tier, preferredContact: preferredContact as any });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    
    toast.success(t('dashboard.toasts.addedFriend', { name, tier: t(`tiers.${tier}`) }));
    
    // Only create connection request for core/inner/outer tiers with email/phone
    const connectionTiers: TierType[] = ['core', 'inner', 'outer'];
    if (!connectionTiers.includes(tier) || (!email && !phone)) {
      return;
    }
    
    if (!user?.id) return;
    
    // Try to find the user by their email or phone in contact_methods
    let foundUser = false;
    
    // Look up by email first
    if (email) {
      const { data: contactDataArray } = await supabase
        .from('contact_methods')
        .select('id, user_id')
        .ilike('contact_identifier', email)
        .neq('user_id', user.id)
        .limit(1);
      
      const contactData = contactDataArray?.[0];
      
      if (contactData) {
        // Found a user with this email - create connection request
        const connectionResult = await createConnectionRequest(
          contactData.user_id,
          tier as CircleTier,
          contactData.id,
          true // disclose circle
        );
        
        if (connectionResult.success) {
          toast.success(t('connections.toasts.requestSentTo', { name }));
        }
        foundUser = true;
      }
    }
    
    // Try phone lookup if email didn't find anyone
    if (!foundUser && phone) {
      const { data: phoneDataArray } = await supabase
        .from('contact_methods')
        .select('id, user_id')
        .eq('contact_identifier', phone)
        .neq('user_id', user.id)
        .limit(1);
      
      const phoneData = phoneDataArray?.[0];
      
      if (phoneData) {
        const connectionResult = await createConnectionRequest(
          phoneData.user_id,
          tier as CircleTier,
          phoneData.id,
          true
        );
        
        if (connectionResult.success) {
          toast.success(t('connections.toasts.requestSentTo', { name }));
        }
        foundUser = true;
      }
    }
    
    // User not found - create pending invitation and send email
    if (!foundUser && (email || phone)) {
      // Get inviter's display name for the email
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      
      const inviterName = profile?.display_name || 'Someone';
      
      // Create pending invitation record
      const { error: insertError } = await supabase
        .from('pending_invitations')
        .insert({
          inviter_id: user.id,
          invitee_email: email || null,
          invitee_phone: phone || null,
          circle_tier: tier as CircleTier,
          friend_name: name,
        });
      
      if (insertError) {
        console.error('Error creating pending invitation:', insertError);
      }
      
      // Check if there's a reverse invitation (they already invited us)
      // Look for pending_invitations where the invitee matches our current user's contact methods
      const { data: ourContacts } = await supabase
        .from('contact_methods')
        .select('contact_identifier, user_id')
        .eq('user_id', user.id);
      
      const ourContactIds = new Set((ourContacts || []).map(c => c.contact_identifier.toLowerCase()));
      
      // Find any pending invitations directed at our contact methods
      const { data: reverseInvitations } = await supabase
        .from('pending_invitations')
        .select('*')
        .is('matched_at', null)
        .neq('inviter_id', user.id);
      
      // Check if any reverse invitation matches
      for (const invite of reverseInvitations || []) {
        const inviteContactLower = (invite.invitee_email || invite.invitee_phone || '').toLowerCase();
        
        // Does this invitation target one of our contact methods?
        if (ourContactIds.has(inviteContactLower)) {
          // Now check if the inviter has a contact method matching what we just tried to add
          const { data: theirContacts } = await supabase
            .from('contact_methods')
            .select('id, user_id, contact_identifier')
            .eq('user_id', invite.inviter_id);
          
          const theirContactMatch = (theirContacts || []).find(c => {
            const cLower = c.contact_identifier.toLowerCase();
            return (email && cLower === email.toLowerCase()) || (phone && cLower === phone);
          });
          
          if (theirContactMatch) {
            // Perfect match! Create friend_connections in both directions
            const { error: conn1Error } = await supabase
              .from('friend_connections')
              .insert({
                requester_id: invite.inviter_id,
                target_user_id: user.id,
                circle_tier: invite.circle_tier,
                matched_contact_method_id: theirContactMatch.id,
                status: 'pending',
                disclose_circle: true
              });
            
            const { error: conn2Error } = await supabase
              .from('friend_connections')
              .insert({
                requester_id: user.id,
                target_user_id: invite.inviter_id,
                circle_tier: tier as CircleTier,
                matched_contact_method_id: theirContactMatch.id,
                status: 'pending',
                disclose_circle: true
              });
            
            if (!conn1Error && !conn2Error) {
              // Mark both invitations as matched
              await supabase
                .from('pending_invitations')
                .update({ matched_at: new Date().toISOString(), matched_user_id: user.id })
                .eq('id', invite.id);
              
              await supabase
                .from('pending_invitations')
                .update({ matched_at: new Date().toISOString(), matched_user_id: invite.inviter_id })
                .eq('inviter_id', user.id)
                .is('matched_at', null);
              
              toast.success(t('connections.toasts.autoMatched'));
              return;
            }
          }
        }
      }
      
      // No auto-match found, send invitation email if we have an email
      if (email) {
        try {
          const { error: invokeError } = await supabase.functions.invoke('send-friend-invite', {
            body: {
              invitee_email: email,
              invitee_name: name,
              inviter_name: inviterName,
              circle_tier: tier,
            },
          });
          
          if (invokeError) {
            console.error('Error sending invitation email:', invokeError);
            toast.info(t('connections.toasts.invitationSaved'));
          } else {
            toast.success(t('connections.toasts.invitationSent', { name }));
          }
        } catch (err) {
          console.error('Error invoking send-friend-invite:', err);
          toast.info(t('connections.toasts.invitationSaved'));
        }
      } else {
        // Phone only - just save the pending invitation
        toast.info(t('connections.toasts.invitationSaved'));
      }
    }
  };

  const handleAddRoleModel = (name: string, roleModelReason?: string) => {
    const result = addFriend({ name, tier: 'rolemodel', roleModelReason });
    if (result.success) {
      toast.success(t('dashboard.toasts.addedFriend', { name, tier: t('tiers.rolemodel') }));
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
      toast.success(t('dashboard.toasts.movedFriend', { name: friend.name, tier: t(`tiers.${newTier}`) }));
    } else {
      toast.error(result.error || t('dashboard.toasts.moveError'));
    }
  };

  const handleRemoveFriend = (id: string) => {
    const friend = lists.friends.find(f => f.id === id);
    removeFriend(id);
    if (friend) {
      toast.success(t('dashboard.toasts.removedFriend', { name: friend.name }));
    }
  };

  const handleAddReservedGroup = (tier: TierType) => (count: number, note?: string) => {
    const result = addReservedGroup(tier, count, note);
    if (result.success) {
      toast.success(t('dashboard.toasts.addedReserved', { tier: t(`tiers.${tier}`) }));
    } else {
      toast.error(result.error || t('dashboard.toasts.reservedError'));
    }
  };

  const handleUpdateReservedGroup = (tier: TierType) => (groupId: string, count: number, note?: string) => {
    updateReservedGroup(tier, groupId, count, note);
    toast.success(t('dashboard.toasts.updatedReserved'));
  };

  const handleRemoveReservedGroup = (tier: TierType) => (groupId: string) => {
    removeReservedGroup(tier, groupId);
    toast.success(t('dashboard.toasts.removedReserved'));
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

  const tiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];

  // Define allowed move transitions
  // acquainted can promote to any "real friend" tier (core, inner, outer, naybor, rolemodel)
  // rolemodel, parasocial, and naybor are standalone - no moves allowed once placed
  // naybor: neighbors stay neighbors
  // parasocial: one-sided relationships can't convert to mutual; re-enter manually if they become real friends
  const getAllowedMoves = useCallback((fromTier: TierType): TierType[] => {
    switch (fromTier) {
      case 'core': return ['inner'];
      case 'inner': return ['core', 'outer'];
      case 'outer': return ['inner', 'acquainted'];
      case 'naybor': return []; // Naybors stay as naybors
      case 'parasocial': return []; // Parasocials are one-sided; can't convert to mutual relationships
      case 'rolemodel': return []; // Role models don't move between tiers
      case 'acquainted': return ['core', 'inner', 'outer', 'naybor', 'rolemodel']; // Easy promotion path from bulk import
      default: return [];
    }
  }, []);

  // Data Liberation handlers
  const handleDataImport = useCallback(
    (data: ExportableSocialGraph, options: { mergeStrategy: string }) => {
      const importedFriends = convertImportedFriends(data.friends);

      let addedCount = 0;
      let skippedCount = 0;

      importedFriends.forEach((friend) => {
        // Check if friend already exists (by name or email)
        const existingFriend = lists.friends.find(
          (f) => f.name === friend.name || (friend.email && f.email === friend.email)
        );

        if (existingFriend) {
          if (options.mergeStrategy === 'overwrite') {
            updateFriend(existingFriend.id, friend);
            addedCount++;
          } else if (options.mergeStrategy === 'keep_both') {
            addFriend(friend);
            addedCount++;
          } else {
            skippedCount++;
          }
        } else {
          addFriend(friend);
          addedCount++;
        }
      });

      if (addedCount > 0) {
        toast.success(t('dashboard.toasts.imported', { count: addedCount }));
      }
      if (skippedCount > 0) {
        toast.info(t('dashboard.toasts.skippedDuplicates', { count: skippedCount }));
      }
    },
    [lists.friends, addFriend, updateFriend]
  );

  // Handler for adding friend from contact import
  const handleContactImportAddFriend = useCallback(
    (friendData: Omit<import('@/types/friend').Friend, 'id' | 'addedAt'>) => {
      return addFriend(friendData);
    },
    [addFriend]
  );

  // Handler for import complete
  const handleContactImportComplete = useCallback((count: number) => {
    toast.success(t('contactImport.success.description', { count }));
  }, [t]);

  // Render prop for manage tab content - must be before early return to maintain hook order
  const renderManageContent = useCallback(() => (
    <div className="space-y-6">
      {/* Import Contacts Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setContactImportDialogOpen(true)}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {t('contactImport.title')}
        </Button>
      </div>

      {tiers.map(tier => (
        <TierSection
          key={tier}
          tier={tier}
          friends={getFriendsInTier(tier)}
          reservedGroups={lists.reservedSpots[tier] || []}
          onAddFriend={handleAddFriend(tier)}
          onAddRoleModel={tier === 'rolemodel' ? handleAddRoleModel : undefined}
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
          parasocialShares={tier === 'parasocial' ? feedShares : undefined}
          parasocialSeenShares={tier === 'parasocial' ? seenShares : undefined}
          onParasocialEngage={tier === 'parasocial' ? recordEngagement : undefined}
          userId={user?.id}
          keysSharedPreferences={tier === 'naybor' ? keysSharedPreferences : undefined}
          onSaveKeysShared={tier === 'naybor' ? saveKeysShared : undefined}
        />
      ))}
    </div>
  ), [
    getFriendsInTier, lists.reservedSpots, handleAddFriend, handleAddRoleModel, handleMoveFriend,
    handleRemoveFriend, handleAddReservedGroup, handleUpdateReservedGroup,
    handleRemoveReservedGroup, handleReorderFriends, getTierCapacity, isLoggedIn,
    handleAddLinkedFriend, updateFriend, getAllowedMoves, feedShares, seenShares,
    recordEngagement, user?.id, t, keysSharedPreferences, saveKeysShared
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-muted-foreground"
        >
          {t('dashboard.loading')}
        </motion.div>
      </div>
    );
  }

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
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('dashboard.subtitle')}
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
                <span>{t('dashboard.tend')}</span>
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
              {t('dashboard.share')}
            </Button>
          </div>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground mt-4 bg-muted/50 rounded-lg px-4 py-2 inline-block">
              {t('dashboard.localStorageHint')}
            </p>
          )}
        </motion.div>

        <FeedTabs
          friends={lists.friends}
          isLoggedIn={isLoggedIn}
          userId={user?.id}
          renderManageContent={renderManageContent}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground/70 italic max-w-2xl mx-auto">
            {t('dashboard.dunbarDisclaimer')}
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

        {/* Data Liberation Dialogs */}
        <DataExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          userId={user?.id || 'anonymous'}
          friends={lists.friends}
          posts={[]} // Feed posts would come from useFeed if needed
        />

        <DataImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleDataImport}
          existingFriendCount={lists.friends.length}
        />

        {/* Contact Import Dialog */}
        <ContactImportDialog
          open={contactImportDialogOpen}
          onOpenChange={setContactImportDialogOpen}
          existingFriends={lists.friends}
          onAddFriend={handleContactImportAddFriend}
          onImportComplete={handleContactImportComplete}
        />
      </main>

      {/* Data Liberation Banner - shows at bottom */}
      <DataLiberationBanner
        onExportClick={() => setExportDialogOpen(true)}
        onLearnMore={() => {
          // Could navigate to a data portability info page
          toast.info(t('dashboard.toasts.dataLiberation'));
        }}
      />

      <Footer />
    </div>
  );
}

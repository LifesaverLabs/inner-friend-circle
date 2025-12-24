import { useState, useEffect, useCallback, useRef } from 'react';
import { Friend, FriendLists, ReservedSpots, ReservedGroup, TierType, TIER_LIMITS } from '@/types/friend';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'inner-friend-lists';
const LAST_TENDED_KEY = 'inner-last-tended';

const defaultReservedSpots: ReservedSpots = {
  core: [],
  inner: [],
  outer: [],
  parasocial: [],
  rolemodel: [],
  acquainted: [],
};

const defaultLists: FriendLists = {
  friends: [],
  reservedSpots: defaultReservedSpots,
};

// Helper to convert friends from JSON (dates as strings) to proper Friend objects
function parseFriends(friends: any[]): Friend[] {
  return friends.map((f: any) => ({
    ...f,
    addedAt: new Date(f.addedAt),
  }));
}

// Helper to migrate old localStorage format to new format
function migrateReservedSpots(oldReserved: any): ReservedSpots {
  const migrated: ReservedSpots = { ...defaultReservedSpots };
  
  for (const tier of Object.keys(defaultReservedSpots) as TierType[]) {
    if (Array.isArray(oldReserved[tier])) {
      migrated[tier] = oldReserved[tier];
    } else if (typeof oldReserved[tier] === 'number' && oldReserved[tier] > 0) {
      migrated[tier] = [{
        id: crypto.randomUUID(),
        count: oldReserved[tier],
        note: oldReserved.notes?.[tier],
      }];
    }
  }
  
  return migrated;
}

export function useFriendLists() {
  const { user } = useAuth();
  const [lists, setLists] = useState<FriendLists>(defaultLists);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastTendedAt, setLastTendedAt] = useState<Date | null>(null);
  const isSyncing = useRef(false);
  const hasInitialLoad = useRef(false);
  const isFromRealtime = useRef(false);

  // Load data - from Supabase if authenticated, localStorage otherwise
  useEffect(() => {
    // Reset both flags when user changes to block saves during load
    hasInitialLoad.current = false;
    setIsLoaded(false);
    
    const loadData = async () => {
      console.log('[FriendLists] Loading data, user:', user?.id);
      
      if (user) {
        // Load from Supabase
        try {
          const { data, error } = await supabase
            .from('friend_lists')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          console.log('[FriendLists] Database load result:', { data: data ? 'exists' : 'null', friendsCount: (data?.friends as any[])?.length, error });

          if (error) {
            console.error('[FriendLists] Failed to load from database:', error);
            return;
          }

          const dbFriends = parseFriends((data?.friends as any[]) || []);
          const dbReservedSpots = migrateReservedSpots(data?.reserved_spots || {});
          
          // Check if localStorage has data that should be migrated
          const stored = localStorage.getItem(STORAGE_KEY);
          let localFriends: Friend[] = [];
          let localReservedSpots: ReservedSpots = defaultReservedSpots;
          let localLastTended: Date | null = null;
          
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              localFriends = parseFriends(parsed.friends || []);
              localReservedSpots = migrateReservedSpots(parsed.reservedSpots || {});
              const storedTended = localStorage.getItem(LAST_TENDED_KEY);
              if (storedTended) {
                localLastTended = new Date(storedTended);
              }
              console.log('[FriendLists] localStorage has data:', { friendsCount: localFriends.length });
            } catch (e) {
              console.error('[FriendLists] Failed to parse localStorage:', e);
            }
          }
          
          // Determine the best data source:
          // 1. If database record exists -> always use database (even if empty friends array)
          // 2. If localStorage has data and no database record -> migrate localStorage
          // 3. If both are empty -> use empty defaults
          const hasLocalData = localFriends.length > 0;
          const hasDbData = data !== null; // Check if record exists, not if it has friends
          const shouldMigrateLocalData = hasLocalData && !hasDbData;
          
          console.log('[FriendLists] Data sources:', { 
            hasLocalData, 
            hasDbData, 
            shouldMigrateLocalData,
            dbRecordExists: data !== null,
            dbFriendsCount: dbFriends.length 
          });
          
          // Always prefer database data if it exists
          const finalFriends = hasDbData ? dbFriends : localFriends;
          const finalReservedSpots = hasDbData ? dbReservedSpots : localReservedSpots;
          const finalLastTended = hasDbData 
            ? (data?.last_tended_at ? new Date(data.last_tended_at) : null) 
            : localLastTended;
          
          console.log('[FriendLists] Final data:', { friendsCount: finalFriends.length });
          
          setLists({ friends: finalFriends, reservedSpots: finalReservedSpots });
          if (finalLastTended) {
            setLastTendedAt(finalLastTended);
          }
          
          // Only write to database if:
          // 1. Migrating localStorage data to database (localStorage has data, db is empty)
          // 2. Creating initial empty record (no record exists AND no local data to migrate)
          if (shouldMigrateLocalData) {
            console.log('[FriendLists] Migrating localStorage data to database');
            const { error: upsertError } = await supabase
              .from('friend_lists')
              .upsert([{
                user_id: user.id,
                friends: localFriends as any,
                reserved_spots: localReservedSpots as any,
                last_tended_at: localLastTended?.toISOString() || null,
              }], {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error('[FriendLists] Failed to migrate to database:', upsertError);
            } else {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(LAST_TENDED_KEY);
              console.log('[FriendLists] Migration complete, cleared localStorage');
            }
          }
          // Don't auto-create empty records - they'll be created by save effect when user adds data
        } catch (e) {
          console.error('[FriendLists] Error loading from database:', e);
        }
      } else {
        // Load from localStorage when not authenticated
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const friends = parseFriends(parsed.friends || []);
            const reservedSpots = migrateReservedSpots(parsed.reservedSpots || {});
            setLists({ friends, reservedSpots });
            console.log('[FriendLists] Loaded from localStorage:', { friendsCount: friends.length });
          } catch (e) {
            console.error('[FriendLists] Failed to parse localStorage:', e);
          }
        }
        
        const storedTended = localStorage.getItem(LAST_TENDED_KEY);
        if (storedTended) {
          setLastTendedAt(new Date(storedTended));
        }
      }
      
      hasInitialLoad.current = true;
      setIsLoaded(true);
    };

    loadData();
  }, [user]);

  // Subscribe to realtime updates when authenticated
  useEffect(() => {
    if (!user) return;

    console.log('[FriendLists] Setting up realtime subscription for user:', user.id);
    
    const channel = supabase
      .channel('friend_lists_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friend_lists',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[FriendLists] Realtime update received:', payload);
          
          // Only update if this wasn't triggered by our own save
          if (!isSyncing.current) {
            const newData = payload.new as any;
            const friends = parseFriends(newData.friends || []);
            const reservedSpots = migrateReservedSpots(newData.reserved_spots || {});
            
            isFromRealtime.current = true;
            setLists({ friends, reservedSpots });
            if (newData.last_tended_at) {
              setLastTendedAt(new Date(newData.last_tended_at));
            }
            console.log('[FriendLists] Updated from realtime:', { friendsCount: friends.length });
          }
        }
      )
      .subscribe((status) => {
        console.log('[FriendLists] Realtime subscription status:', status);
      });

    return () => {
      console.log('[FriendLists] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Save data - to Supabase if authenticated, localStorage otherwise
  useEffect(() => {
    if (!isLoaded || !hasInitialLoad.current || isSyncing.current) return;
    
    // Skip save if this update came from realtime
    if (isFromRealtime.current) {
      isFromRealtime.current = false;
      return;
    }
    
    // CRITICAL: Only save to localStorage when logged OUT
    // Never save localStorage to database when logging back in
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
      if (lastTendedAt) {
        localStorage.setItem(LAST_TENDED_KEY, lastTendedAt.toISOString());
      }
      console.log('[FriendLists] Saved to localStorage');
      return;
    }

    const saveData = async () => {
      isSyncing.current = true;
      
      console.log('[FriendLists] Saving to database:', { friendsCount: lists.friends.length });
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('friend_lists')
          .upsert([{
            user_id: user.id,
            friends: lists.friends as any,
            reserved_spots: lists.reservedSpots as any,
            last_tended_at: lastTendedAt?.toISOString() || null,
          }], {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('[FriendLists] Failed to save to database:', error);
        } else {
          console.log('[FriendLists] Successfully saved to database');
        }
      } catch (e) {
        console.error('[FriendLists] Error saving to database:', e);
      }
      
      isSyncing.current = false;
    };

    saveData();
  }, [lists, lastTendedAt, isLoaded, user]);

  const getFriendsInTier = useCallback((tier: TierType) => {
    const tierFriends = lists.friends.filter(f => f.tier === tier);
    
    return tierFriends.sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      if (a.sortOrder !== undefined) return -1;
      if (b.sortOrder !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [lists.friends]);

  const reorderFriendsInTier = useCallback((tier: TierType, orderedIds: string[]) => {
    setLists(prev => ({
      ...prev,
      friends: prev.friends.map(f => {
        if (f.tier !== tier) return f;
        const newOrder = orderedIds.indexOf(f.id);
        return { ...f, sortOrder: newOrder >= 0 ? newOrder : undefined };
      }),
    }));
  }, []);

  const getTierCapacity = useCallback((tier: TierType) => {
    const friendsInTier = getFriendsInTier(tier).length;
    const reservedGroups = lists.reservedSpots[tier] || [];
    const reservedTotal = reservedGroups.reduce((sum, g) => sum + g.count, 0);
    const limit = TIER_LIMITS[tier];
    return {
      used: friendsInTier + reservedTotal,
      friendCount: friendsInTier,
      reserved: reservedTotal,
      reservedGroups,
      limit,
      available: limit - friendsInTier - reservedTotal,
    };
  }, [getFriendsInTier, lists.reservedSpots]);

  const addFriend = useCallback((friend: Omit<Friend, 'id' | 'addedAt'>) => {
    const capacity = getTierCapacity(friend.tier);
    if (capacity.available <= 0) {
      return { success: false, error: 'Tier is full' };
    }

    const newFriend: Friend = {
      ...friend,
      id: crypto.randomUUID(),
      addedAt: new Date(),
    };

    setLists(prev => ({
      ...prev,
      friends: [...prev.friends, newFriend],
    }));

    return { success: true, friend: newFriend };
  }, [getTierCapacity]);

  const updateFriend = useCallback((id: string, updates: Partial<Friend>) => {
    setLists(prev => ({
      ...prev,
      friends: prev.friends.map(f => 
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  }, []);

  const removeFriend = useCallback((id: string) => {
    setLists(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== id),
    }));
  }, []);

  const moveFriend = useCallback((id: string, newTier: TierType) => {
    const capacity = getTierCapacity(newTier);
    if (capacity.available <= 0) {
      return { success: false, error: 'Target tier is full' };
    }

    setLists(prev => ({
      ...prev,
      friends: prev.friends.map(f => 
        f.id === id ? { ...f, tier: newTier } : f
      ),
    }));

    return { success: true };
  }, [getTierCapacity]);

  const addReservedGroup = useCallback((tier: TierType, count: number, note?: string) => {
    const friendsInTier = getFriendsInTier(tier).length;
    const currentReserved = (lists.reservedSpots[tier] || []).reduce((sum, g) => sum + g.count, 0);
    const maxNew = TIER_LIMITS[tier] - friendsInTier - currentReserved;
    const validCount = Math.max(1, Math.min(count, maxNew));

    if (validCount <= 0) return { success: false, error: 'No capacity for reserved spots' };

    const newGroup: ReservedGroup = {
      id: crypto.randomUUID(),
      count: validCount,
      note: note?.trim() || undefined,
    };

    setLists(prev => ({
      ...prev,
      reservedSpots: {
        ...prev.reservedSpots,
        [tier]: [...(prev.reservedSpots[tier] || []), newGroup],
      },
    }));

    return { success: true, group: newGroup };
  }, [getFriendsInTier, lists.reservedSpots]);

  const updateReservedGroup = useCallback((tier: TierType, groupId: string, count: number, note?: string) => {
    const friendsInTier = getFriendsInTier(tier).length;
    const groups = lists.reservedSpots[tier] || [];
    const otherGroupsTotal = groups.filter(g => g.id !== groupId).reduce((sum, g) => sum + g.count, 0);
    const maxForThisGroup = TIER_LIMITS[tier] - friendsInTier - otherGroupsTotal;
    const validCount = Math.max(0, Math.min(count, maxForThisGroup));

    setLists(prev => ({
      ...prev,
      reservedSpots: {
        ...prev.reservedSpots,
        [tier]: prev.reservedSpots[tier].map(g =>
          g.id === groupId ? { ...g, count: validCount, note: note?.trim() || undefined } : g
        ),
      },
    }));
  }, [getFriendsInTier, lists.reservedSpots]);

  const removeReservedGroup = useCallback((tier: TierType, groupId: string) => {
    setLists(prev => ({
      ...prev,
      reservedSpots: {
        ...prev.reservedSpots,
        [tier]: prev.reservedSpots[tier].filter(g => g.id !== groupId),
      },
    }));
  }, []);

  const clearAllData = useCallback(async () => {
    setLists(defaultLists);
    setLastTendedAt(null);
    
    if (user) {
      // Clear from database
      await supabase
        .from('friend_lists')
        .delete()
        .eq('user_id', user.id);
    }
    
    // Always clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_TENDED_KEY);
  }, [user]);

  const markTended = useCallback(() => {
    const now = new Date();
    setLastTendedAt(now);
  }, []);

  return {
    lists,
    isLoaded,
    lastTendedAt,
    getFriendsInTier,
    getTierCapacity,
    addFriend,
    updateFriend,
    removeFriend,
    moveFriend,
    reorderFriendsInTier,
    addReservedGroup,
    updateReservedGroup,
    removeReservedGroup,
    clearAllData,
    markTended,
  };
}

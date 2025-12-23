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

  // Load data - from Supabase if authenticated, localStorage otherwise
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // Load from Supabase
        try {
          const { data, error } = await supabase
            .from('friend_lists')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Failed to load friend lists from database:', error);
            return;
          }

          if (data) {
            // User has data in database
            const friends = parseFriends(data.friends as any[] || []);
            const reservedSpots = migrateReservedSpots(data.reserved_spots || {});
            setLists({ friends, reservedSpots });
            if (data.last_tended_at) {
              setLastTendedAt(new Date(data.last_tended_at));
            }
          } else {
            // No data in database - check if there's localStorage data to migrate
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                const friends = parseFriends(parsed.friends || []);
                const reservedSpots = migrateReservedSpots(parsed.reservedSpots || {});
                
                // Migrate localStorage data to database
                const { error: insertError } = await supabase
                  .from('friend_lists')
                  .insert([{
                    user_id: user.id,
                    friends: friends as any,
                    reserved_spots: reservedSpots as any,
                    last_tended_at: localStorage.getItem(LAST_TENDED_KEY) || null,
                  }]);

                if (insertError) {
                  console.error('Failed to migrate data to database:', insertError);
                } else {
                  // Clear localStorage after successful migration
                  localStorage.removeItem(STORAGE_KEY);
                  localStorage.removeItem(LAST_TENDED_KEY);
                }

                setLists({ friends, reservedSpots });
                const storedTended = localStorage.getItem(LAST_TENDED_KEY);
                if (storedTended) {
                  setLastTendedAt(new Date(storedTended));
                }
              } catch (e) {
                console.error('Failed to parse stored friend lists:', e);
              }
            } else {
              // No data anywhere - create empty record in database
              await supabase
                .from('friend_lists')
                .insert([{
                  user_id: user.id,
                  friends: [] as any,
                  reserved_spots: defaultReservedSpots as any,
                }]);
            }
          }
        } catch (e) {
          console.error('Error loading from database:', e);
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
          } catch (e) {
            console.error('Failed to parse stored friend lists:', e);
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

  // Save data - to Supabase if authenticated, localStorage otherwise
  useEffect(() => {
    if (!isLoaded || !hasInitialLoad.current || isSyncing.current) return;

    const saveData = async () => {
      isSyncing.current = true;
      
      if (user) {
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
            console.error('Failed to save friend lists to database:', error);
          }
        } catch (e) {
          console.error('Error saving to database:', e);
        }
      } else {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
        if (lastTendedAt) {
          localStorage.setItem(LAST_TENDED_KEY, lastTendedAt.toISOString());
        }
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

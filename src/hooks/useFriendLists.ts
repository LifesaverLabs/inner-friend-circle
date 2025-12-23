import { useState, useEffect, useCallback } from 'react';
import { Friend, FriendLists, ReservedSpots, ReservedGroup, TierType, TIER_LIMITS } from '@/types/friend';

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

export function useFriendLists() {
  const [lists, setLists] = useState<FriendLists>(defaultLists);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastTendedAt, setLastTendedAt] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.friends = parsed.friends.map((f: Friend) => ({
          ...f,
          addedAt: new Date(f.addedAt),
        }));
        // Migrate old data: ensure all tier keys exist in reservedSpots as arrays
        const migratedReserved: ReservedSpots = { ...defaultReservedSpots };
        const oldReserved = parsed.reservedSpots || {};
        
        // Handle migration from old format (numbers) to new format (arrays)
        for (const tier of Object.keys(defaultReservedSpots) as TierType[]) {
          if (Array.isArray(oldReserved[tier])) {
            migratedReserved[tier] = oldReserved[tier];
          } else if (typeof oldReserved[tier] === 'number' && oldReserved[tier] > 0) {
            // Migrate old single number format to array with one group
            migratedReserved[tier] = [{
              id: crypto.randomUUID(),
              count: oldReserved[tier],
              note: oldReserved.notes?.[tier],
            }];
          }
        }
        parsed.reservedSpots = migratedReserved;
        setLists(parsed);
      } catch (e) {
        console.error('Failed to parse stored friend lists:', e);
      }
    }
    
    // Load last tended date
    const storedTended = localStorage.getItem(LAST_TENDED_KEY);
    if (storedTended) {
      setLastTendedAt(new Date(storedTended));
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    }
  }, [lists, isLoaded]);

  const getFriendsInTier = useCallback((tier: TierType) => {
    const tierFriends = lists.friends.filter(f => f.tier === tier);
    
    // Sort: friends with sortOrder use that, otherwise alphabetically by name
    return tierFriends.sort((a, b) => {
      // Both have sortOrder: sort by sortOrder
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      // Only a has sortOrder: a comes first
      if (a.sortOrder !== undefined) return -1;
      // Only b has sortOrder: b comes first
      if (b.sortOrder !== undefined) return 1;
      // Neither has sortOrder: alphabetically
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

  const clearAllData = useCallback(() => {
    setLists(defaultLists);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_TENDED_KEY);
    setLastTendedAt(null);
  }, []);

  const markTended = useCallback(() => {
    const now = new Date();
    setLastTendedAt(now);
    localStorage.setItem(LAST_TENDED_KEY, now.toISOString());
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
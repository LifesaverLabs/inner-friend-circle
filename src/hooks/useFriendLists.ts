import { useState, useEffect, useCallback } from 'react';
import { Friend, FriendLists, ReservedSpots, TierType, TIER_LIMITS } from '@/types/friend';

const STORAGE_KEY = 'inner-friend-lists';

const defaultReservedSpots: ReservedSpots = {
  core: 0,
  inner: 0,
  outer: 0,
  parasocial: 0,
  notes: {},
};

const defaultLists: FriendLists = {
  friends: [],
  reservedSpots: defaultReservedSpots,
};

export function useFriendLists() {
  const [lists, setLists] = useState<FriendLists>(defaultLists);
  const [isLoaded, setIsLoaded] = useState(false);

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
        // Migrate old data: ensure all tier keys exist in reservedSpots
        parsed.reservedSpots = {
          ...defaultReservedSpots,
          ...parsed.reservedSpots,
          notes: {
            ...defaultReservedSpots.notes,
            ...(parsed.reservedSpots?.notes || {}),
          },
        };
        setLists(parsed);
      } catch (e) {
        console.error('Failed to parse stored friend lists:', e);
      }
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
    return lists.friends.filter(f => f.tier === tier);
  }, [lists.friends]);

  const getTierCapacity = useCallback((tier: TierType) => {
    const friendsInTier = getFriendsInTier(tier).length;
    const reserved = lists.reservedSpots[tier];
    const limit = TIER_LIMITS[tier];
    return {
      used: friendsInTier + reserved,
      friendCount: friendsInTier,
      reserved,
      limit,
      available: limit - friendsInTier - reserved,
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

  const setReservedSpots = useCallback((tier: TierType, count: number, note?: string) => {
    const friendsInTier = getFriendsInTier(tier).length;
    const maxReserved = TIER_LIMITS[tier] - friendsInTier;
    const validCount = Math.max(0, Math.min(count, maxReserved));

    setLists(prev => ({
      ...prev,
      reservedSpots: {
        ...prev.reservedSpots,
        [tier]: validCount,
        notes: {
          ...prev.reservedSpots.notes,
          [tier]: note,
        },
      },
    }));
  }, [getFriendsInTier]);

  const clearAllData = useCallback(() => {
    setLists(defaultLists);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    lists,
    isLoaded,
    getFriendsInTier,
    getTierCapacity,
    addFriend,
    updateFriend,
    removeFriend,
    moveFriend,
    setReservedSpots,
    clearAllData,
  };
}
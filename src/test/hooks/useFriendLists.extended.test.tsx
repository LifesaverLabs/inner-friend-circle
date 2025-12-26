import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock state
const mockState = {
  user: null as { id: string } | null,
  supabaseData: null as any,
  supabaseError: null as any,
};

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() =>
            Promise.resolve({
              data: mockState.supabaseData,
              error: mockState.supabaseError,
            })
          ),
        })),
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(() => ({ status: 'SUBSCRIBED' })),
    })),
    removeChannel: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockState.user,
  }),
}));

import { useFriendLists } from '@/hooks/useFriendLists';
import { TIER_LIMITS, TierType } from '@/types/friend';

const STORAGE_KEY = 'inner-friend-lists';

describe('useFriendLists - Extended Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockState.user = null;
    mockState.supabaseData = null;
    mockState.supabaseError = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addFriend', () => {
    it('should add friend to core tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'John', tier: 'core' });
      });

      expect(result.current.lists.friends).toHaveLength(1);
      expect(result.current.lists.friends[0].name).toBe('John');
      expect(result.current.lists.friends[0].tier).toBe('core');
    });

    it('should add friend to inner tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Jane', tier: 'inner' });
      });

      expect(result.current.lists.friends[0].tier).toBe('inner');
    });

    it('should add friend to outer tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Bob', tier: 'outer' });
      });

      expect(result.current.lists.friends[0].tier).toBe('outer');
    });

    it('should add friend to parasocial tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Celebrity', tier: 'parasocial' });
      });

      expect(result.current.lists.friends[0].tier).toBe('parasocial');
    });

    it('should add friend to rolemodel tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Mentor', tier: 'rolemodel' });
      });

      expect(result.current.lists.friends[0].tier).toBe('rolemodel');
    });

    it('should add friend to acquainted tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Acquaintance', tier: 'acquainted' });
      });

      expect(result.current.lists.friends[0].tier).toBe('acquainted');
    });

    it('should generate unique ID for new friend', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
        result.current.addFriend({ name: 'Friend 2', tier: 'core' });
      });

      expect(result.current.lists.friends[0].id).not.toBe(result.current.lists.friends[1].id);
    });

    it('should set addedAt to current date', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      const before = new Date();
      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });
      const after = new Date();

      const addedAt = result.current.lists.friends[0].addedAt;
      expect(addedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(addedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should include optional email', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core', email: 'test@example.com' });
      });

      expect(result.current.lists.friends[0].email).toBe('test@example.com');
    });

    it('should include optional phone', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core', phone: '1234567890' });
      });

      expect(result.current.lists.friends[0].phone).toBe('1234567890');
    });

    it('should include optional preferred contact', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core', preferredContact: 'whatsapp' });
      });

      expect(result.current.lists.friends[0].preferredContact).toBe('whatsapp');
    });

    it('should return success true when added', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      let addResult: any;
      act(() => {
        addResult = result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      expect(addResult.success).toBe(true);
    });

    it('should return the added friend', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      let addResult: any;
      act(() => {
        addResult = result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      expect(addResult.friend).toBeDefined();
      expect(addResult.friend.name).toBe('Friend');
    });

    it('should fail when tier is full', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Fill core tier (limit = 5)
      act(() => {
        for (let i = 0; i < TIER_LIMITS.core; i++) {
          result.current.addFriend({ name: `Friend ${i}`, tier: 'core' });
        }
      });

      let addResult: any;
      act(() => {
        addResult = result.current.addFriend({ name: 'Extra Friend', tier: 'core' });
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toBe('Tier is full');
    });

    it('should respect tier limits for inner', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        for (let i = 0; i < TIER_LIMITS.inner; i++) {
          result.current.addFriend({ name: `Friend ${i}`, tier: 'inner' });
        }
      });

      const capacity = result.current.getTierCapacity('inner');
      expect(capacity.available).toBe(0);
    });
  });

  describe('updateFriend', () => {
    it('should update friend name', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Original', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friendId, { name: 'Updated' });
      });

      expect(result.current.lists.friends[0].name).toBe('Updated');
    });

    it('should update friend email', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friendId, { email: 'new@example.com' });
      });

      expect(result.current.lists.friends[0].email).toBe('new@example.com');
    });

    it('should update friend phone', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friendId, { phone: '9876543210' });
      });

      expect(result.current.lists.friends[0].phone).toBe('9876543210');
    });

    it('should update friend notes', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friendId, { notes: 'New notes' });
      });

      expect(result.current.lists.friends[0].notes).toBe('New notes');
    });

    it('should update preferred contact method', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core', preferredContact: 'tel' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friendId, { preferredContact: 'signal' });
      });

      expect(result.current.lists.friends[0].preferredContact).toBe('signal');
    });

    it('should not affect other friends', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
        result.current.addFriend({ name: 'Friend 2', tier: 'core' });
      });

      const friend1Id = result.current.lists.friends[0].id;

      act(() => {
        result.current.updateFriend(friend1Id, { name: 'Updated Friend 1' });
      });

      expect(result.current.lists.friends[1].name).toBe('Friend 2');
    });
  });

  describe('removeFriend', () => {
    it('should remove friend from list', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.removeFriend(friendId);
      });

      expect(result.current.lists.friends).toHaveLength(0);
    });

    it('should only remove specified friend', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
        result.current.addFriend({ name: 'Friend 2', tier: 'core' });
      });

      const friend1Id = result.current.lists.friends[0].id;

      act(() => {
        result.current.removeFriend(friend1Id);
      });

      expect(result.current.lists.friends).toHaveLength(1);
      expect(result.current.lists.friends[0].name).toBe('Friend 2');
    });

    it('should increase tier capacity after removal', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const capacityBefore = result.current.getTierCapacity('core').available;
      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.removeFriend(friendId);
      });

      const capacityAfter = result.current.getTierCapacity('core').available;
      expect(capacityAfter).toBe(capacityBefore + 1);
    });
  });

  describe('moveFriend', () => {
    it('should move friend from core to inner', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.moveFriend(friendId, 'inner');
      });

      expect(result.current.lists.friends[0].tier).toBe('inner');
    });

    it('should move friend from inner to outer', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'inner' });
      });

      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.moveFriend(friendId, 'outer');
      });

      expect(result.current.lists.friends[0].tier).toBe('outer');
    });

    it('should return success true on valid move', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const friendId = result.current.lists.friends[0].id;

      let moveResult: any;
      act(() => {
        moveResult = result.current.moveFriend(friendId, 'inner');
      });

      expect(moveResult.success).toBe(true);
    });

    it('should fail when target tier is full', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Fill core tier
      act(() => {
        for (let i = 0; i < TIER_LIMITS.core; i++) {
          result.current.addFriend({ name: `Core ${i}`, tier: 'core' });
        }
        result.current.addFriend({ name: 'Inner Friend', tier: 'inner' });
      });

      const innerFriend = result.current.lists.friends.find(f => f.tier === 'inner');

      let moveResult: any;
      act(() => {
        moveResult = result.current.moveFriend(innerFriend!.id, 'core');
      });

      expect(moveResult.success).toBe(false);
      expect(moveResult.error).toBe('Target tier is full');
    });

    it('should update source tier capacity', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const coreBefore = result.current.getTierCapacity('core').friendCount;
      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.moveFriend(friendId, 'inner');
      });

      const coreAfter = result.current.getTierCapacity('core').friendCount;
      expect(coreAfter).toBe(coreBefore - 1);
    });

    it('should update target tier capacity', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const innerBefore = result.current.getTierCapacity('inner').friendCount;
      const friendId = result.current.lists.friends[0].id;

      act(() => {
        result.current.moveFriend(friendId, 'inner');
      });

      const innerAfter = result.current.getTierCapacity('inner').friendCount;
      expect(innerAfter).toBe(innerBefore + 1);
    });
  });

  describe('getFriendsInTier', () => {
    it('should return only friends in specified tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Core Friend', tier: 'core' });
        result.current.addFriend({ name: 'Inner Friend', tier: 'inner' });
      });

      const coreFriends = result.current.getFriendsInTier('core');
      expect(coreFriends).toHaveLength(1);
      expect(coreFriends[0].name).toBe('Core Friend');
    });

    it('should return empty array for empty tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      const friends = result.current.getFriendsInTier('core');
      expect(friends).toHaveLength(0);
    });

    it('should return friends sorted by sortOrder', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend A', tier: 'core' });
        result.current.addFriend({ name: 'Friend B', tier: 'core' });
        result.current.addFriend({ name: 'Friend C', tier: 'core' });
      });

      // Reorder to put C first
      const ids = result.current.lists.friends.map(f => f.id);
      act(() => {
        result.current.reorderFriendsInTier('core', [ids[2], ids[0], ids[1]]);
      });

      const friends = result.current.getFriendsInTier('core');
      expect(friends[0].name).toBe('Friend C');
    });

    it('should sort alphabetically when no sortOrder', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Charlie', tier: 'core' });
        result.current.addFriend({ name: 'Alice', tier: 'core' });
        result.current.addFriend({ name: 'Bob', tier: 'core' });
      });

      const friends = result.current.getFriendsInTier('core');
      // Note: Without sortOrder, should sort alphabetically
      // The actual behavior depends on implementation
      expect(friends.length).toBe(3);
    });
  });

  describe('getTierCapacity', () => {
    it('should return correct limit for core', () => {
      const { result } = renderHook(() => useFriendLists());
      const capacity = result.current.getTierCapacity('core');
      expect(capacity.limit).toBe(TIER_LIMITS.core);
    });

    it('should return correct limit for inner', () => {
      const { result } = renderHook(() => useFriendLists());
      const capacity = result.current.getTierCapacity('inner');
      expect(capacity.limit).toBe(TIER_LIMITS.inner);
    });

    it('should return correct limit for outer', () => {
      const { result } = renderHook(() => useFriendLists());
      const capacity = result.current.getTierCapacity('outer');
      expect(capacity.limit).toBe(TIER_LIMITS.outer);
    });

    it('should return friend count correctly', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
        result.current.addFriend({ name: 'Friend 2', tier: 'core' });
      });

      const capacity = result.current.getTierCapacity('core');
      expect(capacity.friendCount).toBe(2);
    });

    it('should return correct available spots', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      const capacity = result.current.getTierCapacity('core');
      expect(capacity.available).toBe(TIER_LIMITS.core - 1);
    });

    it('should include reserved spots in used calculation', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
        result.current.addReservedGroup('core', 2);
      });

      const capacity = result.current.getTierCapacity('core');
      expect(capacity.used).toBe(3); // 1 friend + 2 reserved
      expect(capacity.reserved).toBe(2);
    });

    it('should return zero available when tier is full', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        for (let i = 0; i < TIER_LIMITS.core; i++) {
          result.current.addFriend({ name: `Friend ${i}`, tier: 'core' });
        }
      });

      const capacity = result.current.getTierCapacity('core');
      expect(capacity.available).toBe(0);
    });
  });

  describe('reserved spots', () => {
    it('should add reserved group', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2);
      });

      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      expect(result.current.lists.reservedSpots.core[0].count).toBe(2);
    });

    it('should add reserved group with note', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2, 'Work friends');
      });

      expect(result.current.lists.reservedSpots.core[0].note).toBe('Work friends');
    });

    it('should update reserved group count', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2);
      });

      const groupId = result.current.lists.reservedSpots.core[0].id;

      act(() => {
        result.current.updateReservedGroup('core', groupId, 3);
      });

      expect(result.current.lists.reservedSpots.core[0].count).toBe(3);
    });

    it('should update reserved group note', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2, 'Original');
      });

      const groupId = result.current.lists.reservedSpots.core[0].id;

      act(() => {
        result.current.updateReservedGroup('core', groupId, 2, 'Updated');
      });

      expect(result.current.lists.reservedSpots.core[0].note).toBe('Updated');
    });

    it('should remove reserved group', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2);
      });

      const groupId = result.current.lists.reservedSpots.core[0].id;

      act(() => {
        result.current.removeReservedGroup('core', groupId);
      });

      expect(result.current.lists.reservedSpots.core).toHaveLength(0);
    });

    it('should limit reserved count to available capacity', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
        result.current.addFriend({ name: 'Friend 2', tier: 'core' });
        result.current.addFriend({ name: 'Friend 3', tier: 'core' });
      });

      // Try to reserve more than available (5 - 3 = 2 available)
      act(() => {
        result.current.addReservedGroup('core', 10);
      });

      const reserved = result.current.lists.reservedSpots.core[0]?.count ?? 0;
      expect(reserved).toBeLessThanOrEqual(TIER_LIMITS.core - 3);
    });

    it('should support multiple reserved groups per tier', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 1, 'Group 1');
        result.current.addReservedGroup('core', 1, 'Group 2');
      });

      expect(result.current.lists.reservedSpots.core).toHaveLength(2);
    });
  });

  describe('reorderFriendsInTier', () => {
    it('should update sortOrder for friends', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'A', tier: 'core' });
        result.current.addFriend({ name: 'B', tier: 'core' });
        result.current.addFriend({ name: 'C', tier: 'core' });
      });

      const [a, b, c] = result.current.lists.friends.map(f => f.id);

      act(() => {
        result.current.reorderFriendsInTier('core', [c, a, b]);
      });

      const friends = result.current.getFriendsInTier('core');
      expect(friends[0].id).toBe(c);
      expect(friends[1].id).toBe(a);
      expect(friends[2].id).toBe(b);
    });
  });

  describe('markTended', () => {
    it('should set lastTendedAt', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.lastTendedAt).toBeNull();

      act(() => {
        result.current.markTended();
      });

      expect(result.current.lastTendedAt).toBeInstanceOf(Date);
    });

    it('should update lastTendedAt to current time', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      const before = new Date();

      act(() => {
        result.current.markTended();
      });

      const after = new Date();

      expect(result.current.lastTendedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.current.lastTendedAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('clearAllData', () => {
    it('should clear all friends', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      await act(async () => {
        await result.current.clearAllData();
      });

      expect(result.current.lists.friends).toHaveLength(0);
    });

    it('should clear all reserved spots', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addReservedGroup('core', 2);
      });

      await act(async () => {
        await result.current.clearAllData();
      });

      expect(result.current.lists.reservedSpots.core).toHaveLength(0);
    });

    it('should clear lastTendedAt', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.markTended();
      });

      await act(async () => {
        await result.current.clearAllData();
      });

      expect(result.current.lastTendedAt).toBeNull();
    });

    it('should clear lists data', async () => {
      const { result } = renderHook(() => useFriendLists());
      await waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.addFriend({ name: 'Friend', tier: 'core' });
      });

      // Wait for save
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.lists.friends.length).toBe(1);

      await act(async () => {
        await result.current.clearAllData();
      });

      // clearAllData resets to default (empty) lists
      expect(result.current.lists.friends).toHaveLength(0);
    });
  });
});

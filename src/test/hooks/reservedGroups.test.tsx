import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock state that can be changed between tests
const mockState = {
  user: null as { id: string } | null,
  supabaseData: null as any,
  supabaseError: null as any,
  upsertCalls: [] as any[],
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
      upsert: vi.fn((data) => {
        mockState.upsertCalls.push(data);
        return Promise.resolve({ error: null });
      }),
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

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockState.user,
  }),
}));

// Import after mocks
import { useFriendLists } from '@/hooks/useFriendLists';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'inner-friend-lists';

// Test data for reserved groups
const testReservedSpots = {
  core: [
    { id: 'reserved-1', count: 2, note: 'Family spots' },
  ],
  inner: [
    { id: 'reserved-2', count: 3, note: 'Work colleagues' },
    { id: 'reserved-3', count: 1 },
  ],
  outer: [],
  parasocial: [
    { id: 'reserved-4', count: 5, note: 'Creators I follow' },
  ],
  rolemodel: [],
  acquainted: [],
};

const testFriendLists = {
  friends: [
    {
      id: 'friend-1',
      name: 'Test Friend',
      tier: 'core' as const,
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  reservedSpots: testReservedSpots,
};

describe('Reserved Groups Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockState.user = null;
    mockState.supabaseData = null;
    mockState.supabaseError = null;
    mockState.upsertCalls = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('localStorage persistence (not authenticated)', () => {
    it('should save reserved groups to localStorage', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add a reserved group
      act(() => {
        result.current.addReservedGroup('core', 2, 'Family spots');
      });

      // Wait for save effect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Check localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.reservedSpots).toBeDefined();
      expect(parsed.reservedSpots.core).toHaveLength(1);
      expect(parsed.reservedSpots.core[0].count).toBe(2);
      expect(parsed.reservedSpots.core[0].note).toBe('Family spots');
    });

    it('should load reserved groups from localStorage on page refresh', async () => {
      // Pre-populate localStorage with reserved groups
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testFriendLists));

      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Verify reserved groups are loaded
      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      expect(result.current.lists.reservedSpots.core[0].count).toBe(2);
      expect(result.current.lists.reservedSpots.core[0].note).toBe('Family spots');

      expect(result.current.lists.reservedSpots.inner).toHaveLength(2);
      expect(result.current.lists.reservedSpots.parasocial).toHaveLength(1);
    });

    it('should persist reserved groups across multiple updates', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add first reserved group
      act(() => {
        result.current.addReservedGroup('core', 2, 'Family');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Add second reserved group
      act(() => {
        result.current.addReservedGroup('inner', 3, 'Work');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Add third reserved group
      act(() => {
        result.current.addReservedGroup('parasocial', 5, 'Streamers');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify all groups are in localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots.core).toHaveLength(1);
      expect(parsed.reservedSpots.inner).toHaveLength(1);
      expect(parsed.reservedSpots.parasocial).toHaveLength(1);
    });

    it('should persist reserved group updates', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add a reserved group
      let addResult: any;
      act(() => {
        addResult = result.current.addReservedGroup('core', 2, 'Original note');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const groupId = addResult.group.id;

      // Update the reserved group
      act(() => {
        result.current.updateReservedGroup('core', groupId, 3, 'Updated note');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify update is persisted
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots.core[0].count).toBe(3);
      expect(parsed.reservedSpots.core[0].note).toBe('Updated note');
    });

    it('should persist reserved group removal', async () => {
      // Pre-populate with reserved groups
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testFriendLists));

      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      const groupId = result.current.lists.reservedSpots.core[0].id;

      // Remove the reserved group
      act(() => {
        result.current.removeReservedGroup('core', groupId);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify removal is persisted
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots.core).toHaveLength(0);
    });
  });

  describe('Supabase persistence (authenticated)', () => {
    it('should save reserved groups to Supabase', async () => {
      mockState.user = { id: 'user-123' };
      mockState.supabaseData = null; // No existing data

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Clear previous calls
      mockState.upsertCalls = [];

      // Add a reserved group
      act(() => {
        result.current.addReservedGroup('core', 2, 'Family spots');
      });

      // Wait for save effect
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Check upsert was called with reserved_spots
      expect(mockState.upsertCalls.length).toBeGreaterThan(0);
      const lastCall = mockState.upsertCalls[mockState.upsertCalls.length - 1];
      expect(lastCall[0].reserved_spots).toBeDefined();
      expect(lastCall[0].reserved_spots.core).toHaveLength(1);
      expect(lastCall[0].reserved_spots.core[0].count).toBe(2);
    });

    it('should load reserved groups from Supabase', async () => {
      mockState.user = { id: 'user-123' };
      mockState.supabaseData = {
        friends: testFriendLists.friends,
        reserved_spots: testFriendLists.reservedSpots,
        last_tended_at: null,
      };

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Verify reserved groups are loaded from database
      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      expect(result.current.lists.reservedSpots.core[0].count).toBe(2);
      expect(result.current.lists.reservedSpots.inner).toHaveLength(2);
      expect(result.current.lists.reservedSpots.parasocial).toHaveLength(1);
    });
  });

  describe('Logout/Login cycle preservation', () => {
    it('should NOT lose reserved groups during logout transition', async () => {
      // Pre-populate localStorage with reserved groups
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testFriendLists));

      // Start logged in with data in database
      mockState.user = { id: 'user-123' };
      mockState.supabaseData = {
        friends: testFriendLists.friends,
        reserved_spots: testFriendLists.reservedSpots,
        last_tended_at: null,
      };

      const { result, rerender } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Verify data is loaded
      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      expect(result.current.lists.reservedSpots.inner).toHaveLength(2);

      // Clear mocks to track new calls
      vi.mocked(localStorage.setItem).mockClear();

      // Simulate logout
      mockState.user = null;
      rerender();

      // Wait for effects
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Check that localStorage was NOT overwritten with empty reserved spots
      const setItemCalls = vi.mocked(localStorage.setItem).mock.calls;
      const emptyReservedWrite = setItemCalls.find(([key, value]) => {
        if (key === STORAGE_KEY) {
          try {
            const parsed = JSON.parse(value);
            // Check if all reservedSpots tiers are empty
            const allEmpty = Object.values(parsed.reservedSpots || {}).every(
              (tier: any) => !tier || tier.length === 0
            );
            return allEmpty;
          } catch {
            return false;
          }
        }
        return false;
      });

      expect(emptyReservedWrite).toBeUndefined();
    });

    it('should NOT lose reserved groups during login transition', async () => {
      // Start logged out
      mockState.user = null;
      localStorage.clear();

      const { result, rerender } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Setup: Supabase will return existing data when we log in
      mockState.supabaseData = {
        friends: testFriendLists.friends,
        reserved_spots: testFriendLists.reservedSpots,
        last_tended_at: null,
      };

      // Clear mocks
      mockState.upsertCalls = [];

      // Simulate login
      mockState.user = { id: 'user-123' };
      rerender();

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Wait for effects to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Check that upsert was NOT called with empty reserved_spots
      const emptyReservedUpsert = mockState.upsertCalls.find(call => {
        const data = call[0];
        if (data?.reserved_spots) {
          const allEmpty = Object.values(data.reserved_spots).every(
            (tier: any) => !tier || tier.length === 0
          );
          return allEmpty;
        }
        return false;
      });

      expect(emptyReservedUpsert).toBeUndefined();
    });
  });

  describe('getTierCapacity with reserved groups', () => {
    it('should correctly calculate capacity with reserved groups', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add a friend
      act(() => {
        result.current.addFriend({ name: 'Friend 1', tier: 'core' });
      });

      // Add reserved spots
      act(() => {
        result.current.addReservedGroup('core', 2, 'Reserved');
      });

      // Check capacity (core tier limit is 5)
      const capacity = result.current.getTierCapacity('core');
      expect(capacity.friendCount).toBe(1);
      expect(capacity.reserved).toBe(2);
      expect(capacity.used).toBe(3);
      expect(capacity.available).toBe(2); // 5 - 1 - 2 = 2
      expect(capacity.reservedGroups).toHaveLength(1);
    });

    it('should include all reserved groups in capacity calculation', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add multiple reserved groups to same tier
      act(() => {
        result.current.addReservedGroup('inner', 3, 'Group 1');
      });
      act(() => {
        result.current.addReservedGroup('inner', 2, 'Group 2');
      });
      act(() => {
        result.current.addReservedGroup('inner', 4, 'Group 3');
      });

      // Check capacity (inner tier limit is 15)
      const capacity = result.current.getTierCapacity('inner');
      expect(capacity.friendCount).toBe(0);
      expect(capacity.reserved).toBe(9); // 3 + 2 + 4
      expect(capacity.available).toBe(6); // 15 - 0 - 9 = 6
      expect(capacity.reservedGroups).toHaveLength(3);
    });
  });

  describe('Reserved groups in all tiers', () => {
    const allTiers = ['core', 'inner', 'outer', 'parasocial', 'rolemodel', 'acquainted'] as const;

    it.each(allTiers)('should persist reserved groups in %s tier', async (tier) => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add reserved group to this tier
      act(() => {
        result.current.addReservedGroup(tier, 2, `Reserved in ${tier}`);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify it's persisted
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots[tier]).toHaveLength(1);
      expect(parsed.reservedSpots[tier][0].count).toBe(2);
      expect(parsed.reservedSpots[tier][0].note).toBe(`Reserved in ${tier}`);
    });
  });

  describe('Edge cases', () => {
    it('should handle reserved group with no note', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add reserved group without note
      act(() => {
        result.current.addReservedGroup('core', 2);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify it's saved correctly
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots.core).toHaveLength(1);
      expect(parsed.reservedSpots.core[0].count).toBe(2);
      expect(parsed.reservedSpots.core[0].note).toBeUndefined();
    });

    it('should handle reserved group with empty string note', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Add reserved group with empty note (should be trimmed to undefined)
      act(() => {
        result.current.addReservedGroup('core', 2, '   ');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify note is undefined (trimmed empty string)
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);

      expect(parsed.reservedSpots.core[0].note).toBeUndefined();
    });

    it('should migrate old numeric reserved spots format', async () => {
      // Old format: reservedSpots was just numbers, not arrays of groups
      const oldFormat = {
        friends: [],
        reservedSpots: {
          core: 2, // Old numeric format
          inner: 0,
          outer: 0,
          parasocial: 0,
          rolemodel: 0,
          acquainted: 0,
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(oldFormat));

      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Should migrate to array format
      expect(Array.isArray(result.current.lists.reservedSpots.core)).toBe(true);
      expect(result.current.lists.reservedSpots.core).toHaveLength(1);
      expect(result.current.lists.reservedSpots.core[0].count).toBe(2);
    });

    it('should prevent reserved groups from exceeding tier capacity', async () => {
      mockState.user = null;

      const { result } = renderHook(() => useFriendLists());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });

      // Core tier has limit of 5
      // Try to add more than the limit
      let addResult: any;
      act(() => {
        addResult = result.current.addReservedGroup('core', 10, 'Too many');
      });

      // Should be capped at the maximum available
      expect(addResult.success).toBe(true);
      expect(addResult.group.count).toBe(5); // Capped to max

      // Try to add more - should fail
      act(() => {
        addResult = result.current.addReservedGroup('core', 1);
      });

      expect(addResult.success).toBe(false);
      expect(addResult.error).toContain('No capacity');
    });
  });
});

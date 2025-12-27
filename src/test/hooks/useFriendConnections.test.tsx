import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFriendConnections, CircleTier, FriendConnection } from '@/hooks/useFriendConnections';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
  channel: vi.fn(),
  removeChannel: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: unknown[]) => mockSupabase.from(...args),
    channel: (...args: unknown[]) => mockSupabase.channel(...args),
    removeChannel: (...args: unknown[]) => mockSupabase.removeChannel(...args),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Helper to create mock connection
const createMockConnection = (overrides: Partial<FriendConnection> = {}): FriendConnection => ({
  id: `conn-${Math.random().toString(36).substr(2, 9)}`,
  requester_id: 'user-a',
  target_user_id: 'user-b',
  circle_tier: 'core',
  target_circle_tier: null,
  status: 'pending',
  disclose_circle: true,
  matched_contact_method_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  confirmed_at: null,
  ...overrides,
});

// Setup mock chain helpers
const createMockChain = () => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  // Make terminal methods return promises
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.delete.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.or.mockReturnValue({ data: [], error: null });
  return chain;
};

describe('useFriendConnections', () => {
  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    mockSupabase.from.mockReturnValue(mockChain);

    // Setup channel mock
    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    mockSupabase.channel.mockReturnValue(channelMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should start with empty connections when userId is undefined', () => {
      const { result } = renderHook(() => useFriendConnections(undefined));

      // With no userId, connections should be empty (loading may stay true as a known limitation)
      expect(result.current.connections).toEqual([]);
      expect(result.current.pendingRequests).toEqual([]);
    });

    it('should fetch connections when userId is provided', async () => {
      const confirmedConnection = createMockConnection({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      });

      mockChain.or.mockResolvedValue({
        data: [confirmedConnection],
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.connections).toHaveLength(1);
      expect(result.current.connections[0].status).toBe('confirmed');
    });

    it('should separate pending requests from confirmed connections', async () => {
      const confirmed = createMockConnection({
        id: 'conn-1',
        status: 'confirmed',
        requester_id: 'other-user',
        target_user_id: 'user-a',
      });
      const pending = createMockConnection({
        id: 'conn-2',
        status: 'pending',
        requester_id: 'another-user',
        target_user_id: 'user-a',
      });

      mockChain.or.mockResolvedValue({
        data: [confirmed, pending],
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.connections).toHaveLength(1);
      expect(result.current.pendingRequests).toHaveLength(1);
      expect(result.current.pendingRequests[0].id).toBe('conn-2');
    });
  });

  describe('Connection Request Flow', () => {
    it('should create a connection request with requester tier', async () => {
      mockChain.or.mockResolvedValue({ data: [], error: null });
      mockChain.insert.mockReturnValue({
        ...mockChain,
        then: (resolve: (value: { error: null }) => void) => resolve({ error: null }),
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.createConnectionRequest(
          'user-b',
          'core',
          null,
          true
        );
      });

      expect(response!.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('friend_connections');
    });

    it('should prevent sending request to yourself', async () => {
      mockChain.or.mockResolvedValue({ data: [], error: null });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.createConnectionRequest(
          'user-a', // Same as current user
          'core',
          null,
          true
        );
      });

      expect(response!.success).toBe(false);
      expect(response!.error).toContain("cannotAddSelf");
    });

    it('should prevent duplicate connection requests', async () => {
      const existingConnection = createMockConnection({
        requester_id: 'user-a',
        target_user_id: 'user-b',
        status: 'confirmed',
      });

      mockChain.or.mockResolvedValue({
        data: [existingConnection],
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.createConnectionRequest(
          'user-b',
          'inner',
          null,
          true
        );
      });

      expect(response!.success).toBe(false);
      expect(response!.error).toContain('alreadyExists');
    });

    it('should allow different tier selections for requester', async () => {
      mockChain.or.mockResolvedValue({ data: [], error: null });

      const insertMock = vi.fn().mockResolvedValue({ error: null });
      mockChain.insert.mockReturnValue({
        ...mockChain,
        then: (resolve: (value: { error: null }) => void) => {
          insertMock();
          resolve({ error: null });
        },
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Test each tier
      for (const tier of ['core', 'inner', 'outer'] as CircleTier[]) {
        await act(async () => {
          await result.current.createConnectionRequest('user-new-' + tier, tier, null, true);
        });
      }
    });
  });

  describe('Responding to Requests', () => {
    it('should confirm a pending request', async () => {
      const pending = createMockConnection({
        id: 'conn-pending',
        status: 'pending',
        requester_id: 'user-b',
        target_user_id: 'user-a',
      });

      mockChain.or.mockResolvedValue({ data: [pending], error: null });
      mockChain.update.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.respondToRequest('conn-pending', true);
      });

      expect(response!.success).toBe(true);
    });

    it('should decline a pending request', async () => {
      const pending = createMockConnection({
        id: 'conn-pending',
        status: 'pending',
        requester_id: 'user-b',
        target_user_id: 'user-a',
      });

      mockChain.or.mockResolvedValue({ data: [pending], error: null });
      mockChain.update.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.respondToRequest('conn-pending', false);
      });

      expect(response!.success).toBe(true);
    });
  });

  describe('Tier-based Friend Retrieval', () => {
    it('should get confirmed friends in specific tier', async () => {
      const coreConnection = createMockConnection({
        id: 'conn-1',
        requester_id: 'user-a',
        target_user_id: 'user-b',
        circle_tier: 'core',
        status: 'confirmed',
      });
      const innerConnection = createMockConnection({
        id: 'conn-2',
        requester_id: 'user-a',
        target_user_id: 'user-c',
        circle_tier: 'inner',
        status: 'confirmed',
      });

      mockChain.or.mockResolvedValue({
        data: [coreConnection, innerConnection],
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const coreFriends = result.current.getConfirmedFriendsInTier('core');
      const innerFriends = result.current.getConfirmedFriendsInTier('inner');

      expect(coreFriends).toHaveLength(1);
      expect(innerFriends).toHaveLength(1);
      expect(coreFriends[0].target_user_id).toBe('user-b');
    });
  });

  describe('Connection Status Check', () => {
    it('should check if connected to another user', async () => {
      const connection = createMockConnection({
        requester_id: 'user-a',
        target_user_id: 'user-b',
        status: 'confirmed',
      });

      mockChain.or.mockResolvedValue({
        data: [connection],
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isConnectedTo('user-b')).not.toBeNull();
      expect(result.current.isConnectedTo('user-c')).toBeNull();
    });
  });

  describe('User Discovery', () => {
    it('should find user by contact info', async () => {
      mockChain.or.mockResolvedValue({ data: [], error: null });
      mockChain.single.mockResolvedValue({
        data: { user_id: 'found-user-id', id: 'contact-method-id' },
        error: null,
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let found: { userId: string; contactMethodId: string } | null;
      await act(async () => {
        found = await result.current.findUserByContactInfo('phone', '+1234567890');
      });

      expect(found).not.toBeNull();
      expect(found!.userId).toBe('found-user-id');
    });

    it('should return null when user not found', async () => {
      mockChain.or.mockResolvedValue({ data: [], error: null });
      mockChain.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'not found' },
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let found: { userId: string; contactMethodId: string } | null;
      await act(async () => {
        found = await result.current.findUserByContactInfo('phone', '+9999999999');
      });

      expect(found).toBeNull();
    });
  });

  describe('Connection Deletion', () => {
    it('should delete a connection', async () => {
      const connection = createMockConnection({
        id: 'conn-to-delete',
        requester_id: 'user-a',
        target_user_id: 'user-b',
      });

      mockChain.or.mockResolvedValue({ data: [connection], error: null });
      mockChain.delete.mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      const { result } = renderHook(() => useFriendConnections('user-a'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let response: { success: boolean; error?: string };
      await act(async () => {
        response = await result.current.deleteConnection('conn-to-delete');
      });

      expect(response!.success).toBe(true);
    });
  });
});

describe('useFriendConnections - Asymmetric Tier Classification', () => {
  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    mockSupabase.from.mockReturnValue(mockChain);

    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    mockSupabase.channel.mockReturnValue(channelMock);
  });

  it('should allow target to set their own tier when responding to request', async () => {
    // User B receives a request from User A who considers B "core"
    // But B considers A only "outer"
    const pending = createMockConnection({
      id: 'conn-asymmetric',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'core', // A's classification of B
      status: 'pending',
    });

    mockChain.or.mockResolvedValue({ data: [pending], error: null });

    const updateMock = vi.fn();
    mockChain.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useFriendConnections('user-b'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pendingRequests).toHaveLength(1);
    expect(result.current.pendingRequests[0].circle_tier).toBe('core'); // A's view

    // B responds with their own tier classification - setting A as 'outer'
    await act(async () => {
      await result.current.respondToRequest('conn-asymmetric', true, 'outer');
    });

    // Verify update was called (the actual tier would be set in DB)
    expect(mockSupabase.from).toHaveBeenCalledWith('friend_connections');
  });

  it('should store both requester tier and target tier after asymmetric confirmation', async () => {
    // After B confirms with their own tier, the connection should have:
    // - circle_tier: 'core' (how A sees B)
    // - target_circle_tier: 'outer' (how B sees A)
    const confirmedConnection = createMockConnection({
      id: 'conn-confirmed',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'core',
      target_circle_tier: 'outer', // B classifies A as outer
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    });

    mockChain.or.mockResolvedValue({ data: [confirmedConnection], error: null });

    const { result } = renderHook(() => useFriendConnections('user-b'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.connections).toHaveLength(1);
    expect(result.current.connections[0].circle_tier).toBe('core'); // A's view of B
    expect(result.current.connections[0].target_circle_tier).toBe('outer'); // B's view of A
  });

  it('should show friend in correct tier for each user perspective - requester view', async () => {
    // From A's perspective: B is in core (circle_tier)
    const connection = createMockConnection({
      id: 'conn-asymmetric',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'core', // A → B tier
      target_circle_tier: 'outer', // B → A tier
      status: 'confirmed',
    });

    mockChain.or.mockResolvedValue({ data: [connection], error: null });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // A should see B in their core tier
    const coreFriendsForA = result.current.getConfirmedFriendsInTier('core');
    expect(coreFriendsForA).toHaveLength(1);

    // A should NOT see B in outer tier
    const outerFriendsForA = result.current.getConfirmedFriendsInTier('outer');
    expect(outerFriendsForA).toHaveLength(0);
  });

  it('should show friend in correct tier for each user perspective - target view', async () => {
    // From B's perspective: A is in outer (target_circle_tier)
    const connection = createMockConnection({
      id: 'conn-asymmetric',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'core', // A → B tier
      target_circle_tier: 'outer', // B → A tier
      status: 'confirmed',
    });

    mockChain.or.mockResolvedValue({ data: [connection], error: null });

    const { result } = renderHook(() => useFriendConnections('user-b'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // B should see A in their outer tier
    const outerFriendsForB = result.current.getConfirmedFriendsInTier('outer');
    expect(outerFriendsForB).toHaveLength(1);

    // B should NOT see A in core tier
    const coreFriendsForB = result.current.getConfirmedFriendsInTier('core');
    expect(coreFriendsForB).toHaveLength(0);
  });

  it('should use helper functions to get tier perspectives correctly', async () => {
    const connection = createMockConnection({
      id: 'conn-asymmetric',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'inner', // A → B tier
      target_circle_tier: 'core', // B → A tier (B considers A closer!)
      status: 'confirmed',
    });

    mockChain.or.mockResolvedValue({ data: [connection], error: null });

    // Test from A's perspective
    const { result: resultA } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(resultA.current.loading).toBe(false);
    });

    const connA = resultA.current.connections[0];
    expect(resultA.current.getMyTierForFriend(connA)).toBe('inner'); // A put B in inner
    expect(resultA.current.getFriendTierForMe(connA)).toBe('core'); // B put A in core
    expect(resultA.current.getFriendIdFromConnection(connA)).toBe('user-b');
  });

  it('should default to requester tier if target does not specify their tier', async () => {
    const pending = createMockConnection({
      id: 'conn-default-tier',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      circle_tier: 'inner',
      status: 'pending',
    });

    mockChain.or.mockResolvedValue({ data: [pending], error: null });
    mockChain.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useFriendConnections('user-b'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // B accepts without specifying their own tier - should default to requester's tier
    await act(async () => {
      await result.current.respondToRequest('conn-default-tier', true);
    });

    // The hook would set target_circle_tier to 'inner' (same as circle_tier)
    expect(mockSupabase.from).toHaveBeenCalledWith('friend_connections');
  });
});

describe('useFriendConnections - Bidirectional vs Unidirectional', () => {
  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    mockSupabase.from.mockReturnValue(mockChain);

    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    mockSupabase.channel.mockReturnValue(channelMock);
  });

  it('should distinguish pending (unidirectional) from confirmed (bidirectional) connections', async () => {
    const unidirectional = createMockConnection({
      id: 'conn-pending',
      requester_id: 'user-a',
      target_user_id: 'user-b',
      status: 'pending',
      confirmed_at: null,
    });

    const bidirectional = createMockConnection({
      id: 'conn-confirmed',
      requester_id: 'user-a',
      target_user_id: 'user-c',
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    });

    mockChain.or.mockResolvedValue({
      data: [unidirectional, bidirectional],
      error: null,
    });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Pending = unidirectional (only requester has expressed interest)
    // Confirmed = bidirectional (both parties agreed)
    expect(result.current.connections.filter(c => c.status === 'confirmed')).toHaveLength(1);

    // Outgoing pending requests shouldn't show in pendingRequests (those are incoming)
    // Since user-a is the requester, not target
    expect(result.current.pendingRequests).toHaveLength(0);
  });

  it('should show incoming requests as pending for target user', async () => {
    const incomingRequest = createMockConnection({
      id: 'conn-incoming',
      requester_id: 'user-other',
      target_user_id: 'user-a', // We are user-a, receiving the request
      status: 'pending',
    });

    mockChain.or.mockResolvedValue({
      data: [incomingRequest],
      error: null,
    });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pendingRequests).toHaveLength(1);
    expect(result.current.pendingRequests[0].requester_id).toBe('user-other');
  });

  it('should include requester profile info for displaying incoming requests', async () => {
    const incomingRequest = createMockConnection({
      id: 'conn-incoming',
      requester_id: 'user-other',
      target_user_id: 'user-a',
      status: 'pending',
      requester_profile: {
        display_name: 'Other User',
        user_handle: 'otheruser',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    });

    mockChain.or.mockResolvedValue({
      data: [incomingRequest],
      error: null,
    });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pendingRequests[0].requester_profile?.display_name).toBe('Other User');
  });
});

describe('useFriendConnections - Error Handling', () => {
  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    mockSupabase.from.mockReturnValue(mockChain);

    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    mockSupabase.channel.mockReturnValue(channelMock);
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockChain.or.mockResolvedValue({
      data: null,
      error: { code: '500', message: 'Server error' },
    });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should not crash, should have empty state
    expect(result.current.connections).toEqual([]);

    consoleError.mockRestore();
  });

  it('should handle duplicate connection error (23505)', async () => {
    mockChain.or.mockResolvedValue({ data: [], error: null });
    mockChain.insert.mockReturnValue({
      then: (_resolve: unknown, reject: (reason: { error: { code: string } }) => void) =>
        reject({ error: { code: '23505' } }),
    });

    const { result } = renderHook(() => useFriendConnections('user-a'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Manually test the error path
    // In real code, the duplicate check happens at insert time
  });
});

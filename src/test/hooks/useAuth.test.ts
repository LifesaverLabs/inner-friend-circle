import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock state
const mockAuthState = {
  session: null as any,
  user: null as any,
  signUpResult: { error: null as any },
  signInResult: { error: null as any },
  signOutResult: { error: null as any },
};

// Mock Supabase auth
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn((callback) => {
        // Simulate initial auth state
        setTimeout(() => {
          callback('INITIAL_SESSION', mockAuthState.session);
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
      getSession: vi.fn(() =>
        Promise.resolve({
          data: { session: mockAuthState.session },
        })
      ),
      signUp: vi.fn(() => Promise.resolve(mockAuthState.signUpResult)),
      signInWithPassword: vi.fn(() => Promise.resolve(mockAuthState.signInResult)),
      signOut: vi.fn(() => Promise.resolve(mockAuthState.signOutResult)),
    },
  },
}));

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState.session = null;
    mockAuthState.user = null;
    mockAuthState.signUpResult = { error: null };
    mockAuthState.signInResult = { error: null };
    mockAuthState.signOutResult = { error: null };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should start with loading state true', () => {
      const { result } = renderHook(() => useAuth());
      // Initial state before auth check completes
      expect(result.current.loading).toBe(true);
    });

    it('should set loading to false after auth check', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should have null user when not authenticated', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toBeNull();
    });

    it('should have null session when not authenticated', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.session).toBeNull();
    });

    it('should set isAuthenticated to false when no user', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load existing session on mount', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toEqual({ id: 'user-123', email: 'test@example.com' });
    });

    it('should set isAuthenticated to true when user exists', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should subscribe to auth state changes', () => {
      renderHook(() => useAuth());
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    it('should call getSession on mount', () => {
      renderHook(() => useAuth());
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should call supabase signUp with email and password', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123');
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: expect.objectContaining({
          emailRedirectTo: expect.any(String),
        }),
      });
    });

    it('should include display name in signup options', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123', 'John Doe');
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: expect.objectContaining({
          data: { display_name: 'John Doe' },
        }),
      });
    });

    it('should return null error on successful signup', async () => {
      mockAuthState.signUpResult = { error: null };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('test@example.com', 'password123');
      });

      expect(signUpResult).toEqual({ error: null });
    });

    it('should return error on failed signup', async () => {
      const signUpError = { message: 'User already exists' };
      mockAuthState.signUpResult = { error: signUpError };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp('test@example.com', 'password123');
      });

      expect(signUpResult).toEqual({ error: signUpError });
    });

    it('should set redirect URL to current origin', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123');
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            emailRedirectTo: expect.stringContaining('/'),
          }),
        })
      );
    });
  });

  describe('signIn', () => {
    it('should call supabase signInWithPassword', async () => {
      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return null error on successful signin', async () => {
      mockAuthState.signInResult = { error: null };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password123');
      });

      expect(signInResult).toEqual({ error: null });
    });

    it('should return error on invalid credentials', async () => {
      const signInError = { message: 'Invalid login credentials' };
      mockAuthState.signInResult = { error: signInError };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrongpassword');
      });

      expect(signInResult).toEqual({ error: signInError });
    });
  });

  describe('signOut', () => {
    it('should call supabase signOut with local scope', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    });

    it('should clear user state after signOut', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it('should clear session state after signOut', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.session).toBeNull();
    });

    it('should set isAuthenticated to false after signOut', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return null error even if signOut fails', async () => {
      mockAuthState.signOutResult = { error: { message: 'session_not_found' } };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signOutResult;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      // Should treat as success since local state is cleared
      expect(signOutResult).toEqual({ error: null });
    });

    it('should clear local state even on server error', async () => {
      mockAuthState.session = {
        user: { id: 'user-123', email: 'test@example.com' },
      };
      mockAuthState.signOutResult = { error: { message: 'network_error' } };

      const { result } = renderHook(() => useAuth());
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from auth changes on unmount', () => {
      const unsubscribeMock = vi.fn();
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: {
          subscription: {
            id: 'test-subscription-id',
            callback: vi.fn(),
            unsubscribe: unsubscribeMock,
          },
        },
      });

      const { unmount } = renderHook(() => useAuth());
      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});

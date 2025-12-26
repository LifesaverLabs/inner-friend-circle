/**
 * useDispatchAuth Hook
 *
 * Manages authentication state for emergency dispatch accounts.
 * This is separate from the regular user authentication (Supabase Auth)
 * because dispatch accounts use a custom authentication flow.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DispatchSession,
  DispatchAuthState,
  EmergencyDispatchAccountRow,
} from '@/types/dispatch';

const DISPATCH_SESSION_KEY = 'dispatch_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hash password using SHA-256 (matches registration)
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get stored session from localStorage
 */
function getStoredSession(): DispatchSession | null {
  try {
    const stored = localStorage.getItem(DISPATCH_SESSION_KEY);
    if (!stored) return null;

    const session: DispatchSession = JSON.parse(stored);

    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(DISPATCH_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    localStorage.removeItem(DISPATCH_SESSION_KEY);
    return null;
  }
}

/**
 * Store session in localStorage
 */
function storeSession(session: DispatchSession): void {
  localStorage.setItem(DISPATCH_SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear stored session
 */
function clearSession(): void {
  localStorage.removeItem(DISPATCH_SESSION_KEY);
}

/**
 * Create session object from account data
 */
function createSession(account: EmergencyDispatchAccountRow): DispatchSession {
  return {
    accountId: account.id,
    organizationName: account.organization_name,
    organizationType: account.organization_type,
    verificationStatus: account.verification_status,
    isActive: account.is_active,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

export function useDispatchAuth() {
  const [state, setState] = useState<DispatchAuthState>({
    isAuthenticated: false,
    isLoading: true,
    session: null,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      // Verify session is still valid by checking account status
      verifySession(session);
    } else {
      setState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: null,
      });
    }
  }, []);

  /**
   * Verify that the stored session is still valid
   */
  const verifySession = async (session: DispatchSession) => {
    try {
      const { data: account, error } = await supabase
        .from('emergency_dispatch_accounts')
        .select('id, is_active, verification_status')
        .eq('id', session.accountId)
        .single();

      if (error || !account) {
        clearSession();
        setState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
          error: null,
        });
        return;
      }

      // Update session with latest status
      const updatedSession: DispatchSession = {
        ...session,
        isActive: account.is_active,
        verificationStatus: account.verification_status,
      };
      storeSession(updatedSession);

      setState({
        isAuthenticated: true,
        isLoading: false,
        session: updatedSession,
        error: null,
      });
    } catch {
      clearSession();
      setState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
        error: 'Failed to verify session',
      });
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Hash the password
      const passwordHash = await hashPassword(password);

      // Find account with matching email and password
      const { data: accounts, error } = await supabase
        .from('emergency_dispatch_accounts')
        .select('*')
        .eq('primary_contact_email', email.toLowerCase())
        .eq('password_hash', passwordHash);

      if (error) {
        throw new Error('Database error');
      }

      if (!accounts || accounts.length === 0) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password',
        }));
        return { success: false, error: 'Invalid email or password' };
      }

      const account = accounts[0] as EmergencyDispatchAccountRow;

      // Check if account is active
      if (!account.is_active) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Account is suspended',
        }));
        return { success: false, error: 'Account is suspended' };
      }

      // Create and store session
      const session = createSession(account);
      storeSession(session);

      setState({
        isAuthenticated: true,
        isLoading: false,
        session,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Sign out
   */
  const signOut = useCallback(() => {
    clearSession();
    setState({
      isAuthenticated: false,
      isLoading: false,
      session: null,
      error: null,
    });
  }, []);

  /**
   * Refresh session (get latest account status)
   */
  const refreshSession = useCallback(async () => {
    if (!state.session) return;
    await verifySession(state.session);
  }, [state.session]);

  /**
   * Check if account is verified and can make requests
   */
  const canMakeRequests = state.session?.verificationStatus === 'verified' && state.session?.isActive;

  return {
    ...state,
    signIn,
    signOut,
    refreshSession,
    canMakeRequests,
  };
}

/**
 * DevPanel - Development utilities for testing
 *
 * Only visible in development mode. Provides quick access to:
 * - Auth state management (clear session, switch accounts)
 * - Data management (clear localStorage, reset state)
 * - Debug info (session info, storage inspection)
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown, Trash2, RefreshCw, User, Database, Bug, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Only show in development
const isDev = import.meta.env.DEV;

interface DevPanelProps {
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
}

export function DevPanel({ user, onSignOut }: DevPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStorageInfo, setShowStorageInfo] = useState(false);

  // Don't render in production
  if (!isDev) return null;

  const handleClearLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(k =>
      k.startsWith('inner-friend') ||
      k.startsWith('sb-') ||
      k.includes('supabase')
    );

    appKeys.forEach(key => localStorage.removeItem(key));
    toast.success(`Cleared ${appKeys.length} app-related localStorage keys`);
  };

  const handleClearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Cleared all localStorage and sessionStorage');
  };

  const handleForceSignOut = async () => {
    try {
      // Clear all Supabase-related storage first
      const keys = Object.keys(localStorage);
      keys.filter(k => k.startsWith('sb-')).forEach(k => localStorage.removeItem(k));

      // Then sign out
      await supabase.auth.signOut({ scope: 'local' });
      onSignOut?.();
      toast.success('Force signed out and cleared auth storage');
    } catch (error) {
      toast.error('Failed to force sign out');
    }
  };

  const handleRefreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      toast.success('Session refreshed');
    } catch (error) {
      toast.error('Failed to refresh session');
    }
  };

  const getStorageInfo = () => {
    const info: Record<string, { size: number; value: string }> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        info[key] = {
          size: value.length,
          value: value.length > 100 ? value.substring(0, 100) + '...' : value,
        };
      }
    }
    return info;
  };

  const storageInfo = showStorageInfo ? getStorageInfo() : null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400 text-yellow-800 gap-1"
      >
        <Bug className="w-3.5 h-3.5" />
        Dev
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </Button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-10 right-0 w-80 bg-yellow-50 border border-yellow-400 rounded-lg shadow-lg p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-yellow-300 pb-2">
            <span className="font-medium text-yellow-800 text-sm">Dev Panel</span>
            <span className="text-xs text-yellow-600">Development Mode</span>
          </div>

          {/* User info */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-yellow-700 flex items-center gap-1">
              <User className="w-3 h-3" />
              Auth Status
            </div>
            <div className="text-xs bg-white rounded p-2 border border-yellow-200">
              {user ? (
                <>
                  <div><strong>ID:</strong> {user.id.substring(0, 8)}...</div>
                  <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                </>
              ) : (
                <span className="text-yellow-600">Not logged in</span>
              )}
            </div>
          </div>

          {/* Auth actions */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-yellow-700 flex items-center gap-1">
              <Key className="w-3 h-3" />
              Auth Actions
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSession}
                className="flex-1 text-xs h-7 bg-white"
                disabled={!user}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleForceSignOut}
                className="flex-1 text-xs h-7 bg-white text-destructive hover:text-destructive"
                disabled={!user}
              >
                Force Logout
              </Button>
            </div>
          </div>

          {/* Storage actions */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-yellow-700 flex items-center gap-1">
              <Database className="w-3 h-3" />
              Storage Actions
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLocalStorage}
                className="flex-1 text-xs h-7 bg-white"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear App Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllStorage}
                className="flex-1 text-xs h-7 bg-white text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Storage inspector */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStorageInfo(!showStorageInfo)}
              className="w-full text-xs h-7 justify-start text-yellow-700"
            >
              {showStorageInfo ? <ChevronDown className="w-3 h-3 mr-1" /> : <ChevronRight className="w-3 h-3 mr-1" />}
              Storage Inspector
            </Button>
            {showStorageInfo && storageInfo && (
              <div className="text-xs bg-white rounded p-2 border border-yellow-200 max-h-40 overflow-auto">
                {Object.entries(storageInfo).length === 0 ? (
                  <span className="text-yellow-600">No localStorage data</span>
                ) : (
                  Object.entries(storageInfo).map(([key, { size, value }]) => (
                    <div key={key} className="border-b border-yellow-100 py-1 last:border-0">
                      <div className="font-medium truncate" title={key}>{key}</div>
                      <div className="text-yellow-600">{size} chars</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick tips */}
          <div className="text-[10px] text-yellow-600 border-t border-yellow-300 pt-2">
            <strong>Tips:</strong>
            <ul className="list-disc list-inside space-y-0.5 mt-1">
              <li>Sessions persist across page reloads</li>
              <li>Use "Clear App Data" to reset friend lists</li>
              <li>Use "Force Logout" to fully clear auth state</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

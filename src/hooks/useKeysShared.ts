import { useState, useEffect, useCallback } from 'react';
import {
  HomeEntryPreferences,
  getDefaultHomeEntryPreferences,
} from '@/types/keysShared';

const STORAGE_KEY = 'keys-shared-preferences';

/**
 * Hook to manage Keys Shared preferences
 * Currently uses localStorage, can be migrated to Supabase later
 */
export function useKeysShared(userId?: string) {
  const [preferences, setPreferences] = useState<HomeEntryPreferences | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from storage
  useEffect(() => {
    if (!userId) {
      setPreferences(undefined);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        setPreferences({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
          keyHolders: parsed.keyHolders.map((kh: any) => ({
            ...kh,
            confirmedAt: new Date(kh.confirmedAt),
            lastVerified: kh.lastVerified ? new Date(kh.lastVerified) : undefined,
          })),
        });
      }
    } catch (error) {
      console.error('Error loading keys shared preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Save preferences to storage
  const savePreferences = useCallback(
    (newPreferences: HomeEntryPreferences) => {
      if (!userId) return;

      try {
        localStorage.setItem(`${STORAGE_KEY}-${userId}`, JSON.stringify(newPreferences));
        setPreferences(newPreferences);
      } catch (error) {
        console.error('Error saving keys shared preferences:', error);
        throw error;
      }
    },
    [userId]
  );

  // Clear preferences
  const clearPreferences = useCallback(() => {
    if (!userId) return;

    try {
      localStorage.removeItem(`${STORAGE_KEY}-${userId}`);
      setPreferences(undefined);
    } catch (error) {
      console.error('Error clearing keys shared preferences:', error);
    }
  }, [userId]);

  // Get summary of key holders
  const getKeyHoldersSummary = useCallback(() => {
    if (!preferences) {
      return { total: 0, physical: 0, digital: 0, both: 0 };
    }

    const holders = preferences.keyHolders;
    return {
      total: holders.length,
      physical: holders.filter(h => h.keyType === 'physical').length,
      digital: holders.filter(h => h.keyType === 'digital').length,
      both: holders.filter(h => h.keyType === 'both').length,
    };
  }, [preferences]);

  return {
    preferences,
    isLoading,
    savePreferences,
    clearPreferences,
    getKeyHoldersSummary,
    hasPreferences: !!preferences,
    keyHoldersCount: preferences?.keyHolders.length ?? 0,
  };
}

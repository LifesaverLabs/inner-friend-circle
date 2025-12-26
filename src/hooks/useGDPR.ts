/**
 * GDPR Consent Management Hook
 *
 * Manages cookie consent, user preferences, and GDPR-related state.
 * Stores consent in localStorage with optional sync to Supabase for logged-in users.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CookieConsent,
  ConsentRecord,
  DEFAULT_COOKIE_CONSENT,
  CURRENT_CONSENT_VERSION,
  createConsentRecord,
  isConsentValid,
  needsReconsent,
} from '@/types/gdpr';

const CONSENT_STORAGE_KEY = 'ifc_gdpr_consent';
const COOKIE_BANNER_DISMISSED_KEY = 'ifc_cookie_banner_dismissed';

interface UseGDPRReturn {
  // Consent state
  consent: ConsentRecord | null;
  cookieConsent: CookieConsent;
  hasValidConsent: boolean;
  needsReconsent: boolean;

  // Banner state
  showCookieBanner: boolean;
  dismissBanner: () => void;

  // Consent management
  acceptAllCookies: () => void;
  acceptEssentialOnly: () => void;
  updateCookieConsent: (consent: Partial<CookieConsent>) => void;
  saveFullConsent: (termsAccepted: boolean, privacyAccepted: boolean) => void;
  withdrawConsent: () => void;

  // Data rights
  requestDataExport: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
}

export function useGDPR(): UseGDPRReturn {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    const bannerDismissed = localStorage.getItem(COOKIE_BANNER_DISMISSED_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ConsentRecord;
        setConsent(parsed);
        // Show banner if consent version is outdated
        if (needsReconsent(parsed)) {
          setShowBanner(true);
        }
      } catch {
        // Invalid stored consent, clear it
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        setShowBanner(true);
      }
    } else if (!bannerDismissed) {
      // No consent stored and banner not dismissed
      setShowBanner(true);
    }

    setIsInitialized(true);
  }, []);

  // Save consent to localStorage whenever it changes
  useEffect(() => {
    if (consent && isInitialized) {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    }
  }, [consent, isInitialized]);

  const cookieConsent = consent?.cookies ?? DEFAULT_COOKIE_CONSENT;

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(COOKIE_BANNER_DISMISSED_KEY, 'true');
  }, []);

  const acceptAllCookies = useCallback(() => {
    const newConsent = createConsentRecord(
      {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
      true,
      true
    );
    setConsent(newConsent);
    dismissBanner();
  }, [dismissBanner]);

  const acceptEssentialOnly = useCallback(() => {
    const newConsent = createConsentRecord(
      {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      true,
      true
    );
    setConsent(newConsent);
    dismissBanner();
  }, [dismissBanner]);

  const updateCookieConsent = useCallback((updates: Partial<CookieConsent>) => {
    setConsent((prev) => {
      const currentCookies = prev?.cookies ?? DEFAULT_COOKIE_CONSENT;
      const newCookies = {
        ...currentCookies,
        ...updates,
        essential: true, // Essential is always true
      };

      return createConsentRecord(
        newCookies,
        prev?.termsAccepted ?? true,
        prev?.privacyPolicyAccepted ?? true
      );
    });
  }, []);

  const saveFullConsent = useCallback((termsAccepted: boolean, privacyAccepted: boolean) => {
    setConsent((prev) => {
      const currentCookies = prev?.cookies ?? DEFAULT_COOKIE_CONSENT;
      return createConsentRecord(currentCookies, termsAccepted, privacyAccepted);
    });
  }, []);

  const withdrawConsent = useCallback(() => {
    setConsent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        cookies: DEFAULT_COOKIE_CONSENT,
        termsAccepted: false,
        privacyPolicyAccepted: false,
        withdrawnAt: new Date().toISOString(),
      };
    });
    // Clear all non-essential storage
    // Keep only the withdrawal record
  }, []);

  const requestDataExport = useCallback(async () => {
    // This will trigger the Data Liberation export
    // Implementation delegated to the DataExportDialog component
    console.log('Data export requested');
  }, []);

  const requestAccountDeletion = useCallback(async () => {
    // This will be handled by the AccountDeletionDialog component
    console.log('Account deletion requested');
  }, []);

  return {
    consent,
    cookieConsent,
    hasValidConsent: isConsentValid(consent),
    needsReconsent: needsReconsent(consent),
    showCookieBanner: showBanner && isInitialized,
    dismissBanner,
    acceptAllCookies,
    acceptEssentialOnly,
    updateCookieConsent,
    saveFullConsent,
    withdrawConsent,
    requestDataExport,
    requestAccountDeletion,
  };
}

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGDPR } from '@/hooks/useGDPR';
import {
  CURRENT_CONSENT_VERSION,
  DEFAULT_COOKIE_CONSENT,
  createConsentRecord,
} from '@/types/gdpr';

const CONSENT_STORAGE_KEY = 'ifc_gdpr_consent';
const COOKIE_BANNER_DISMISSED_KEY = 'ifc_cookie_banner_dismissed';

describe('useGDPR', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should show cookie banner when no consent exists', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });
    });

    it('should not show banner if previously dismissed', async () => {
      localStorage.setItem(COOKIE_BANNER_DISMISSED_KEY, 'true');

      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(false);
      });
    });

    it('should have default cookie consent when no consent exists', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.cookieConsent).toEqual(DEFAULT_COOKIE_CONSENT);
      });
    });

    it('should have no valid consent when no consent exists', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.hasValidConsent).toBe(false);
      });
    });

    it('should need reconsent when no consent exists', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.needsReconsent).toBe(true);
      });
    });
  });

  describe('Loading Existing Consent', () => {
    it('should load consent from localStorage', async () => {
      const consent = createConsentRecord(
        { essential: true, functional: true, analytics: false, marketing: false },
        true,
        true
      );
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.consent).toBeTruthy();
        expect(result.current.cookieConsent.functional).toBe(true);
      });
    });

    it('should not show banner when valid consent exists', async () => {
      const consent = createConsentRecord(
        { essential: true, functional: true, analytics: true, marketing: true },
        true,
        true
      );
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(false);
      });
    });

    it('should show banner when consent version is outdated', async () => {
      const consent = createConsentRecord(
        { essential: true, functional: true, analytics: true, marketing: true },
        true,
        true
      );
      consent.consentVersion = '0.0.1'; // Outdated version
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
        expect(result.current.needsReconsent).toBe(true);
      });
    });

    it('should handle invalid stored consent gracefully', async () => {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'invalid json');

      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.consent).toBeNull();
        expect(result.current.showCookieBanner).toBe(true);
      });
    });
  });

  describe('Accept All Cookies', () => {
    it('should set all cookie preferences to true', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent).toEqual({
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
        });
      });
    });

    it('should accept terms and privacy policy', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.consent?.termsAccepted).toBe(true);
        expect(result.current.consent?.privacyPolicyAccepted).toBe(true);
      });
    });

    it('should dismiss the banner', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(false);
      });
    });

    it('should set current consent version', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.consent?.consentVersion).toBe(CURRENT_CONSENT_VERSION);
      });
    });

    it('should save consent to localStorage', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.cookies.analytics).toBe(true);
      });
    });
  });

  describe('Accept Essential Only', () => {
    it('should only enable essential cookies', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptEssentialOnly();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent).toEqual({
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
        });
      });
    });

    it('should still accept terms and privacy policy', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptEssentialOnly();
      });

      await waitFor(() => {
        expect(result.current.consent?.termsAccepted).toBe(true);
        expect(result.current.consent?.privacyPolicyAccepted).toBe(true);
      });
    });

    it('should dismiss the banner', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptEssentialOnly();
      });

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(false);
      });
    });
  });

  describe('Update Cookie Consent', () => {
    it('should update specific cookie preferences', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptEssentialOnly();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.analytics).toBe(false);
      });

      act(() => {
        result.current.updateCookieConsent({ analytics: true });
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.analytics).toBe(true);
        expect(result.current.cookieConsent.functional).toBe(false);
      });
    });

    it('should always keep essential cookies enabled', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      // Try to disable essential (should be ignored)
      act(() => {
        result.current.updateCookieConsent({ essential: false });
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.essential).toBe(true);
      });
    });

    it('should preserve other cookie settings when updating one', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.acceptAllCookies();
      });

      act(() => {
        result.current.updateCookieConsent({ marketing: false });
      });

      await waitFor(() => {
        expect(result.current.cookieConsent).toEqual({
          essential: true,
          functional: true,
          analytics: true,
          marketing: false,
        });
      });
    });
  });

  describe('Dismiss Banner', () => {
    it('should hide the banner', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.dismissBanner();
      });

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(false);
      });
    });

    it('should persist dismissed state', async () => {
      const { result } = renderHook(() => useGDPR());

      await waitFor(() => {
        expect(result.current.showCookieBanner).toBe(true);
      });

      act(() => {
        result.current.dismissBanner();
      });

      await waitFor(() => {
        expect(localStorage.getItem(COOKIE_BANNER_DISMISSED_KEY)).toBe('true');
      });
    });
  });

  describe('Withdraw Consent', () => {
    it('should reset cookies to essential only', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.analytics).toBe(true);
      });

      act(() => {
        result.current.withdrawConsent();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent).toEqual(DEFAULT_COOKIE_CONSENT);
      });
    });

    it('should set withdrawnAt timestamp', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.consent?.withdrawnAt).toBeUndefined();
      });

      act(() => {
        result.current.withdrawConsent();
      });

      await waitFor(() => {
        expect(result.current.consent?.withdrawnAt).toBeTruthy();
      });
    });

    it('should set terms and privacy to false', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.consent?.termsAccepted).toBe(true);
      });

      act(() => {
        result.current.withdrawConsent();
      });

      await waitFor(() => {
        expect(result.current.consent?.termsAccepted).toBe(false);
        expect(result.current.consent?.privacyPolicyAccepted).toBe(false);
      });
    });

    it('should invalidate consent after withdrawal', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.hasValidConsent).toBe(true);
      });

      act(() => {
        result.current.withdrawConsent();
      });

      await waitFor(() => {
        expect(result.current.hasValidConsent).toBe(false);
      });
    });
  });

  describe('Save Full Consent', () => {
    it('should update terms and privacy acceptance', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.saveFullConsent(true, true);
      });

      await waitFor(() => {
        expect(result.current.consent?.termsAccepted).toBe(true);
        expect(result.current.consent?.privacyPolicyAccepted).toBe(true);
      });
    });

    it('should preserve existing cookie preferences', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.analytics).toBe(true);
      });

      act(() => {
        result.current.saveFullConsent(true, true);
      });

      await waitFor(() => {
        expect(result.current.cookieConsent.analytics).toBe(true);
      });
    });
  });

  describe('Consent Validity', () => {
    it('should be valid when all requirements are met', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      await waitFor(() => {
        expect(result.current.hasValidConsent).toBe(true);
        expect(result.current.needsReconsent).toBe(false);
      });
    });

    it('should be invalid when consent is withdrawn', async () => {
      const { result } = renderHook(() => useGDPR());

      act(() => {
        result.current.acceptAllCookies();
      });

      act(() => {
        result.current.withdrawConsent();
      });

      await waitFor(() => {
        expect(result.current.hasValidConsent).toBe(false);
      });
    });
  });
});

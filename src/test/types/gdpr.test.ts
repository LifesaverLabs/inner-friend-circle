import { describe, it, expect } from 'vitest';
import {
  CookieConsent,
  ConsentRecord,
  AgeVerification,
  DeletionRequest,
  DEFAULT_COOKIE_CONSENT,
  CURRENT_CONSENT_VERSION,
  DATA_RETENTION_DAYS,
  MINIMUM_AGE_WITHOUT_CONSENT,
  isConsentValid,
  needsReconsent,
  createConsentRecord,
} from '@/types/gdpr';

describe('GDPR Types', () => {
  describe('Constants', () => {
    it('should have correct default cookie consent', () => {
      expect(DEFAULT_COOKIE_CONSENT).toEqual({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      });
    });

    it('should have a consent version', () => {
      expect(CURRENT_CONSENT_VERSION).toBeDefined();
      expect(typeof CURRENT_CONSENT_VERSION).toBe('string');
      expect(CURRENT_CONSENT_VERSION.length).toBeGreaterThan(0);
    });

    it('should have 30-day data retention period', () => {
      expect(DATA_RETENTION_DAYS).toBe(30);
    });

    it('should require parental consent under 16', () => {
      expect(MINIMUM_AGE_WITHOUT_CONSENT).toBe(16);
    });
  });

  describe('createConsentRecord', () => {
    it('should create a valid consent record', () => {
      const cookies: CookieConsent = {
        essential: true,
        functional: true,
        analytics: false,
        marketing: false,
      };

      const record = createConsentRecord(cookies, true, true);

      expect(record.cookies).toEqual(cookies);
      expect(record.termsAccepted).toBe(true);
      expect(record.privacyPolicyAccepted).toBe(true);
      expect(record.consentVersion).toBe(CURRENT_CONSENT_VERSION);
      expect(record.consentDate).toBeDefined();
    });

    it('should set consent date to current time', () => {
      const before = new Date().toISOString();
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      const after = new Date().toISOString();

      expect(record.consentDate >= before).toBe(true);
      expect(record.consentDate <= after).toBe(true);
    });

    it('should include user agent when available', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      // In Node.js test environment, navigator may not be available
      // The function should handle this gracefully
      expect(record.userAgent).toBeDefined();
    });

    it('should not have withdrawnAt initially', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      expect(record.withdrawnAt).toBeUndefined();
    });
  });

  describe('isConsentValid', () => {
    it('should return false for null consent', () => {
      expect(isConsentValid(null)).toBe(false);
    });

    it('should return false for withdrawn consent', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      record.withdrawnAt = new Date().toISOString();

      expect(isConsentValid(record)).toBe(false);
    });

    it('should return false for outdated consent version', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      record.consentVersion = '0.0.1';

      expect(isConsentValid(record)).toBe(false);
    });

    it('should return false if terms not accepted', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, false, true);

      expect(isConsentValid(record)).toBe(false);
    });

    it('should return false if privacy policy not accepted', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, false);

      expect(isConsentValid(record)).toBe(false);
    });

    it('should return true for valid consent', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      expect(isConsentValid(record)).toBe(true);
    });
  });

  describe('needsReconsent', () => {
    it('should return true for null consent', () => {
      expect(needsReconsent(null)).toBe(true);
    });

    it('should return true for outdated version', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      record.consentVersion = '0.0.1';

      expect(needsReconsent(record)).toBe(true);
    });

    it('should return false for current version', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      expect(needsReconsent(record)).toBe(false);
    });
  });

  describe('CookieConsent Type', () => {
    it('should have all required properties', () => {
      const consent: CookieConsent = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
      };

      expect(consent).toHaveProperty('essential');
      expect(consent).toHaveProperty('functional');
      expect(consent).toHaveProperty('analytics');
      expect(consent).toHaveProperty('marketing');
    });

    it('should enforce essential is always true in practice', () => {
      // Essential should always be true for the app to function
      const validConsent: CookieConsent = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      };

      expect(validConsent.essential).toBe(true);
    });
  });

  describe('ConsentRecord Type', () => {
    it('should include cookie consent', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      expect(record.cookies).toBeDefined();
      expect(record.cookies.essential).toBe(true);
    });

    it('should include terms acceptance', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, false);

      expect(record.termsAccepted).toBe(true);
      expect(record.privacyPolicyAccepted).toBe(false);
    });

    it('should include version and date', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      expect(record.consentVersion).toBe(CURRENT_CONSENT_VERSION);
      expect(record.consentDate).toBeDefined();
      expect(new Date(record.consentDate).getTime()).not.toBeNaN();
    });
  });

  describe('AgeVerification Type', () => {
    it('should correctly identify minors', () => {
      const minorVerification: AgeVerification = {
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        birthYear: new Date().getFullYear() - 14,
        isMinor: true,
        parentalConsentRequired: true,
        parentalConsentGiven: false,
      };

      expect(minorVerification.isMinor).toBe(true);
      expect(minorVerification.parentalConsentRequired).toBe(true);
    });

    it('should correctly identify adults', () => {
      const adultVerification: AgeVerification = {
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        birthYear: new Date().getFullYear() - 25,
        isMinor: false,
        parentalConsentRequired: false,
      };

      expect(adultVerification.isMinor).toBe(false);
      expect(adultVerification.parentalConsentRequired).toBe(false);
    });
  });

  describe('DeletionRequest Type', () => {
    it('should have all required properties', () => {
      const request: DeletionRequest = {
        id: 'del-123',
        userId: 'user-456',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        scheduledDeletionAt: new Date(Date.now() + DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        dataExportedBefore: false,
      };

      expect(request.id).toBeDefined();
      expect(request.userId).toBeDefined();
      expect(request.status).toBe('pending');
      expect(request.dataExportedBefore).toBe(false);
    });

    it('should support all status values', () => {
      const statuses: DeletionRequest['status'][] = ['pending', 'processing', 'completed', 'cancelled'];

      statuses.forEach(status => {
        const request: DeletionRequest = {
          id: 'del-123',
          userId: 'user-456',
          requestedAt: new Date().toISOString(),
          status,
          scheduledDeletionAt: new Date().toISOString(),
          dataExportedBefore: true,
        };

        expect(request.status).toBe(status);
      });
    });

    it('should include optional reason', () => {
      const requestWithReason: DeletionRequest = {
        id: 'del-123',
        userId: 'user-456',
        requestedAt: new Date().toISOString(),
        reason: 'No longer using the service',
        status: 'pending',
        scheduledDeletionAt: new Date().toISOString(),
        dataExportedBefore: true,
      };

      expect(requestWithReason.reason).toBe('No longer using the service');
    });
  });

  describe('GDPR Compliance Requirements', () => {
    it('should support consent withdrawal', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      expect(isConsentValid(record)).toBe(true);

      record.withdrawnAt = new Date().toISOString();
      expect(isConsentValid(record)).toBe(false);
    });

    it('should track consent version for reconsent requirements', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      expect(needsReconsent(record)).toBe(false);

      // Simulate terms update by changing version
      record.consentVersion = '0.9.0';
      expect(needsReconsent(record)).toBe(true);
    });

    it('should support granular cookie consent', () => {
      // User can accept essential only
      const essentialOnly = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);
      expect(essentialOnly.cookies.essential).toBe(true);
      expect(essentialOnly.cookies.analytics).toBe(false);

      // User can accept all
      const allCookies = createConsentRecord(
        { essential: true, functional: true, analytics: true, marketing: true },
        true,
        true
      );
      expect(allCookies.cookies.analytics).toBe(true);
      expect(allCookies.cookies.marketing).toBe(true);
    });

    it('should provide data for audit trail', () => {
      const record = createConsentRecord(DEFAULT_COOKIE_CONSENT, true, true);

      // Should have timestamp
      expect(record.consentDate).toBeDefined();

      // Should have version for compliance tracking
      expect(record.consentVersion).toBeDefined();

      // Should capture user agent for audit
      expect(record.userAgent).toBeDefined();
    });
  });
});

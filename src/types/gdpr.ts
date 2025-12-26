/**
 * GDPR Compliance Types
 *
 * This module defines types for GDPR-compliant consent management,
 * data subject rights, and privacy preferences.
 */

/**
 * Types of cookies/storage that require consent
 */
export type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing';

/**
 * Cookie consent preferences
 */
export interface CookieConsent {
  essential: boolean; // Always true - required for the app to function
  functional: boolean; // Language preferences, UI settings
  analytics: boolean; // Usage analytics (if implemented)
  marketing: boolean; // Marketing cookies (if implemented)
}

/**
 * Full consent record with metadata
 */
export interface ConsentRecord {
  // Cookie consent preferences
  cookies: CookieConsent;

  // Terms and privacy policy consent
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;

  // Metadata
  consentVersion: string; // Version of terms/privacy at time of consent
  consentDate: string; // ISO date string
  ipAddress?: string; // For audit purposes (hashed)
  userAgent?: string; // For audit purposes

  // Withdrawal tracking
  withdrawnAt?: string; // ISO date string if consent was withdrawn
}

/**
 * User's GDPR preferences stored in their profile
 */
export interface GDPRPreferences {
  // Consent record
  consent: ConsentRecord;

  // Data retention preferences
  dataRetentionDays?: number; // How long to keep data after account deletion

  // Communication preferences
  allowEmailNotifications: boolean;
  allowProductUpdates: boolean;

  // Data processing preferences
  allowAnonymizedAnalytics: boolean;
}

/**
 * Age verification status
 */
export interface AgeVerification {
  isVerified: boolean;
  verifiedAt?: string;
  birthYear?: number; // Only store year for minimal data
  isMinor: boolean; // Under 16 for GDPR
  parentalConsentRequired: boolean;
  parentalConsentGiven?: boolean;
  parentalConsentDate?: string;
}

/**
 * Account deletion request
 */
export interface DeletionRequest {
  id: string;
  userId: string;
  requestedAt: string;
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  scheduledDeletionAt: string; // Usually 30 days after request
  completedAt?: string;
  dataExportedBefore: boolean;
}

/**
 * Data access request (Subject Access Request / SAR)
 */
export interface DataAccessRequest {
  id: string;
  userId: string;
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed';
  completedAt?: string;
  downloadUrl?: string;
  downloadExpiresAt?: string;
}

/**
 * Default cookie consent (minimal - only essential)
 */
export const DEFAULT_COOKIE_CONSENT: CookieConsent = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

/**
 * Current version of terms and privacy policy
 * Update this when terms change to prompt re-consent
 */
export const CURRENT_CONSENT_VERSION = '1.0.0';

/**
 * GDPR-mandated data retention period in days
 * After account deletion, data is retained for this period for legal compliance
 */
export const DATA_RETENTION_DAYS = 30;

/**
 * Minimum age for account creation without parental consent (GDPR Article 8)
 */
export const MINIMUM_AGE_WITHOUT_CONSENT = 16;

/**
 * Helper to check if consent is valid and current
 */
export function isConsentValid(consent: ConsentRecord | null): boolean {
  if (!consent) return false;
  if (consent.withdrawnAt) return false;
  if (consent.consentVersion !== CURRENT_CONSENT_VERSION) return false;
  if (!consent.termsAccepted || !consent.privacyPolicyAccepted) return false;
  return true;
}

/**
 * Helper to check if user needs to re-consent due to terms update
 */
export function needsReconsent(consent: ConsentRecord | null): boolean {
  if (!consent) return true;
  return consent.consentVersion !== CURRENT_CONSENT_VERSION;
}

/**
 * Create a new consent record
 */
export function createConsentRecord(
  cookies: CookieConsent,
  termsAccepted: boolean,
  privacyPolicyAccepted: boolean
): ConsentRecord {
  return {
    cookies,
    termsAccepted,
    privacyPolicyAccepted,
    consentVersion: CURRENT_CONSENT_VERSION,
    consentDate: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

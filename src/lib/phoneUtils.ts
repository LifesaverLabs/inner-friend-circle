/**
 * Phone Number Utilities
 *
 * Provides international phone number formatting, validation, and normalization.
 * Uses libphonenumber-js for parsing and formatting.
 *
 * Key features:
 * - Auto-detect user's country from browser locale
 * - Format numbers in national or international format
 * - Store numbers in E.164 format (+15551234567)
 * - Display in localized format for the user's country
 */

import {
  parsePhoneNumber,
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  getCountryCallingCode,
  CountryCode,
  AsYouType,
} from 'libphonenumber-js';

// Common country codes for selection
export const COUNTRY_OPTIONS: Array<{ code: CountryCode; name: string; dialCode: string }> = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'IL', name: 'Israel', dialCode: '+972' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'PE', name: 'Peru', dialCode: '+51' },
];

/**
 * Detect user's country from browser locale or timezone
 */
export function detectUserCountry(): CountryCode {
  // Try navigator.language first (e.g., "en-US", "fr-FR")
  const language = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
  const parts = language.split('-');
  if (parts.length >= 2) {
    const countryFromLocale = parts[1].toUpperCase();
    // Validate it's a known country
    if (COUNTRY_OPTIONS.find(c => c.code === countryFromLocale)) {
      return countryFromLocale as CountryCode;
    }
  }

  // Try timezone as fallback
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryFromTz = getCountryFromTimezone(timezone);
    if (countryFromTz) {
      return countryFromTz;
    }
  } catch {
    // Timezone detection failed
  }

  // Default to US
  return 'US';
}

/**
 * Map common timezones to country codes
 */
function getCountryFromTimezone(timezone: string): CountryCode | null {
  const tzToCountry: Record<string, CountryCode> = {
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'Pacific/Honolulu': 'US',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Amsterdam': 'NL',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK',
    'Europe/Helsinki': 'FI',
    'Europe/Warsaw': 'PL',
    'Europe/Moscow': 'RU',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Hong_Kong': 'CN',
    'Asia/Seoul': 'KR',
    'Asia/Singapore': 'SG',
    'Asia/Kolkata': 'IN',
    'Asia/Mumbai': 'IN',
    'Asia/Dubai': 'AE',
    'Asia/Jerusalem': 'IL',
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
    'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU',
    'Pacific/Auckland': 'NZ',
    'America/Sao_Paulo': 'BR',
    'America/Mexico_City': 'MX',
    'America/Buenos_Aires': 'AR',
    'America/Santiago': 'CL',
    'Africa/Johannesburg': 'ZA',
  };

  return tzToCountry[timezone] || null;
}

/**
 * Format phone number as user types (live formatting)
 */
export function formatAsYouType(input: string, country: CountryCode): string {
  const formatter = new AsYouType(country);
  return formatter.input(input);
}

/**
 * Parse and validate a phone number
 */
export function parsePhone(input: string, defaultCountry: CountryCode): {
  isValid: boolean;
  e164: string | null;
  national: string | null;
  international: string | null;
  country: CountryCode | null;
  error?: string;
} {
  try {
    const phoneNumber = parsePhoneNumberFromString(input, defaultCountry);

    if (!phoneNumber) {
      return {
        isValid: false,
        e164: null,
        national: null,
        international: null,
        country: null,
        error: 'Could not parse phone number',
      };
    }

    const isValid = phoneNumber.isValid();

    return {
      isValid,
      e164: isValid ? phoneNumber.format('E.164') : null,
      national: phoneNumber.formatNational(),
      international: phoneNumber.formatInternational(),
      country: phoneNumber.country || null,
    };
  } catch (error) {
    return {
      isValid: false,
      e164: null,
      national: null,
      international: null,
      country: null,
      error: error instanceof Error ? error.message : 'Parse error',
    };
  }
}

/**
 * Validate a phone number string
 */
export function validatePhone(input: string, defaultCountry: CountryCode): boolean {
  try {
    return isValidPhoneNumber(input, defaultCountry);
  } catch {
    return false;
  }
}

/**
 * Normalize phone to E.164 format for storage (+15551234567)
 */
export function normalizePhone(input: string, defaultCountry: CountryCode): string | null {
  const result = parsePhone(input, defaultCountry);
  return result.e164;
}

/**
 * Format phone for display (localized national or international format)
 */
export function formatPhoneForDisplay(
  e164Phone: string,
  viewerCountry: CountryCode
): string {
  try {
    const phoneNumber = parsePhoneNumberFromString(e164Phone);
    if (!phoneNumber) return e164Phone;

    // If same country as viewer, show national format
    if (phoneNumber.country === viewerCountry) {
      return phoneNumber.formatNational();
    }

    // Otherwise show international format
    return phoneNumber.formatInternational();
  } catch {
    return e164Phone;
  }
}

/**
 * Get country info for a phone number
 */
export function getPhoneCountry(e164Phone: string): CountryCode | null {
  try {
    const phoneNumber = parsePhoneNumberFromString(e164Phone);
    return phoneNumber?.country || null;
  } catch {
    return null;
  }
}

/**
 * Get example phone number for a country (for placeholder)
 */
export function getExamplePhone(country: CountryCode): string {
  const examples: Partial<Record<CountryCode, string>> = {
    US: '(555) 123-4567',
    CA: '(555) 123-4567',
    GB: '07700 900123',
    AU: '0412 345 678',
    DE: '0151 12345678',
    FR: '06 12 34 56 78',
    JP: '090-1234-5678',
    CN: '139 1234 5678',
    IN: '98765 43210',
    BR: '(11) 91234-5678',
    MX: '55 1234 5678',
  };

  return examples[country] || '555-123-4567';
}

/**
 * Get dial code for a country
 */
export function getDialCode(country: CountryCode): string {
  try {
    return '+' + getCountryCallingCode(country);
  } catch {
    return '+1';
  }
}

/**
 * Extract digits only from a phone string (for URLs like wa.me)
 */
export function extractDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Check if phone looks like it might be valid (quick pre-validation)
 */
export function looksLikePhone(input: string): boolean {
  // Must have at least 7 digits
  const digits = input.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Create a tel: URL for phone calls
 */
export function createTelUrl(phone: string): string {
  return `tel:${extractDigits(phone)}`;
}

/**
 * Create an sms: URL for text messages
 */
export function createSmsUrl(phone: string, body?: string): string {
  const baseUrl = `sms:${extractDigits(phone)}`;
  if (body) {
    return `${baseUrl}?body=${encodeURIComponent(body)}`;
  }
  return baseUrl;
}

/**
 * Create a WhatsApp URL
 */
export function createWhatsAppUrl(phone: string, message?: string): string {
  const digits = extractDigits(phone);
  if (message) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${digits}`;
}

/**
 * Create a Signal URL
 */
export function createSignalUrl(phone: string): string {
  return `https://signal.me/#p/${extractDigits(phone)}`;
}

/**
 * Get country flag emoji
 */
export function getCountryFlag(country: CountryCode): string {
  // Convert country code to flag emoji using regional indicator symbols
  const codePoints = country
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

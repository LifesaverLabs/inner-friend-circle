/**
 * Contact Picker API Wrapper
 *
 * Provides access to the native Contact Picker API on mobile devices.
 * This API allows users to select contacts from their phone's address book
 * with explicit consent for each selection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API
 * @see https://developer.chrome.com/docs/capabilities/web-apis/contact-picker
 */

import { ImportableContact, ContactPickerContact } from '@/types/contactImport';
import { normalizePhone, detectUserCountry } from '@/lib/phoneUtils';
import type { CountryCode } from 'libphonenumber-js';

/**
 * Check if the Contact Picker API is supported in the current browser.
 * Supported in Chrome 80+ on Android and Safari (experimental) on iOS.
 */
export function isContactPickerSupported(): boolean {
  return 'contacts' in navigator && 'ContactsManager' in window;
}

/**
 * Get the available properties that can be requested from contacts.
 * Returns empty array if API is not supported.
 */
export async function getAvailableProperties(): Promise<string[]> {
  if (!isContactPickerSupported() || !navigator.contacts) {
    return [];
  }

  try {
    return await navigator.contacts.getProperties();
  } catch {
    return [];
  }
}

/**
 * Open the native contact picker and let user select contacts.
 * Returns the selected contacts normalized to ImportableContact format.
 *
 * @param defaultCountry - Country code for phone numbers without a country prefix.
 *                         This handles the common case where contacts are stored without
 *                         country codes (e.g., "555-123-4567" instead of "+1 555-123-4567").
 * @throws Error if Contact Picker API is not supported
 * @throws Error if user cancels the picker (DOMException with name 'AbortError')
 */
export async function pickContacts(defaultCountry?: CountryCode): Promise<ImportableContact[]> {
  if (!isContactPickerSupported() || !navigator.contacts) {
    throw new Error('Contact Picker API is not supported on this device');
  }

  // Request name, email, and phone properties
  const props: Array<'name' | 'email' | 'tel'> = ['name', 'email', 'tel'];
  const opts = { multiple: true };

  try {
    const contacts = await navigator.contacts.select(props, opts);
    return normalizePickerContacts(contacts, defaultCountry);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // User cancelled the picker
      return [];
    }
    throw error;
  }
}

/**
 * Open the native contact picker for single contact selection.
 *
 * @param defaultCountry - Country code for phone numbers without a country prefix
 * @throws Error if Contact Picker API is not supported
 */
export async function pickSingleContact(defaultCountry?: CountryCode): Promise<ImportableContact | null> {
  if (!isContactPickerSupported() || !navigator.contacts) {
    throw new Error('Contact Picker API is not supported on this device');
  }

  const props: Array<'name' | 'email' | 'tel'> = ['name', 'email', 'tel'];
  const opts = { multiple: false };

  try {
    const contacts = await navigator.contacts.select(props, opts);
    const normalized = normalizePickerContacts(contacts, defaultCountry);
    return normalized[0] || null;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null;
    }
    throw error;
  }
}

/**
 * Normalize raw Contact Picker API results to ImportableContact format.
 *
 * @param contacts - Raw contacts from the Contact Picker API
 * @param defaultCountry - Country code for phone numbers without a country prefix
 */
function normalizePickerContacts(
  contacts: ContactPickerContact[],
  defaultCountry?: CountryCode
): ImportableContact[] {
  // Use provided default country or detect from browser
  const country = defaultCountry || detectUserCountry();

  return contacts
    .map((contact): ImportableContact | null => {
      // Get the first name, or use 'Unknown' as fallback
      const name = contact.name?.[0]?.trim();
      if (!name) {
        return null; // Skip contacts without names
      }

      // Get first phone number and normalize it with default country
      const rawPhone = contact.tel?.[0];
      const phone = rawPhone ? normalizePhone(rawPhone, country) || rawPhone : undefined;

      // Get first email
      const email = contact.email?.[0]?.trim().toLowerCase();

      return {
        name,
        phone,
        email: email || undefined,
        source: 'contact_picker',
      };
    })
    .filter((contact): contact is ImportableContact => contact !== null);
}

/**
 * Check if the device is likely a mobile device where Contact Picker works best.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Check user agent for mobile indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'mobile', 'phone'];
  const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword));

  return hasTouch && isMobileUA;
}

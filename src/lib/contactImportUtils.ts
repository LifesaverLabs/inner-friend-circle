/**
 * Contact Import Utilities
 *
 * Parsing, normalization, and deduplication for bulk contact imports.
 */

import vCard from 'vcf';
import Papa from 'papaparse';
import {
  ImportableContact,
  RawImportedContact,
  DeduplicationResult,
  CsvColumnMapping,
  ImportResult,
} from '@/types/contactImport';
import { Friend, TIER_LIMITS } from '@/types/friend';
import { normalizePhone, validatePhone, detectUserCountry } from '@/lib/phoneUtils';
import type { CountryCode } from 'libphonenumber-js';

/**
 * Normalize a raw imported contact to the standard ImportableContact format.
 *
 * @param raw - The raw contact data from import source
 * @param defaultCountry - Country code to use for phone numbers without a country code.
 *                         This handles the common case where users store domestic numbers
 *                         without a country prefix (e.g., "555-123-4567" instead of "+1 555-123-4567").
 */
export function normalizeContact(
  raw: RawImportedContact,
  defaultCountry?: CountryCode
): ImportableContact | null {
  // Get name from various sources
  let name = raw.name?.trim();
  if (!name && raw.names?.length) {
    name = raw.names[0]?.trim();
  }

  if (!name) {
    return null; // Name is required
  }

  // Use provided default country or detect from browser
  const country = defaultCountry || detectUserCountry();

  // Get and normalize phone with country code defaulting
  let phone: string | undefined;
  const rawPhone = raw.phone || raw.phones?.[0];
  if (rawPhone) {
    // normalizePhone will use the default country for numbers without a country code
    phone = normalizePhone(rawPhone, country) || rawPhone;
  }

  // Get email
  let email: string | undefined;
  const rawEmail = raw.email || raw.emails?.[0];
  if (rawEmail) {
    email = rawEmail.trim().toLowerCase();
  }

  return {
    name,
    phone,
    email,
    source: raw.source,
  };
}

/**
 * Parse a vCard/VCF file content into importable contacts.
 *
 * @param content - The raw vCard file content
 * @param defaultCountry - Country code for phone numbers without a country prefix
 * @returns Array of parsed contacts
 */
export function parseVCard(content: string, defaultCountry?: CountryCode): ImportableContact[] {
  const contacts: ImportableContact[] = [];

  try {
    // Normalize line endings for the vcf library (requires \r\n)
    const normalizedContent = content.replace(/\r\n|\r|\n/g, '\r\n');

    // vcf library can parse multiple vCards from a single file
    const cards = vCard.parse(normalizedContent);

    for (const card of cards) {
      const raw: RawImportedContact = {
        source: 'vcard',
      };

      // Get formatted name (FN) or structured name (N)
      const fn = card.get('fn');
      if (fn) {
        const fnValue = fn.valueOf();
        raw.name = typeof fnValue === 'string' ? fnValue : String(fnValue);
      } else {
        const n = card.get('n');
        if (n) {
          const nValue = n.valueOf();
          if (typeof nValue === 'string') {
            // N format: Last;First;Middle;Prefix;Suffix
            const parts = nValue.split(';').filter(Boolean);
            if (parts.length >= 2) {
              raw.name = `${parts[1]} ${parts[0]}`.trim(); // First Last
            } else if (parts.length === 1) {
              raw.name = parts[0];
            }
          }
        }
      }

      // Get phone numbers (TEL)
      const tels = card.get('tel');
      if (tels) {
        const telArray = Array.isArray(tels) ? tels : [tels];
        raw.phones = telArray
          .map((tel) => {
            const val = tel.valueOf();
            return typeof val === 'string' ? val : String(val);
          })
          .filter(Boolean);
        raw.phone = raw.phones[0];
      }

      // Get emails (EMAIL)
      const emails = card.get('email');
      if (emails) {
        const emailArray = Array.isArray(emails) ? emails : [emails];
        raw.emails = emailArray
          .map((email) => {
            const val = email.valueOf();
            return typeof val === 'string' ? val : String(val);
          })
          .filter(Boolean);
        raw.email = raw.emails[0];
      }

      const normalized = normalizeContact(raw, defaultCountry);
      if (normalized) {
        contacts.push(normalized);
      }
    }
  } catch (error) {
    console.error('Error parsing vCard:', error);
    // Return whatever we managed to parse
  }

  return contacts;
}

/**
 * Auto-detect column mappings from CSV headers.
 */
export function detectCsvColumns(headers: string[]): CsvColumnMapping {
  const mapping: CsvColumnMapping = {};
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  // Name detection
  const namePatterns = ['name', 'full name', 'fullname', 'contact name', 'display name'];
  const firstNamePatterns = ['first name', 'firstname', 'given name', 'first'];
  const lastNamePatterns = ['last name', 'lastname', 'surname', 'family name', 'last'];

  for (let i = 0; i < lowerHeaders.length; i++) {
    const header = lowerHeaders[i];
    const originalHeader = headers[i];

    if (namePatterns.includes(header)) {
      mapping.nameColumn = originalHeader;
    } else if (firstNamePatterns.includes(header)) {
      mapping.firstNameColumn = originalHeader;
    } else if (lastNamePatterns.includes(header)) {
      mapping.lastNameColumn = originalHeader;
    }
  }

  // Phone detection
  const phonePatterns = ['phone', 'mobile', 'cell', 'telephone', 'phone number', 'tel'];
  for (let i = 0; i < lowerHeaders.length; i++) {
    const header = lowerHeaders[i];
    if (phonePatterns.some((p) => header.includes(p))) {
      mapping.phoneColumn = headers[i];
      break;
    }
  }

  // Email detection
  const emailPatterns = ['email', 'e-mail', 'email address'];
  for (let i = 0; i < lowerHeaders.length; i++) {
    const header = lowerHeaders[i];
    if (emailPatterns.some((p) => header.includes(p))) {
      mapping.emailColumn = headers[i];
      break;
    }
  }

  return mapping;
}

/**
 * Parse a CSV file content into importable contacts.
 *
 * @param content - The raw CSV file content
 * @param mapping - Column mapping (auto-detected if not provided)
 * @param defaultCountry - Country code for phone numbers without a country prefix
 * @returns Array of parsed contacts
 */
export function parseCsv(
  content: string,
  mapping?: CsvColumnMapping,
  defaultCountry?: CountryCode
): { contacts: ImportableContact[]; headers: string[]; detectedMapping: CsvColumnMapping } {
  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const headers = result.meta.fields || [];
  const detectedMapping = mapping || detectCsvColumns(headers);
  const contacts: ImportableContact[] = [];

  for (const row of result.data) {
    const raw: RawImportedContact = {
      source: 'csv',
    };

    // Build name from columns
    if (detectedMapping.nameColumn && row[detectedMapping.nameColumn]) {
      raw.name = row[detectedMapping.nameColumn].trim();
    } else if (detectedMapping.firstNameColumn || detectedMapping.lastNameColumn) {
      const firstName = row[detectedMapping.firstNameColumn || '']?.trim() || '';
      const lastName = row[detectedMapping.lastNameColumn || '']?.trim() || '';
      raw.name = `${firstName} ${lastName}`.trim();
    }

    // Get phone
    if (detectedMapping.phoneColumn && row[detectedMapping.phoneColumn]) {
      raw.phone = row[detectedMapping.phoneColumn].trim();
    }

    // Get email
    if (detectedMapping.emailColumn && row[detectedMapping.emailColumn]) {
      raw.email = row[detectedMapping.emailColumn].trim();
    }

    const normalized = normalizeContact(raw, defaultCountry);
    if (normalized) {
      contacts.push(normalized);
    }
  }

  return { contacts, headers, detectedMapping };
}

/**
 * Find duplicates between imported contacts and existing friends.
 * Matches by normalized phone number first, then by email.
 */
export function findDuplicates(
  newContacts: ImportableContact[],
  existingFriends: Friend[]
): DeduplicationResult {
  // Build lookup maps for existing friends
  const phoneMap = new Map<string, Friend>();
  const emailMap = new Map<string, Friend>();

  existingFriends.forEach((friend) => {
    if (friend.phone) {
      // Normalize to digits only for comparison
      const normalized = friend.phone.replace(/\D/g, '');
      if (normalized.length >= 7) {
        phoneMap.set(normalized, friend);
      }
    }
    if (friend.email) {
      emailMap.set(friend.email.toLowerCase(), friend);
    }
  });

  const duplicates: DeduplicationResult['duplicates'] = [];
  const unique: ImportableContact[] = [];

  newContacts.forEach((contact) => {
    let matchedFriend: Friend | undefined;
    let matchedBy: 'phone' | 'email' | 'name' = 'phone';

    // Check phone match first (most reliable)
    if (contact.phone) {
      const normalized = contact.phone.replace(/\D/g, '');
      if (normalized.length >= 7) {
        matchedFriend = phoneMap.get(normalized);
      }
    }

    // Check email match
    if (!matchedFriend && contact.email) {
      matchedFriend = emailMap.get(contact.email.toLowerCase());
      if (matchedFriend) {
        matchedBy = 'email';
      }
    }

    if (matchedFriend) {
      duplicates.push({
        imported: contact,
        existingFriendId: matchedFriend.id,
        existingFriendName: matchedFriend.name,
        matchedBy,
      });
    } else {
      unique.push(contact);
    }
  });

  return { unique, duplicates };
}

/**
 * Get the available capacity in the acquainted tier.
 */
export function getAcquaintedCapacity(existingFriends: Friend[]): {
  used: number;
  limit: number;
  available: number;
} {
  const acquaintedCount = existingFriends.filter((f) => f.tier === 'acquainted').length;
  const limit = TIER_LIMITS.acquainted;

  return {
    used: acquaintedCount,
    limit,
    available: Math.max(0, limit - acquaintedCount),
  };
}

/**
 * Validate a phone number and return normalized E.164 format.
 */
export function validateAndNormalizePhone(phone: string): {
  isValid: boolean;
  normalized: string | null;
} {
  const isValid = validatePhone(phone);
  const normalized = normalizePhone(phone);

  return {
    isValid,
    normalized,
  };
}

/**
 * Create Friend objects from imported contacts (for acquainted tier).
 */
export function createFriendsFromContacts(
  contacts: ImportableContact[]
): Array<Omit<Friend, 'id' | 'addedAt'>> {
  return contacts.map((contact) => ({
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    tier: 'acquainted' as const,
  }));
}

/**
 * Perform the actual import of contacts as friends.
 * Returns a result object with counts.
 */
export function importContacts(
  contacts: ImportableContact[],
  addFriend: (friend: Omit<Friend, 'id' | 'addedAt'>) => { success: boolean; error?: string }
): ImportResult {
  const result: ImportResult = {
    success: true,
    imported: 0,
    skipped: 0,
    updated: 0,
    errors: [],
  };

  for (const contact of contacts) {
    const friendData: Omit<Friend, 'id' | 'addedAt'> = {
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      tier: 'acquainted',
    };

    const addResult = addFriend(friendData);
    if (addResult.success) {
      result.imported++;
    } else {
      result.skipped++;
      if (addResult.error) {
        result.errors.push(`${contact.name}: ${addResult.error}`);
      }
    }
  }

  result.success = result.errors.length === 0;
  return result;
}

/**
 * Read a file as text.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Detect file type from extension or MIME type.
 */
export function detectFileType(file: File): 'vcard' | 'csv' | 'unknown' {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (name.endsWith('.vcf') || name.endsWith('.vcard') || type.includes('vcard')) {
    return 'vcard';
  }

  if (name.endsWith('.csv') || type === 'text/csv' || type === 'application/csv') {
    return 'csv';
  }

  return 'unknown';
}

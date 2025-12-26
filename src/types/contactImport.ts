/**
 * Contact Import Types
 *
 * Types for bulk importing contacts from phone, vCard, and CSV sources.
 * All imports go to the "Acquainted Cousins" tier and can be promoted.
 */

import { TierType } from './friend';

/** Source of the imported contact */
export type ImportSource = 'contact_picker' | 'vcard' | 'csv';

/** Tiers that acquainted contacts can be promoted to */
export const PROMOTABLE_TIERS = ['core', 'inner', 'outer', 'naybor', 'rolemodel'] as const;
export type PromotableTier = typeof PROMOTABLE_TIERS[number];

/** Raw contact from any import source before normalization */
export interface RawImportedContact {
  name?: string;
  names?: string[]; // Some sources provide multiple names
  phone?: string;
  phones?: string[]; // Multiple phone numbers
  email?: string;
  emails?: string[]; // Multiple emails
  address?: string;
  source: ImportSource;
}

/** Normalized contact ready for import */
export interface ImportableContact {
  name: string;
  phone?: string; // E.164 format preferred
  email?: string;
  source: ImportSource;
}

/** Result of deduplication check */
export interface DeduplicationResult {
  /** Contacts that don't match any existing friends */
  unique: ImportableContact[];
  /** Contacts that match existing friends, mapped to the matched friend */
  duplicates: Array<{
    imported: ImportableContact;
    existingFriendId: string;
    existingFriendName: string;
    matchedBy: 'phone' | 'email' | 'name';
  }>;
}

/** Options for how to handle duplicates during import */
export type DuplicateStrategy =
  | 'skip'           // Don't import duplicates
  | 'update'         // Update existing friend with imported data
  | 'import_anyway'; // Import as new contact (creates duplicates)

/** Import preview before confirmation */
export interface ImportPreviewData {
  source: ImportSource;
  totalParsed: number;
  uniqueContacts: ImportableContact[];
  duplicates: DeduplicationResult['duplicates'];
  /** How many more contacts can fit in acquainted tier */
  availableCapacity: number;
  /** Whether import would exceed capacity */
  exceedsCapacity: boolean;
}

/** State during import process */
export type ImportState =
  | 'idle'
  | 'selecting'      // User is selecting import source
  | 'parsing'        // Parsing file or fetching contacts
  | 'previewing'     // Showing preview for confirmation
  | 'importing'      // Actually adding to friends
  | 'success'
  | 'error';

/** Result of an import operation */
export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  updated: number;
  errors: string[];
}

/** CSV column mapping for import */
export interface CsvColumnMapping {
  nameColumn?: string;
  firstNameColumn?: string;
  lastNameColumn?: string;
  phoneColumn?: string;
  emailColumn?: string;
}

/** Properties available from Contact Picker API */
export interface ContactPickerContact {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: Array<{
    city?: string;
    country?: string;
    postalCode?: string;
    region?: string;
    streetAddress?: string;
  }>;
  icon?: Blob[];
}

/** Extended Navigator interface for Contact Picker API */
export interface ContactsManager {
  select(
    properties: Array<'name' | 'email' | 'tel' | 'address' | 'icon'>,
    options?: { multiple?: boolean }
  ): Promise<ContactPickerContact[]>;
  getProperties(): Promise<Array<'name' | 'email' | 'tel' | 'address' | 'icon'>>;
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
  interface Window {
    ContactsManager?: unknown;
  }
}

/** Promotion info for moving acquainted contacts to other tiers */
export interface PromotionInfo {
  targetTier: PromotableTier;
  tierName: string;
  available: number;
  limit: number;
  isFull: boolean;
}

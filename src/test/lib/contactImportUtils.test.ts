import { describe, it, expect, vi } from 'vitest';
import {
  normalizeContact,
  parseVCard,
  parseCsv,
  detectCsvColumns,
  findDuplicates,
  getAcquaintedCapacity,
  validateAndNormalizePhone,
  createFriendsFromContacts,
  importContacts,
  detectFileType,
  readFileAsText,
} from '@/lib/contactImportUtils';
import { ImportableContact, RawImportedContact } from '@/types/contactImport';
import { Friend } from '@/types/friend';

describe('contactImportUtils', () => {
  describe('normalizeContact', () => {
    it('should normalize a contact with all fields', () => {
      const raw: RawImportedContact = {
        name: '  John Doe  ',
        phone: '+1 (555) 123-4567',
        email: '  JOHN@EXAMPLE.COM  ',
        source: 'vcard',
      };

      const result = normalizeContact(raw);

      expect(result).toEqual({
        name: 'John Doe',
        phone: expect.any(String),
        email: 'john@example.com',
        source: 'vcard',
      });
    });

    it('should use first name from names array if name is not provided', () => {
      const raw: RawImportedContact = {
        names: ['Jane Smith', 'Jane S.'],
        source: 'contact_picker',
      };

      const result = normalizeContact(raw);

      expect(result?.name).toBe('Jane Smith');
    });

    it('should return null if no name is provided', () => {
      const raw: RawImportedContact = {
        phone: '555-1234',
        source: 'csv',
      };

      const result = normalizeContact(raw);

      expect(result).toBeNull();
    });

    it('should return null if name is empty string', () => {
      const raw: RawImportedContact = {
        name: '   ',
        phone: '555-1234',
        source: 'csv',
      };

      const result = normalizeContact(raw);

      expect(result).toBeNull();
    });

    it('should handle contact with only name', () => {
      const raw: RawImportedContact = {
        name: 'Alice',
        source: 'vcard',
      };

      const result = normalizeContact(raw);

      expect(result).toEqual({
        name: 'Alice',
        phone: undefined,
        email: undefined,
        source: 'vcard',
      });
    });

    it('should use first phone from phones array', () => {
      const raw: RawImportedContact = {
        name: 'Bob',
        phones: ['+1-555-111-2222', '+1-555-333-4444'],
        source: 'vcard',
      };

      const result = normalizeContact(raw);

      expect(result?.phone).toBeDefined();
    });

    it('should use first email from emails array', () => {
      const raw: RawImportedContact = {
        name: 'Carol',
        emails: ['work@example.com', 'personal@example.com'],
        source: 'vcard',
      };

      const result = normalizeContact(raw);

      expect(result?.email).toBe('work@example.com');
    });
  });

  describe('parseVCard', () => {
    it('should parse a simple vCard', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+15551234567
EMAIL:john@example.com
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
      expect(result[0].email).toBe('john@example.com');
      expect(result[0].source).toBe('vcard');
    });

    it('should parse multiple vCards from a single file', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+15551234567
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:Jane Smith
EMAIL:jane@example.com
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Smith');
    });

    it('should handle vCard with structured name (N) when FN is missing', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
N:Smith;Jane;;;
TEL:+15559876543
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Jane Smith');
    });

    it('should handle vCard with multiple phone numbers', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Multi Phone
TEL;TYPE=CELL:+15551111111
TEL;TYPE=HOME:+15552222222
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(1);
      expect(result[0].phone).toBeDefined();
    });

    it('should handle vCard with multiple emails', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Multi Email
EMAIL;TYPE=WORK:work@example.com
EMAIL;TYPE=HOME:home@example.com
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBeDefined();
    });

    it('should skip vCards without names', () => {
      const vcardContent = `BEGIN:VCARD
VERSION:3.0
TEL:+15551234567
END:VCARD`;

      const result = parseVCard(vcardContent);

      expect(result).toHaveLength(0);
    });

    it('should handle empty vCard content', () => {
      const result = parseVCard('');

      expect(result).toHaveLength(0);
    });

    it('should handle invalid vCard content gracefully', () => {
      const result = parseVCard('not a valid vcard');

      expect(result).toHaveLength(0);
    });
  });

  describe('detectCsvColumns', () => {
    it('should detect name column', () => {
      const headers = ['Name', 'Phone', 'Email'];
      const mapping = detectCsvColumns(headers);

      expect(mapping.nameColumn).toBe('Name');
    });

    it('should detect first and last name columns', () => {
      const headers = ['First Name', 'Last Name', 'Phone'];
      const mapping = detectCsvColumns(headers);

      expect(mapping.firstNameColumn).toBe('First Name');
      expect(mapping.lastNameColumn).toBe('Last Name');
    });

    it('should detect phone column with various naming', () => {
      const testCases = [
        ['Mobile', 'Name'],
        ['Cell Phone', 'Name'],
        ['Telephone', 'Name'],
        ['Phone Number', 'Name'],
      ];

      testCases.forEach(([headers]) => {
        const mapping = detectCsvColumns(headers.split(',').map((h) => h.trim()));
        expect(mapping.phoneColumn).toBeDefined();
      });
    });

    it('should detect email column', () => {
      const headers = ['Name', 'E-mail'];
      const mapping = detectCsvColumns(headers);

      expect(mapping.emailColumn).toBe('E-mail');
    });

    it('should be case-insensitive', () => {
      const headers = ['NAME', 'PHONE', 'EMAIL'];
      const mapping = detectCsvColumns(headers);

      expect(mapping.nameColumn).toBe('NAME');
      expect(mapping.phoneColumn).toBe('PHONE');
      expect(mapping.emailColumn).toBe('EMAIL');
    });

    it('should handle headers with whitespace', () => {
      const headers = ['  Name  ', '  Phone  '];
      const mapping = detectCsvColumns(headers);

      expect(mapping.nameColumn).toBe('  Name  ');
    });
  });

  describe('parseCsv', () => {
    it('should parse a simple CSV', () => {
      const csvContent = `Name,Phone,Email
John Doe,+15551234567,john@example.com
Jane Smith,+15559876543,jane@example.com`;

      const { contacts } = parseCsv(csvContent);

      expect(contacts).toHaveLength(2);
      expect(contacts[0].name).toBe('John Doe');
      expect(contacts[1].name).toBe('Jane Smith');
      expect(contacts[0].source).toBe('csv');
    });

    it('should combine first and last name columns', () => {
      const csvContent = `First Name,Last Name,Phone
John,Doe,+15551234567
Jane,Smith,+15559876543`;

      const { contacts } = parseCsv(csvContent);

      expect(contacts[0].name).toBe('John Doe');
      expect(contacts[1].name).toBe('Jane Smith');
    });

    it('should skip rows without names', () => {
      const csvContent = `Name,Phone
,+15551234567
Jane,+15559876543`;

      const { contacts } = parseCsv(csvContent);

      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe('Jane');
    });

    it('should return detected column mapping', () => {
      const csvContent = `Full Name,Mobile,E-mail
John Doe,555-1234,john@test.com`;

      const { detectedMapping } = parseCsv(csvContent);

      expect(detectedMapping.nameColumn).toBe('Full Name');
      expect(detectedMapping.phoneColumn).toBe('Mobile');
      expect(detectedMapping.emailColumn).toBe('E-mail');
    });

    it('should accept custom column mapping', () => {
      const csvContent = `Person,Contact Number,Mail
John Doe,555-1234,john@test.com`;

      const customMapping = {
        nameColumn: 'Person',
        phoneColumn: 'Contact Number',
        emailColumn: 'Mail',
      };

      const { contacts } = parseCsv(csvContent, customMapping);

      expect(contacts[0].name).toBe('John Doe');
      expect(contacts[0].phone).toBeDefined();
      expect(contacts[0].email).toBe('john@test.com');
    });

    it('should handle empty CSV', () => {
      const { contacts } = parseCsv('Name,Phone\n');

      expect(contacts).toHaveLength(0);
    });

    it('should handle CSV with only headers', () => {
      const { contacts, headers } = parseCsv('Name,Phone,Email');

      expect(contacts).toHaveLength(0);
      expect(headers).toEqual(['Name', 'Phone', 'Email']);
    });
  });

  describe('findDuplicates', () => {
    const existingFriends: Friend[] = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+15551234567',
        email: 'john@example.com',
        tier: 'core',
        addedAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+15559876543',
        tier: 'inner',
        addedAt: new Date(),
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        tier: 'outer',
        addedAt: new Date(),
      },
    ];

    it('should identify duplicates by phone number', () => {
      const newContacts: ImportableContact[] = [
        { name: 'Johnny D', phone: '+15551234567', source: 'vcard' },
      ];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.unique).toHaveLength(0);
      expect(result.duplicates).toHaveLength(1);
      expect(result.duplicates[0].matchedBy).toBe('phone');
      expect(result.duplicates[0].existingFriendName).toBe('John Doe');
    });

    it('should identify duplicates by email', () => {
      const newContacts: ImportableContact[] = [
        { name: 'Robert W', email: 'BOB@EXAMPLE.COM', source: 'csv' },
      ];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.unique).toHaveLength(0);
      expect(result.duplicates).toHaveLength(1);
      expect(result.duplicates[0].matchedBy).toBe('email');
      expect(result.duplicates[0].existingFriendName).toBe('Bob Wilson');
    });

    it('should prioritize phone match over email', () => {
      const newContacts: ImportableContact[] = [
        {
          name: 'John D',
          phone: '+15551234567',
          email: 'different@example.com',
          source: 'vcard',
        },
      ];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.duplicates[0].matchedBy).toBe('phone');
    });

    it('should identify unique contacts', () => {
      const newContacts: ImportableContact[] = [
        { name: 'New Person', phone: '+15550000000', source: 'csv' },
        { name: 'Another New', email: 'new@example.com', source: 'csv' },
      ];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.unique).toHaveLength(2);
      expect(result.duplicates).toHaveLength(0);
    });

    it('should handle contacts without phone or email', () => {
      const newContacts: ImportableContact[] = [{ name: 'No Contact Info', source: 'vcard' }];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.unique).toHaveLength(1);
    });

    it('should normalize phone numbers for comparison', () => {
      // The phone in existingFriends is +15551234567
      // This should match when normalized (removing non-digits)
      const newContacts: ImportableContact[] = [
        { name: 'Different Format', phone: '1-555-123-4567', source: 'csv' },
      ];

      const result = findDuplicates(newContacts, existingFriends);

      expect(result.duplicates).toHaveLength(1);
      expect(result.duplicates[0].existingFriendName).toBe('John Doe');
    });

    it('should handle empty existing friends', () => {
      const newContacts: ImportableContact[] = [
        { name: 'New Person', phone: '+15551234567', source: 'vcard' },
      ];

      const result = findDuplicates(newContacts, []);

      expect(result.unique).toHaveLength(1);
      expect(result.duplicates).toHaveLength(0);
    });

    it('should handle empty new contacts', () => {
      const result = findDuplicates([], existingFriends);

      expect(result.unique).toHaveLength(0);
      expect(result.duplicates).toHaveLength(0);
    });
  });

  describe('getAcquaintedCapacity', () => {
    it('should calculate capacity correctly', () => {
      const friends: Friend[] = [
        { id: '1', name: 'A', tier: 'acquainted', addedAt: new Date() },
        { id: '2', name: 'B', tier: 'acquainted', addedAt: new Date() },
        { id: '3', name: 'C', tier: 'core', addedAt: new Date() },
      ];

      const result = getAcquaintedCapacity(friends);

      expect(result.used).toBe(2);
      expect(result.limit).toBe(1000);
      expect(result.available).toBe(998);
    });

    it('should handle empty friends list', () => {
      const result = getAcquaintedCapacity([]);

      expect(result.used).toBe(0);
      expect(result.available).toBe(1000);
    });

    it('should return 0 available when at capacity', () => {
      const friends: Friend[] = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        name: `Friend ${i}`,
        tier: 'acquainted' as const,
        addedAt: new Date(),
      }));

      const result = getAcquaintedCapacity(friends);

      expect(result.available).toBe(0);
    });
  });

  describe('validateAndNormalizePhone', () => {
    it('should normalize a valid US phone number', () => {
      // Use proper E.164 format
      const result = validateAndNormalizePhone('+12025551234');

      expect(result.normalized).toBeDefined();
    });

    it('should handle invalid phone numbers', () => {
      const result = validateAndNormalizePhone('not-a-phone');

      expect(result.isValid).toBe(false);
    });

    it('should normalize international format', () => {
      const result = validateAndNormalizePhone('+442071234567');

      expect(result.normalized).toBeDefined();
    });
  });

  describe('createFriendsFromContacts', () => {
    it('should create friend objects with acquainted tier', () => {
      const contacts: ImportableContact[] = [
        { name: 'John', phone: '+15551234567', email: 'john@test.com', source: 'vcard' },
        { name: 'Jane', source: 'csv' },
      ];

      const friends = createFriendsFromContacts(contacts);

      expect(friends).toHaveLength(2);
      expect(friends[0]).toEqual({
        name: 'John',
        phone: '+15551234567',
        email: 'john@test.com',
        tier: 'acquainted',
      });
      expect(friends[1]).toEqual({
        name: 'Jane',
        phone: undefined,
        email: undefined,
        tier: 'acquainted',
      });
    });
  });

  describe('importContacts', () => {
    it('should import contacts successfully', () => {
      const contacts: ImportableContact[] = [
        { name: 'John', source: 'vcard' },
        { name: 'Jane', source: 'csv' },
      ];

      const addFriend = vi.fn().mockReturnValue({ success: true });

      const result = importContacts(contacts, addFriend);

      expect(addFriend).toHaveBeenCalledTimes(2);
      expect(result.imported).toBe(2);
      expect(result.skipped).toBe(0);
      expect(result.success).toBe(true);
    });

    it('should handle failed imports', () => {
      const contacts: ImportableContact[] = [
        { name: 'John', source: 'vcard' },
        { name: 'Jane', source: 'csv' },
      ];

      const addFriend = vi.fn().mockReturnValue({ success: false, error: 'Tier full' });

      const result = importContacts(contacts, addFriend);

      expect(result.imported).toBe(0);
      expect(result.skipped).toBe(2);
      expect(result.errors).toHaveLength(2);
      expect(result.success).toBe(false);
    });

    it('should handle mixed success/failure', () => {
      const contacts: ImportableContact[] = [
        { name: 'John', source: 'vcard' },
        { name: 'Jane', source: 'csv' },
      ];

      const addFriend = vi
        .fn()
        .mockReturnValueOnce({ success: true })
        .mockReturnValueOnce({ success: false, error: 'Error' });

      const result = importContacts(contacts, addFriend);

      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(1);
    });
  });

  describe('detectFileType', () => {
    it('should detect vCard files by extension', () => {
      const file = new File([''], 'contacts.vcf', { type: '' });
      expect(detectFileType(file)).toBe('vcard');
    });

    it('should detect vCard files by .vcard extension', () => {
      const file = new File([''], 'contacts.vcard', { type: '' });
      expect(detectFileType(file)).toBe('vcard');
    });

    it('should detect CSV files by extension', () => {
      const file = new File([''], 'contacts.csv', { type: '' });
      expect(detectFileType(file)).toBe('csv');
    });

    it('should detect CSV files by MIME type', () => {
      const file = new File([''], 'data', { type: 'text/csv' });
      expect(detectFileType(file)).toBe('csv');
    });

    it('should return unknown for unrecognized files', () => {
      const file = new File([''], 'contacts.txt', { type: 'text/plain' });
      expect(detectFileType(file)).toBe('unknown');
    });
  });

  describe('readFileAsText', () => {
    it('should read file content as text', async () => {
      const content = 'Hello, World!';
      const file = new File([content], 'test.txt', { type: 'text/plain' });

      const result = await readFileAsText(file);

      expect(result).toBe(content);
    });

    it('should read unicode content correctly', async () => {
      const content = 'Hello, 世界! 🌍';
      const file = new File([content], 'test.txt', { type: 'text/plain' });

      const result = await readFileAsText(file);

      expect(result).toBe(content);
    });
  });
});

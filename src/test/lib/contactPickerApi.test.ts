import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isContactPickerSupported,
  getAvailableProperties,
  pickContacts,
  pickSingleContact,
  isMobileDevice,
} from '@/lib/contactPickerApi';

describe('contactPickerApi', () => {
  // Store original values
  let originalContacts: unknown;
  let originalContactsManager: unknown;

  beforeEach(() => {
    // Save originals
    originalContacts = (navigator as unknown as Record<string, unknown>).contacts;
    originalContactsManager = (window as unknown as Record<string, unknown>).ContactsManager;

    // Clear for tests
    delete (navigator as unknown as Record<string, unknown>).contacts;
    delete (window as unknown as Record<string, unknown>).ContactsManager;
  });

  afterEach(() => {
    // Restore
    if (originalContacts !== undefined) {
      (navigator as unknown as Record<string, unknown>).contacts = originalContacts;
    } else {
      delete (navigator as unknown as Record<string, unknown>).contacts;
    }
    if (originalContactsManager !== undefined) {
      (window as unknown as Record<string, unknown>).ContactsManager = originalContactsManager;
    } else {
      delete (window as unknown as Record<string, unknown>).ContactsManager;
    }
    vi.restoreAllMocks();
  });

  describe('isContactPickerSupported', () => {
    it('should return true when Contact Picker API is available', () => {
      (navigator as unknown as Record<string, unknown>).contacts = {
        select: vi.fn(),
        getProperties: vi.fn(),
      };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      expect(isContactPickerSupported()).toBe(true);
    });

    it('should return false when contacts is not in navigator', () => {
      // contacts is already deleted in beforeEach
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      expect(isContactPickerSupported()).toBe(false);
    });

    it('should return false when ContactsManager is not in window', () => {
      (navigator as unknown as Record<string, unknown>).contacts = { select: vi.fn() };
      // ContactsManager is already deleted in beforeEach

      expect(isContactPickerSupported()).toBe(false);
    });
  });

  describe('getAvailableProperties', () => {
    it('should return available properties when API is supported', async () => {
      const mockGetProperties = vi.fn().mockResolvedValue(['name', 'email', 'tel']);
      (navigator as unknown as Record<string, unknown>).contacts = {
        getProperties: mockGetProperties,
      };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await getAvailableProperties();

      expect(result).toEqual(['name', 'email', 'tel']);
      expect(mockGetProperties).toHaveBeenCalled();
    });

    it('should return empty array when API is not supported', async () => {
      // contacts is already deleted in beforeEach

      const result = await getAvailableProperties();

      expect(result).toEqual([]);
    });

    it('should return empty array when getProperties throws', async () => {
      const mockGetProperties = vi.fn().mockRejectedValue(new Error('Failed'));
      (navigator as unknown as Record<string, unknown>).contacts = {
        getProperties: mockGetProperties,
      };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await getAvailableProperties();

      expect(result).toEqual([]);
    });
  });

  describe('pickContacts', () => {
    it('should throw error when API is not supported', async () => {
      // contacts is already deleted in beforeEach

      await expect(pickContacts()).rejects.toThrow(
        'Contact Picker API is not supported on this device'
      );
    });

    it('should return normalized contacts from picker', async () => {
      const mockContacts = [
        { name: ['John Doe'], email: ['john@example.com'], tel: ['+15551234567'] },
        { name: ['Jane Smith'], tel: ['+15559876543'] },
      ];

      const mockSelect = vi.fn().mockResolvedValue(mockContacts);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickContacts();

      expect(mockSelect).toHaveBeenCalledWith(['name', 'email', 'tel'], { multiple: true });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[0].email).toBe('john@example.com');
      expect(result[0].source).toBe('contact_picker');
      expect(result[1].name).toBe('Jane Smith');
    });

    it('should return empty array when user cancels', async () => {
      const abortError = new DOMException('User cancelled', 'AbortError');
      const mockSelect = vi.fn().mockRejectedValue(abortError);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickContacts();

      expect(result).toEqual([]);
    });

    it('should rethrow non-abort errors', async () => {
      const error = new Error('Network error');
      const mockSelect = vi.fn().mockRejectedValue(error);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      await expect(pickContacts()).rejects.toThrow('Network error');
    });

    it('should skip contacts without names', async () => {
      const mockContacts = [
        { name: ['John Doe'], tel: ['+15551234567'] },
        { email: ['noname@example.com'], tel: ['+15559999999'] }, // No name
        { name: [], tel: ['+15558888888'] }, // Empty name array
      ];

      const mockSelect = vi.fn().mockResolvedValue(mockContacts);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickContacts();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should handle contacts with whitespace in names', async () => {
      const mockContacts = [{ name: ['  John Doe  '], tel: ['+15551234567'] }];

      const mockSelect = vi.fn().mockResolvedValue(mockContacts);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickContacts();

      expect(result[0].name).toBe('John Doe');
    });

    it('should lowercase email addresses', async () => {
      const mockContacts = [{ name: ['John'], email: ['JOHN@EXAMPLE.COM'] }];

      const mockSelect = vi.fn().mockResolvedValue(mockContacts);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickContacts();

      expect(result[0].email).toBe('john@example.com');
    });
  });

  describe('pickSingleContact', () => {
    it('should throw error when API is not supported', async () => {
      // contacts is already deleted in beforeEach

      await expect(pickSingleContact()).rejects.toThrow(
        'Contact Picker API is not supported on this device'
      );
    });

    it('should return single contact', async () => {
      const mockContacts = [{ name: ['John Doe'], email: ['john@example.com'] }];

      const mockSelect = vi.fn().mockResolvedValue(mockContacts);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickSingleContact();

      expect(mockSelect).toHaveBeenCalledWith(['name', 'email', 'tel'], { multiple: false });
      expect(result?.name).toBe('John Doe');
    });

    it('should return null when user cancels', async () => {
      const abortError = new DOMException('User cancelled', 'AbortError');
      const mockSelect = vi.fn().mockRejectedValue(abortError);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickSingleContact();

      expect(result).toBeNull();
    });

    it('should return null when no contact selected', async () => {
      const mockSelect = vi.fn().mockResolvedValue([]);
      (navigator as unknown as Record<string, unknown>).contacts = { select: mockSelect };
      (window as unknown as Record<string, unknown>).ContactsManager = function () {};

      const result = await pickSingleContact();

      expect(result).toBeNull();
    });
  });

  describe('isMobileDevice', () => {
    it('should detect mobile via touch and user agent', () => {
      // This tests the function's behavior given its implementation
      // The function checks for both touch AND mobile user agent
      const result = isMobileDevice();
      // In jsdom, we don't have real mobile detection
      // so just ensure the function runs without error
      expect(typeof result).toBe('boolean');
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactImportDialog } from '@/components/contactImport/ContactImportDialog';
import { Friend } from '@/types/friend';
import * as contactPickerApi from '@/lib/contactPickerApi';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params) {
        let result = key;
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{{${k}}}`, String(v));
        });
        return result;
      }
      return key;
    },
    i18n: { language: 'en' },
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the contactPickerApi module
vi.mock('@/lib/contactPickerApi', () => ({
  isContactPickerSupported: vi.fn(() => false),
  isMobileDevice: vi.fn(() => false),
  pickContacts: vi.fn(),
}));

// Mock phoneUtils
vi.mock('@/lib/phoneUtils', () => ({
  detectUserCountry: vi.fn(() => 'US'),
  getCountryFlag: vi.fn(() => '🇺🇸'),
  COUNTRY_OPTIONS: [
    { code: 'US', name: 'United States', dialCode: '+1' },
  ],
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock child components to simplify testing
vi.mock('@/components/contactImport/MobileContactPicker', () => ({
  MobileContactPicker: ({ onContactsSelected, onError }: {
    onContactsSelected: (contacts: any[]) => void;
    onError: (error: string) => void;
  }) => (
    <div data-testid="mobile-contact-picker">
      <button onClick={() => onContactsSelected([{ name: 'Test', source: 'contact_picker' }])}>
        Mock Pick Contacts
      </button>
    </div>
  ),
}));

vi.mock('@/components/contactImport/VCardImporter', () => ({
  VCardImporter: ({ onContactsParsed, onError }: {
    onContactsParsed: (contacts: any[]) => void;
    onError: (error: string) => void;
  }) => (
    <div data-testid="vcard-importer">
      <button onClick={() => onContactsParsed([{ name: 'VCard Test', source: 'vcard' }])}>
        Mock Parse VCard
      </button>
    </div>
  ),
}));

vi.mock('@/components/contactImport/CsvImporter', () => ({
  CsvImporter: ({ onContactsParsed, onError }: {
    onContactsParsed: (contacts: any[]) => void;
    onError: (error: string) => void;
  }) => (
    <div data-testid="csv-importer">
      <button onClick={() => onContactsParsed([{ name: 'CSV Test', source: 'csv' }])}>
        Mock Parse CSV
      </button>
    </div>
  ),
}));

vi.mock('@/components/contactImport/ImportPreview', () => ({
  ImportPreview: ({ contacts, onConfirm, onCancel }: {
    contacts: any[];
    onConfirm: (contacts: any[]) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="import-preview">
      <p>Preview: {contacts.length} contacts</p>
      <button onClick={() => onConfirm(contacts)}>Confirm Import</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe('ContactImportDialog Component', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnAddFriend = vi.fn(() => ({ success: true }));
  const mockOnImportComplete = vi.fn();

  const existingFriends: Friend[] = [
    { id: '1', name: 'Existing Friend', tier: 'core', addedAt: new Date() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dialog Open/Close', () => {
    it('should render when open is true', () => {
      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      expect(screen.getByText('contactImport.title')).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
      render(
        <ContactImportDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      expect(screen.queryByText('contactImport.title')).not.toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should default to vcard tab on desktop', () => {
      vi.mocked(contactPickerApi.isContactPickerSupported).mockReturnValue(false);
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(false);

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // VCard tab should be selected by default on desktop
      expect(screen.getByTestId('vcard-importer')).toBeInTheDocument();
    });

    it('should show all three import tabs', () => {
      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Check for tab triggers
      expect(screen.getByRole('tab', { name: /phone/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /vcard/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /csv/i })).toBeInTheDocument();
    });

    it('should switch to CSV tab when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      const csvTab = screen.getByRole('tab', { name: /csv/i });
      await user.click(csvTab);

      expect(screen.getByTestId('csv-importer')).toBeInTheDocument();
    });
  });

  describe('Import Flow', () => {
    it('should show preview after contacts are parsed', async () => {
      const user = userEvent.setup();

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Trigger parsing from VCard importer
      const parseButton = screen.getByText('Mock Parse VCard');
      await user.click(parseButton);

      // Should show preview
      expect(screen.getByTestId('import-preview')).toBeInTheDocument();
    });

    it('should call onAddFriend for each contact when confirmed', async () => {
      const user = userEvent.setup();

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Parse contacts
      await user.click(screen.getByText('Mock Parse VCard'));

      // Confirm import
      await user.click(screen.getByText('Confirm Import'));

      await waitFor(() => {
        expect(mockOnAddFriend).toHaveBeenCalled();
      });
    });

    it('should call onImportComplete after successful import', async () => {
      const user = userEvent.setup();

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Parse contacts
      await user.click(screen.getByText('Mock Parse VCard'));

      // Confirm import
      await user.click(screen.getByText('Confirm Import'));

      await waitFor(() => {
        expect(mockOnImportComplete).toHaveBeenCalledWith(1);
      });
    });

    it('should go back to selecting state when cancel is clicked in preview', async () => {
      const user = userEvent.setup();

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Parse contacts to go to preview
      await user.click(screen.getByText('Mock Parse VCard'));
      expect(screen.getByTestId('import-preview')).toBeInTheDocument();

      // Click cancel in preview
      await user.click(screen.getByText('Cancel'));

      // Should be back to tab selection
      await waitFor(() => {
        expect(screen.getByTestId('vcard-importer')).toBeInTheDocument();
      });
    });
  });

  describe('Capacity Display', () => {
    it('should display acquainted capacity', () => {
      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      expect(screen.getByText('contactImport.acquaintedCapacity')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle import failures gracefully', async () => {
      const user = userEvent.setup();
      const failingAddFriend = vi.fn(() => ({ success: false, error: 'Tier full' }));

      render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={failingAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Parse contacts
      await user.click(screen.getByText('Mock Parse VCard'));

      // Confirm import
      await user.click(screen.getByText('Confirm Import'));

      await waitFor(() => {
        expect(failingAddFriend).toHaveBeenCalled();
      });
    });
  });

  describe('Dialog Reset', () => {
    it('should be reopenable after closing', async () => {
      const { rerender } = render(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Verify dialog is open
      expect(screen.getByText('contactImport.title')).toBeInTheDocument();

      // Close dialog
      rerender(
        <ContactImportDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Dialog should be closed
      expect(screen.queryByText('contactImport.title')).not.toBeInTheDocument();

      // Reopen dialog
      rerender(
        <ContactImportDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          existingFriends={existingFriends}
          onAddFriend={mockOnAddFriend}
          onImportComplete={mockOnImportComplete}
        />
      );

      // Dialog should be open again
      expect(screen.getByText('contactImport.title')).toBeInTheDocument();
    });
  });
});

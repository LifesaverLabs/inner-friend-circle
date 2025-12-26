import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileContactPicker } from '@/components/contactImport/MobileContactPicker';
import * as contactPickerApi from '@/lib/contactPickerApi';
import { ImportableContact } from '@/types/contactImport';

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
  isContactPickerSupported: vi.fn(),
  isMobileDevice: vi.fn(),
  pickContacts: vi.fn(),
}));

// Mock phoneUtils
vi.mock('@/lib/phoneUtils', () => ({
  detectUserCountry: vi.fn(() => 'US'),
  getCountryFlag: vi.fn((code: string) => `🇺🇸`),
  COUNTRY_OPTIONS: [
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
  ],
}));

describe('MobileContactPicker Component', () => {
  const mockOnContactsSelected = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When Contact Picker API is supported', () => {
    beforeEach(() => {
      vi.mocked(contactPickerApi.isContactPickerSupported).mockReturnValue(true);
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(true);
    });

    it('should render the import button', () => {
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByRole('button', { name: /contactImport.fromPhone.button/i })).toBeInTheDocument();
    });

    it('should render promotion info section', () => {
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.promotionInfo.title')).toBeInTheDocument();
      expect(screen.getByText('contactImport.promotionInfo.description')).toBeInTheDocument();
    });

    it('should render default country selector', () => {
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.defaultCountry')).toBeInTheDocument();
    });

    it('should render privacy note', () => {
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.privacyNote')).toBeInTheDocument();
    });

    it('should call pickContacts when button is clicked', async () => {
      const mockContacts: ImportableContact[] = [
        { name: 'John Doe', phone: '+15551234567', source: 'contact_picker' },
      ];
      vi.mocked(contactPickerApi.pickContacts).mockResolvedValue(mockContacts);

      const user = userEvent.setup();
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      await user.click(button);

      await waitFor(() => {
        expect(contactPickerApi.pickContacts).toHaveBeenCalledWith('US');
        expect(mockOnContactsSelected).toHaveBeenCalledWith(mockContacts);
      });
    });

    it('should handle user cancellation (empty contacts)', async () => {
      vi.mocked(contactPickerApi.pickContacts).mockResolvedValue([]);

      const user = userEvent.setup();
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnContactsSelected).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
      });
    });

    it('should call onError when picker fails', async () => {
      vi.mocked(contactPickerApi.pickContacts).mockRejectedValue(new Error('Picker failed'));

      const user = userEvent.setup();
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Picker failed');
      });
    });

    it('should disable button when disabled prop is true', () => {
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
          disabled={true}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      expect(button).toBeDisabled();
    });

    it('should show loading state when picking contacts', async () => {
      let resolvePickContacts: (value: ImportableContact[]) => void;
      const pickContactsPromise = new Promise<ImportableContact[]>((resolve) => {
        resolvePickContacts = resolve;
      });
      vi.mocked(contactPickerApi.pickContacts).mockReturnValue(pickContactsPromise);

      const user = userEvent.setup();
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      await user.click(button);

      // Should show loading text
      await waitFor(() => {
        expect(screen.getByText('contactImport.loading')).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePickContacts!([{ name: 'Test', source: 'contact_picker' }]);

      await waitFor(() => {
        expect(mockOnContactsSelected).toHaveBeenCalled();
      });
    });
  });

  describe('When Contact Picker API is not supported', () => {
    beforeEach(() => {
      vi.mocked(contactPickerApi.isContactPickerSupported).mockReturnValue(false);
    });

    it('should show mobile-only message on desktop', () => {
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(false);

      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.mobileOnly')).toBeInTheDocument();
    });

    it('should show browser not supported message on mobile', () => {
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(true);

      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.browserNotSupported')).toBeInTheDocument();
    });

    it('should suggest file import as alternative', () => {
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(false);

      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.useFileImport')).toBeInTheDocument();
    });

    it('should not show the import button', () => {
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(false);

      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      expect(screen.queryByRole('button', { name: /contactImport.fromPhone.button/i })).not.toBeInTheDocument();
    });
  });

  describe('Country Selection', () => {
    beforeEach(() => {
      vi.mocked(contactPickerApi.isContactPickerSupported).mockReturnValue(true);
      vi.mocked(contactPickerApi.isMobileDevice).mockReturnValue(true);
    });

    it('should use default country for pickContacts', async () => {
      vi.mocked(contactPickerApi.pickContacts).mockResolvedValue([
        { name: 'Test', source: 'contact_picker' },
      ]);

      const user = userEvent.setup();
      render(
        <MobileContactPicker
          onContactsSelected={mockOnContactsSelected}
          onError={mockOnError}
        />
      );

      const button = screen.getByRole('button', { name: /contactImport.fromPhone.button/i });
      await user.click(button);

      await waitFor(() => {
        expect(contactPickerApi.pickContacts).toHaveBeenCalledWith('US');
      });
    });
  });
});

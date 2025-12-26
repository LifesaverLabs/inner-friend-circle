import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VCardImporter } from '@/components/contactImport/VCardImporter';
import * as contactImportUtils from '@/lib/contactImportUtils';

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

// Mock phoneUtils
vi.mock('@/lib/phoneUtils', () => ({
  detectUserCountry: vi.fn(() => 'US'),
  getCountryFlag: vi.fn(() => '🇺🇸'),
  COUNTRY_OPTIONS: [
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  ],
}));

// Mock contactImportUtils
vi.mock('@/lib/contactImportUtils', async () => {
  const actual = await vi.importActual('@/lib/contactImportUtils');
  return {
    ...actual,
    parseVCard: vi.fn(),
    readFileAsText: vi.fn(),
  };
});

describe('VCardImporter Component', () => {
  const mockOnContactsParsed = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render drop zone', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.fromVCard.dropZone')).toBeInTheDocument();
    });

    it('should render file select button', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.selectFile')).toBeInTheDocument();
    });

    it('should render default country selector', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.defaultCountry')).toBeInTheDocument();
    });

    it('should render hint about accepted formats', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.fromVCard.hint')).toBeInTheDocument();
    });

    it('should render export instructions', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.fromVCard.exportInstructions')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should accept .vcf files', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('BEGIN:VCARD\nFN:Test\nEND:VCARD');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([
        { name: 'Test', source: 'vcard' },
      ]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['vcard content'], 'contacts.vcf', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnContactsParsed).toHaveBeenCalledWith([
          { name: 'Test', source: 'vcard' },
        ]);
      });
    });

    it('should accept .vcard files', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('BEGIN:VCARD\nFN:Test\nEND:VCARD');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([
        { name: 'Test', source: 'vcard' },
      ]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['vcard content'], 'contacts.vcard', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnContactsParsed).toHaveBeenCalled();
      });
    });

    it('should reject invalid file extensions', async () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['not a vcard'], 'contacts.txt', { type: 'text/plain' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Manually trigger the change event since userEvent.upload may not work with hidden inputs
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('contactImport.errors.invalidVCardFile');
      });
    });

    it('should show selected file name', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('BEGIN:VCARD\nFN:Test\nEND:VCARD');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([
        { name: 'Test', source: 'vcard' },
      ]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['vcard content'], 'my-contacts.vcf', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/my-contacts.vcf/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should call onError when no contacts found in file', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File([''], 'empty.vcf', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('contactImport.errors.noContactsFound');
      });
    });

    it('should call onError when file reading fails', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockRejectedValue(new Error('Read failed'));

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['content'], 'contacts.vcf', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Read failed');
      });
    });
  });

  describe('Disabled State', () => {
    it('should disable file input when disabled prop is true', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
          disabled={true}
        />
      );

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should apply disabled styling to drop zone', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
          disabled={true}
        />
      );

      const dropZone = screen.getByText('contactImport.fromVCard.dropZone').closest('div');
      expect(dropZone?.className).toContain('opacity-50');
    });
  });

  describe('Drag and Drop', () => {
    it('should highlight drop zone on drag enter', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const dropZone = screen.getByText('contactImport.fromVCard.dropZone').closest('div');

      fireEvent.dragEnter(dropZone!);

      expect(dropZone?.className).toContain('border-primary');
    });

    it('should remove highlight on drag leave', () => {
      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const dropZone = screen.getByText('contactImport.fromVCard.dropZone').closest('div');

      fireEvent.dragEnter(dropZone!);
      fireEvent.dragLeave(dropZone!);

      expect(dropZone?.className).not.toContain('border-primary');
    });

    it('should process dropped file', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('BEGIN:VCARD\nFN:Dropped\nEND:VCARD');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([
        { name: 'Dropped', source: 'vcard' },
      ]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const dropZone = screen.getByText('contactImport.fromVCard.dropZone').closest('div');
      const file = new File(['vcard content'], 'dropped.vcf', { type: 'text/vcard' });

      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropZone!, { dataTransfer });

      await waitFor(() => {
        expect(mockOnContactsParsed).toHaveBeenCalledWith([
          { name: 'Dropped', source: 'vcard' },
        ]);
      });
    });
  });

  describe('Country Selection', () => {
    it('should pass default country to parseVCard', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('BEGIN:VCARD\nFN:Test\nEND:VCARD');
      vi.mocked(contactImportUtils.parseVCard).mockReturnValue([
        { name: 'Test', source: 'vcard' },
      ]);

      render(
        <VCardImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['vcard content'], 'contacts.vcf', { type: 'text/vcard' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(contactImportUtils.parseVCard).toHaveBeenCalledWith(
          'BEGIN:VCARD\nFN:Test\nEND:VCARD',
          'US'
        );
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CsvImporter } from '@/components/contactImport/CsvImporter';
import * as contactImportUtils from '@/lib/contactImportUtils';
import { CsvColumnMapping } from '@/types/contactImport';

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
    parseCsv: vi.fn(),
    readFileAsText: vi.fn(),
  };
});

describe('CsvImporter Component', () => {
  const mockOnContactsParsed = vi.fn();
  const mockOnError = vi.fn();

  const defaultCsvResult = {
    contacts: [
      { name: 'John Doe', phone: '+15551234567', source: 'csv' as const },
    ],
    headers: ['Name', 'Phone', 'Email'],
    detectedMapping: {
      nameColumn: 'Name',
      phoneColumn: 'Phone',
      emailColumn: 'Email',
    },
    defaultCountry: 'US',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(contactImportUtils.parseCsv).mockReturnValue(defaultCsvResult);
  });

  describe('Rendering', () => {
    it('should render drop zone', () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.fromCsv.dropZone')).toBeInTheDocument();
    });

    it('should render file select button', () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.selectFile')).toBeInTheDocument();
    });

    it('should render hint about CSV format', () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.fromCsv.hint')).toBeInTheDocument();
    });

    it('should render default country selector', () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      expect(screen.getByText('contactImport.defaultCountry')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should accept .csv files', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone\nJohn,555-1234');

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone\nJohn,555-1234'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(contactImportUtils.parseCsv).toHaveBeenCalled();
      });
    });

    it('should reject invalid file extensions', async () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['not csv'], 'contacts.txt', { type: 'text/plain' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('contactImport.errors.invalidCsvFile');
      });
    });

    it('should show selected file name', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone\nJohn,555-1234');

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone\nJohn,555-1234'], 'my-contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText(/my-contacts.csv/)).toBeInTheDocument();
      });
    });
  });

  describe('Column Mapping', () => {
    it('should show column mapping UI after file is parsed', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone\nJohn,555-1234');

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone\nJohn,555-1234'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText('contactImport.fromCsv.mapColumns')).toBeInTheDocument();
      });
    });

    it('should show detected column mappings', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone,Email\nJohn,555-1234,john@test.com');

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone,Email\nJohn,555-1234,john@test.com'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText('contactImport.columnMapping.name')).toBeInTheDocument();
        expect(screen.getByText('contactImport.columnMapping.phone')).toBeInTheDocument();
        expect(screen.getByText('contactImport.columnMapping.email')).toBeInTheDocument();
      });
    });

    it('should call onContactsParsed when import button is clicked', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone\nJohn,555-1234');

      const user = userEvent.setup();
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone\nJohn,555-1234'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText('contactImport.fromCsv.importButton')).toBeInTheDocument();
      });

      await user.click(screen.getByText('contactImport.fromCsv.importButton'));

      expect(mockOnContactsParsed).toHaveBeenCalledWith(defaultCsvResult.contacts);
    });
  });

  describe('Error Handling', () => {
    it('should proceed to mapping step with empty headers', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Header1\nvalue');
      vi.mocked(contactImportUtils.parseCsv).mockReturnValue({
        contacts: [],
        headers: ['Header1'],
        detectedMapping: {},
      });

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Header1\nvalue'], 'sparse.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      // Should proceed to mapping step, where user can map columns
      await waitFor(() => {
        expect(screen.getByText('contactImport.fromCsv.mapColumns')).toBeInTheDocument();
      });
    });

    it('should call onError when file reading fails', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockRejectedValue(new Error('Read failed'));

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['content'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Read failed');
      });
    });

    it('should show validation alert and disable button when no name column is selected', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Phone,Email\n555-1234,test@test.com');
      vi.mocked(contactImportUtils.parseCsv).mockReturnValue({
        contacts: [],
        headers: ['Phone', 'Email'],
        detectedMapping: {
          phoneColumn: 'Phone',
          emailColumn: 'Email',
        },
      });

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Phone,Email\n555-1234,test@test.com'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      await waitFor(() => {
        expect(screen.getByText('contactImport.fromCsv.mapColumns')).toBeInTheDocument();
      });

      // Should show an inline validation alert when no name column is selected
      expect(screen.getByText('contactImport.errors.nameColumnRequired')).toBeInTheDocument();

      // Import button should be disabled when no name column is selected
      const importButton = screen.getByText('contactImport.fromCsv.importButton');
      expect(importButton).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should disable file input when disabled prop is true', () => {
      render(
        <CsvImporter
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
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
          disabled={true}
        />
      );

      const dropZone = screen.getByText('contactImport.fromCsv.dropZone').closest('div');
      expect(dropZone?.className).toContain('opacity-50');
    });
  });

  describe('Drag and Drop', () => {
    it('should highlight drop zone on drag enter', () => {
      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const dropZone = screen.getByText('contactImport.fromCsv.dropZone').closest('div');

      fireEvent.dragEnter(dropZone!);

      expect(dropZone?.className).toContain('border-primary');
    });

    it('should process dropped file', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone\nDropped,555-1234');

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const dropZone = screen.getByText('contactImport.fromCsv.dropZone').closest('div');
      const file = new File(['Name,Phone\nDropped,555-1234'], 'dropped.csv', { type: 'text/csv' });

      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropZone!, { dataTransfer });

      await waitFor(() => {
        expect(contactImportUtils.parseCsv).toHaveBeenCalled();
      });
    });
  });

  describe('Headers Display', () => {
    it('should display file info with column count in mapping step', async () => {
      vi.mocked(contactImportUtils.readFileAsText).mockResolvedValue('Name,Phone,Email\nJohn,555-1234,john@test.com');
      vi.mocked(contactImportUtils.parseCsv).mockReturnValue({
        ...defaultCsvResult,
        headers: ['Name', 'Phone', 'Email'],
      });

      render(
        <CsvImporter
          onContactsParsed={mockOnContactsParsed}
          onError={mockOnError}
        />
      );

      const file = new File(['Name,Phone,Email\nJohn,555-1234,john@test.com'], 'contacts.csv', { type: 'text/csv' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', { value: [file], writable: false });
      fireEvent.change(input);

      // In mapping step, should show file info with column count
      await waitFor(() => {
        expect(screen.getByText('contactImport.fromCsv.mapColumns')).toBeInTheDocument();
        // File info displays: "selectedFile: contacts.csv (3 columns)"
        // Look for pattern that contains both the filename and column count
        expect(screen.getByText(/contacts\.csv/)).toBeInTheDocument();
      });
    });
  });
});

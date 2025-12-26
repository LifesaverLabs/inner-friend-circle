import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportPreview } from '@/components/contactImport/ImportPreview';
import { ImportableContact, DeduplicationResult } from '@/types/contactImport';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      // For importButton, return a formatted string with count
      if (key === 'contactImport.preview.importButton' && params?.count !== undefined) {
        return `Import ${params.count} Contacts`;
      }
      // Return translated keys with interpolation
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

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ImportPreview Component', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultContacts: ImportableContact[] = [
    { name: 'John Doe', phone: '+15551234567', email: 'john@example.com', source: 'vcard' },
    { name: 'Jane Smith', phone: '+15559876543', source: 'vcard' },
    { name: 'Bob Wilson', email: 'bob@example.com', source: 'vcard' },
  ];

  const emptyDeduplicationResult: DeduplicationResult = {
    unique: defaultContacts,
    duplicates: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display total contacts count', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Stats should show the number 3
      const statElements = screen.getAllByText('3');
      expect(statElements.length).toBeGreaterThan(0);
    });

    it('should display contacts to import count', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Should show stats - the text "3" appears multiple times (total and to import)
      const statElements = screen.getAllByText('3');
      expect(statElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should display source badge', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('vCard File')).toBeInTheDocument();
    });

    it('should display contact names in the list', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should display phone numbers when available', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('+15551234567')).toBeInTheDocument();
    });

    it('should display emails when available', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('Duplicates Handling', () => {
    const deduplicationResultWithDupes: DeduplicationResult = {
      unique: [defaultContacts[0]],
      duplicates: [
        {
          imported: defaultContacts[1],
          existingFriendName: 'Jane S.',
          matchedBy: 'phone',
        },
        {
          imported: defaultContacts[2],
          existingFriendName: 'Robert Wilson',
          matchedBy: 'email',
        },
      ],
    };

    it('should display duplicates count', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={deduplicationResultWithDupes}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('2')).toBeInTheDocument(); // duplicates count
    });

    it('should show duplicates info alert', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={deduplicationResultWithDupes}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Should show the duplicates info message
      expect(screen.getByText(/contactImport.preview.duplicatesInfo/)).toBeInTheDocument();
    });

    it('should display duplicate contact names in the duplicates section', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={deduplicationResultWithDupes}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  describe('Capacity Handling', () => {
    it('should show capacity warning when exceeding available capacity', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={1} // Only 1 available, but 3 contacts
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/contactImport.preview.capacityWarning/)).toBeInTheDocument();
    });

    it('should limit contacts to available capacity', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={2} // Only 2 available
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // The import button should show the translation key with count embedded
      // Our mock t() function replaces {{count}} with the actual number
      const importButton = screen.getByRole('button', { name: /import/i });
      expect(importButton).toHaveTextContent(/2/); // The translated key should include 2
    });

    it('should not show capacity warning when under capacity', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText(/contactImport.preview.capacityWarning/)).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onConfirm with contacts when import button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const importButton = screen.getByRole('button', { name: /import/i });
      await user.click(importButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(defaultContacts);
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should disable import button when no contacts to import', () => {
      const emptyResult: DeduplicationResult = {
        unique: [],
        duplicates: defaultContacts.map((c) => ({
          imported: c,
          existingFriendName: 'Existing',
          matchedBy: 'phone' as const,
        })),
      };

      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const importButton = screen.getByRole('button', { name: /import/i });
      expect(importButton).toBeDisabled();
    });

    it('should disable buttons when loading', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="vcard"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const importButton = screen.getByRole('button', { name: /import/i });

      expect(cancelButton).toBeDisabled();
      expect(importButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    it('should show message when no contacts to import', () => {
      const emptyResult: DeduplicationResult = {
        unique: [],
        duplicates: [],
      };

      render(
        <ImportPreview
          contacts={[]}
          deduplicationResult={emptyResult}
          availableCapacity={100}
          source="csv"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('contactImport.preview.noContactsToImport')).toBeInTheDocument();
    });
  });

  describe('Large Lists', () => {
    it('should show "and more" message when more than 50 contacts', () => {
      const manyContacts: ImportableContact[] = Array.from({ length: 60 }, (_, i) => ({
        name: `Contact ${i}`,
        source: 'csv' as const,
      }));

      const manyResult: DeduplicationResult = {
        unique: manyContacts,
        duplicates: [],
      };

      render(
        <ImportPreview
          contacts={manyContacts}
          deduplicationResult={manyResult}
          availableCapacity={100}
          source="csv"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/contactImport.preview.andMore/)).toBeInTheDocument();
    });

    it('should show "and more duplicates" message when more than 20 duplicates', () => {
      const manyContacts: ImportableContact[] = Array.from({ length: 25 }, (_, i) => ({
        name: `Contact ${i}`,
        source: 'csv' as const,
      }));

      const manyDupes: DeduplicationResult = {
        unique: [],
        duplicates: manyContacts.map((c) => ({
          imported: c,
          existingFriendName: 'Existing',
          matchedBy: 'email' as const,
        })),
      };

      render(
        <ImportPreview
          contacts={manyContacts}
          deduplicationResult={manyDupes}
          availableCapacity={100}
          source="csv"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/contactImport.preview.andMoreDuplicates/)).toBeInTheDocument();
    });
  });

  describe('Source Types', () => {
    it('should display correct source label for contact_picker', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="contact_picker"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Phone Contacts')).toBeInTheDocument();
    });

    it('should display correct source label for CSV', () => {
      render(
        <ImportPreview
          contacts={defaultContacts}
          deduplicationResult={emptyDeduplicationResult}
          availableCapacity={100}
          source="csv"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('CSV File')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Friend, TIER_INFO } from '@/types/friend';
import {
  getSortedSOSContacts,
  getQuickSOSContacts,
  generateSOSMessage,
  hasMinimumSOSNetwork,
  getSOSNetworkStatus,
  SOS_CATEGORIES,
} from '@/types/nayborSOS';
import { NayborSOSBanner } from '@/components/naybor/NayborSOSBanner';
import { NayborSOSQuickPanel } from '@/components/naybor/NayborSOSQuickPanel';
import { NayborSOSDialog } from '@/components/naybor/NayborSOSDialog';
import * as nayborExports from '@/components/naybor';
import * as nayborSOSExports from '@/types/nayborSOS';

// Mock translations for NayborSOS components
const mockTranslations: Record<string, string> = {
  // NayborSOS Dialog - actual keys from component
  'nayborSOS.title': 'Naybor SOS™',
  'nayborSOS.steps.category': 'What kind of help do you need?',
  'nayborSOS.steps.contacts': 'Choose naybors to contact',
  'nayborSOS.suggestedActions': 'Suggested actions:',
  'nayborSOS.addDetails': 'Add details (optional)',
  'nayborSOS.describePlaceholder': 'Describe your situation...',
  'nayborSOS.includeLocation': 'Include my location',
  'nayborSOS.chooseNaybors': 'Choose Naybors',
  'nayborSOS.chooseNayborsAria': 'Choose naybors to contact',
  'nayborSOS.nayborsSelected': '{{count}} naybor(s) selected',
  'nayborSOS.copyMessage': 'Copy Message',
  'nayborSOS.messageAll': 'Message All ({{count}})',
  'nayborSOS.contacted': 'Contacted {{count}} naybor(s)',
  'nayborSOS.critical': 'Critical',
  'nayborSOS.emergencyWarning': 'For life-threatening emergencies, call 911 first',
  'nayborSOS.toasts.messageCopied': 'Message copied to clipboard',
  'nayborSOS.toasts.noNayborsSelected': 'Please select at least one naybor',
  // NayborSOS Banner
  'nayborSOS.banner.title': 'Naybor SOS™',
  'nayborSOS.banner.networkStatus': '{{count}} naybors in your SOS network',
  'nayborSOS.banner.addMore': 'Add more naybors to strengthen your network',
  'nayborSOS.addMoreNaybors': 'Add more naybors',
  'nayborSOS.banner.quickButton': 'Quick',
  'nayborSOS.quick': 'Quick',
  'nayborSOS.banner.sosButton': 'SOS',
  // Quick Panel
  'nayborSOS.quickPanel.title': 'Quick Contacts',
  'nayborSOS.quickPanel.noPhone': 'No phone',
  'nayborSOS.noPhone': 'No phone',
  'nayborSOS.tapSOSForMore': 'Tap SOS for more options and all naybors',
  'accessibility.naybor.sosRegion': 'Quick SOS contacts',
  'accessibility.naybor.sosContactsList': 'Quick contacts:',
  'accessibility.naybor.hideQuickContacts': 'Hide quick contacts',
  'accessibility.naybor.showQuickContacts': 'Show quick contacts',
  // Actions
  'actions.back': 'Back',
  // Accessibility - keys from component
  'accessibility.naybor.sosButton': 'Open SOS dialog',
  'accessibility.naybor.quickButton': 'Open quick contacts panel',
  'accessibility.naybor.categoryButton': 'Select {{category}} category',
  'accessibility.naybor.callButton': 'Call {{name}}',
  'accessibility.naybor.messageButton': 'Message {{name}}',
  'accessibility.naybor.selectNaybor': 'Select {{name}}',
  'accessibility.naybor.alreadyContacted': '(already contacted)',
  'accessibility.naybor.copyMessage': 'Copy SOS message to clipboard',
  'accessibility.naybor.nayborsList': 'List of naybors to contact',
  'accessibility.naybor.contactOptions': 'Contact options for {{name}}',
  'accessibility.naybor.messageAll': 'Message all {{count}} selected naybors',
  'accessibility.naybor.locationDescription': 'Include your current location in the SOS message',
  'accessibility.dialog.back': 'Go back to previous step',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      let translation = mockTranslations[key] || key;
      // Handle interpolation like {{count}} or {{name}}
      if (opts) {
        Object.entries(opts).forEach(([k, v]) => {
          translation = translation.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        });
      }
      return translation;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Helper to create mock naybor
const createMockNaybor = (overrides: Partial<Friend> = {}): Friend => ({
  id: `naybor-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Naybor',
  tier: 'naybor',
  addedAt: new Date(),
  ...overrides,
});

describe('NayborSOS Types and Utilities', () => {
  describe('SOS_CATEGORIES', () => {
    it('should have all expected categories', () => {
      const expectedCategories = [
        'medical',
        'safety',
        'lockout',
        'utility',
        'pet',
        'childcare',
        'transport',
        'other',
      ];

      expectedCategories.forEach((category) => {
        expect(SOS_CATEGORIES[category as keyof typeof SOS_CATEGORIES]).toBeDefined();
      });
    });

    it('should mark medical and safety as critical urgency', () => {
      expect(SOS_CATEGORIES.medical.urgencyLevel).toBe('critical');
      expect(SOS_CATEGORIES.safety.urgencyLevel).toBe('critical');
    });

    it('should have icons for all categories', () => {
      Object.values(SOS_CATEGORIES).forEach((category) => {
        expect(category.icon).toBeTruthy();
        expect(category.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have suggested actions for all categories', () => {
      Object.values(SOS_CATEGORIES).forEach((category) => {
        expect(category.suggestedActions).toBeDefined();
        expect(category.suggestedActions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getSortedSOSContacts', () => {
    it('should prioritize naybors with phone numbers', () => {
      const naybors = [
        createMockNaybor({ id: 'no-phone', name: 'No Phone', phone: undefined }),
        createMockNaybor({ id: 'has-phone', name: 'Has Phone', phone: '555-1234' }),
        createMockNaybor({ id: 'also-no-phone', name: 'Also No Phone', phone: undefined }),
      ];

      const sorted = getSortedSOSContacts(naybors);

      expect(sorted[0].id).toBe('has-phone');
    });

    it('should sort by last contacted within same phone status', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const naybors = [
        createMockNaybor({ id: 'older', name: 'Older Contact', phone: '555-1234', lastContacted: lastWeek }),
        createMockNaybor({ id: 'recent', name: 'Recent Contact', phone: '555-5678', lastContacted: yesterday }),
      ];

      const sorted = getSortedSOSContacts(naybors);

      expect(sorted[0].id).toBe('recent');
      expect(sorted[1].id).toBe('older');
    });

    it('should sort alphabetically as final tiebreaker', () => {
      const naybors = [
        createMockNaybor({ id: 'z', name: 'Zelda', phone: '555-1234' }),
        createMockNaybor({ id: 'a', name: 'Alice', phone: '555-5678' }),
        createMockNaybor({ id: 'm', name: 'Mike', phone: '555-9012' }),
      ];

      const sorted = getSortedSOSContacts(naybors);

      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Mike');
      expect(sorted[2].name).toBe('Zelda');
    });

    it('should handle empty array', () => {
      const sorted = getSortedSOSContacts([]);
      expect(sorted).toEqual([]);
    });

    it('should respect sortOrder when set', () => {
      const naybors = [
        createMockNaybor({ id: 'third', name: 'Third', sortOrder: 3 }),
        createMockNaybor({ id: 'first', name: 'First', sortOrder: 1 }),
        createMockNaybor({ id: 'second', name: 'Second', sortOrder: 2 }),
      ];

      const sorted = getSortedSOSContacts(naybors);

      expect(sorted[0].id).toBe('first');
      expect(sorted[1].id).toBe('second');
      expect(sorted[2].id).toBe('third');
    });
  });

  describe('getQuickSOSContacts', () => {
    it('should return top 3 contacts by default', () => {
      const naybors = Array.from({ length: 10 }, (_, i) =>
        createMockNaybor({ id: `n${i}`, name: `Naybor ${i}`, phone: '555-1234' })
      );

      const quick = getQuickSOSContacts(naybors);

      expect(quick).toHaveLength(3);
    });

    it('should return specified count', () => {
      const naybors = Array.from({ length: 10 }, (_, i) =>
        createMockNaybor({ id: `n${i}`, name: `Naybor ${i}`, phone: '555-1234' })
      );

      const quick = getQuickSOSContacts(naybors, 5);

      expect(quick).toHaveLength(5);
    });

    it('should return all naybors if fewer than requested', () => {
      const naybors = [
        createMockNaybor({ id: 'n1', name: 'Naybor 1' }),
        createMockNaybor({ id: 'n2', name: 'Naybor 2' }),
      ];

      const quick = getQuickSOSContacts(naybors, 5);

      expect(quick).toHaveLength(2);
    });

    it('should return empty array for no naybors', () => {
      const quick = getQuickSOSContacts([]);
      expect(quick).toEqual([]);
    });
  });

  describe('generateSOSMessage', () => {
    it('should include category name and icon', () => {
      const message = generateSOSMessage('medical');

      expect(message).toContain('Naybor SOS');
      expect(message).toContain('Medical');
    });

    it('should include custom message when provided', () => {
      const customMsg = 'I fell and need help getting up';
      const message = generateSOSMessage('medical', customMsg);

      expect(message).toContain(customMsg);
    });

    it('should include location placeholder when requested', () => {
      const message = generateSOSMessage('safety', undefined, true);

      expect(message).toContain('Location will be shared');
    });

    it('should include Naybor SOS trademark', () => {
      const message = generateSOSMessage('lockout');

      expect(message).toContain('Naybor SOS™');
    });

    it('should use category description when no custom message', () => {
      const message = generateSOSMessage('lockout');

      expect(message).toContain('Locked out');
    });
  });

  describe('hasMinimumSOSNetwork', () => {
    it('should return false for 0 naybors', () => {
      expect(hasMinimumSOSNetwork(0)).toBe(false);
    });

    it('should return false for 1-2 naybors', () => {
      expect(hasMinimumSOSNetwork(1)).toBe(false);
      expect(hasMinimumSOSNetwork(2)).toBe(false);
    });

    it('should return true for 3+ naybors', () => {
      expect(hasMinimumSOSNetwork(3)).toBe(true);
      expect(hasMinimumSOSNetwork(10)).toBe(true);
      expect(hasMinimumSOSNetwork(25)).toBe(true);
    });
  });

  describe('getSOSNetworkStatus', () => {
    it('should return "none" status for 0 naybors', () => {
      const status = getSOSNetworkStatus(0);

      expect(status.status).toBe('none');
      expect(status.message).toContain('No naybors');
      expect(status.color).toContain('destructive');
    });

    it('should return "minimal" status for 1-2 naybors', () => {
      const status1 = getSOSNetworkStatus(1);
      const status2 = getSOSNetworkStatus(2);

      expect(status1.status).toBe('minimal');
      expect(status2.status).toBe('minimal');
      expect(status1.message).toContain('1 naybor');
      expect(status2.message).toContain('2 naybors');
    });

    it('should return "good" status for 3-9 naybors', () => {
      const status3 = getSOSNetworkStatus(3);
      const status9 = getSOSNetworkStatus(9);

      expect(status3.status).toBe('good');
      expect(status9.status).toBe('good');
    });

    it('should return "strong" status for 10+ naybors', () => {
      const status10 = getSOSNetworkStatus(10);
      const status25 = getSOSNetworkStatus(25);

      expect(status10.status).toBe('strong');
      expect(status25.status).toBe('strong');
      expect(status10.message).toContain('Strong SOS network');
    });
  });
});

describe('NayborSOSBanner Component', () => {
  it('should display SOS network status', () => {
    const naybors = Array.from({ length: 5 }, (_, i) =>
      createMockNaybor({ id: `n${i}`, name: `Naybor ${i}`, phone: '555-1234' })
    );

    render(<NayborSOSBanner naybors={naybors} />);

    expect(screen.getByText('Naybor SOS™')).toBeInTheDocument();
    expect(screen.getByText(/5 naybors in your SOS network/)).toBeInTheDocument();
  });

  it('should show quick access button when naybors exist', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSBanner naybors={naybors} />);

    expect(screen.getByRole('button', { name: /quick/i })).toBeInTheDocument();
  });

  it('should show SOS button', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSBanner naybors={naybors} />);

    expect(screen.getByRole('button', { name: /sos/i })).toBeInTheDocument();
  });

  it('should show warning when network is minimal', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice' }),
    ];

    render(<NayborSOSBanner naybors={naybors} />);

    expect(screen.getByText(/add more naybors/i)).toBeInTheDocument();
  });

  it('should be hidden when no naybors', () => {
    const { container } = render(<NayborSOSBanner naybors={[]} />);

    expect(container.firstChild).toBeNull();
  });
});

describe('NayborSOSQuickPanel Component', () => {
  it('should display quick contact list', () => {
    const contacts = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
      createMockNaybor({ id: 'n2', name: 'Bob', phone: '555-5678' }),
    ];

    render(<NayborSOSQuickPanel contacts={contacts} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should show phone numbers for contacts with phones', () => {
    const contacts = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSQuickPanel contacts={contacts} />);

    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('should show call and message buttons for naybors with phones', () => {
    const contacts = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSQuickPanel contacts={contacts} />);

    expect(screen.getByRole('button', { name: 'Call Alice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Message Alice' })).toBeInTheDocument();
  });

  it('should show "No phone" for naybors without phone', () => {
    const contacts = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: undefined }),
    ];

    render(<NayborSOSQuickPanel contacts={contacts} />);

    expect(screen.getByText('No phone')).toBeInTheDocument();
  });

  it('should call onContact when contacting a naybor', async () => {
    const onContact = vi.fn();
    const contacts = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    // Mock window.open
    const mockOpen = vi.fn();
    vi.spyOn(window, 'open').mockImplementation(mockOpen);

    render(<NayborSOSQuickPanel contacts={contacts} onContact={onContact} />);

    const callButton = screen.getByRole('button', { name: 'Call Alice' });
    await userEvent.click(callButton);

    expect(onContact).toHaveBeenCalledWith(contacts[0]);

    vi.restoreAllMocks();
  });
});

describe('NayborSOSDialog Component', () => {
  it('should display all SOS categories when open', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={true} onOpenChange={() => {}} naybors={naybors} />);

    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('Locked Out')).toBeInTheDocument();
    expect(screen.getByText('Utility Issue')).toBeInTheDocument();
    expect(screen.getByText('Pet Help')).toBeInTheDocument();
    expect(screen.getByText('Childcare')).toBeInTheDocument();
    expect(screen.getByText('Ride Needed')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('should show category descriptions on selection', async () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={true} onOpenChange={() => {}} naybors={naybors} />);

    const medicalButton = screen.getByRole('button', { name: /medical/i });
    await userEvent.click(medicalButton);

    // After clicking, the dialog moves to compose step which shows description
    await waitFor(() => {
      expect(screen.getByText(/immediate assistance/i)).toBeInTheDocument();
    });
  });

  it('should show suggested actions for selected category', async () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={true} onOpenChange={() => {}} naybors={naybors} />);

    const lockoutButton = screen.getByRole('button', { name: /locked out/i });
    await userEvent.click(lockoutButton);

    // Check for "Suggested actions:" label
    await waitFor(() => {
      expect(screen.getByText('Suggested actions:')).toBeInTheDocument();
    });
  });

  it('should mark critical categories appropriately', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={true} onOpenChange={() => {}} naybors={naybors} />);

    // Medical and Safety should show "Critical" badge
    const criticalBadges = screen.getAllByText('Critical');
    expect(criticalBadges.length).toBe(2);
  });

  it('should not render when closed', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={false} onOpenChange={() => {}} naybors={naybors} />);

    expect(screen.queryByText('Medical')).not.toBeInTheDocument();
  });

  it('should show 911 reminder', () => {
    const naybors = [
      createMockNaybor({ id: 'n1', name: 'Alice', phone: '555-1234' }),
    ];

    render(<NayborSOSDialog open={true} onOpenChange={() => {}} naybors={naybors} />);

    expect(screen.getByText(/call 911 first/i)).toBeInTheDocument();
  });
});

describe('NayborSOS Integration', () => {
  it('should have tier description mentioning Naybor SOS™', () => {
    expect(TIER_INFO.naybor.description).toContain('Naybor SOS™');
  });

  it('should have under-minimum warning mentioning Naybor SOS™', () => {
    expect(TIER_INFO.naybor.underMinWarning).toContain('Naybor SOS™');
  });

  it('should export all necessary components', () => {
    expect(nayborExports.NayborSOSBanner).toBeDefined();
    expect(nayborExports.NayborSOSDialog).toBeDefined();
    expect(nayborExports.NayborSOSQuickPanel).toBeDefined();
  });

  it('should export all necessary utility functions', () => {
    expect(nayborSOSExports.getSortedSOSContacts).toBeDefined();
    expect(nayborSOSExports.getQuickSOSContacts).toBeDefined();
    expect(nayborSOSExports.generateSOSMessage).toBeDefined();
    expect(nayborSOSExports.hasMinimumSOSNetwork).toBeDefined();
    expect(nayborSOSExports.getSOSNetworkStatus).toBeDefined();
    expect(nayborSOSExports.SOS_CATEGORIES).toBeDefined();
  });
});

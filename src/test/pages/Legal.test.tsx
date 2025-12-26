import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock react-i18next with actual translations for legal pages
const mockLegalTranslations: Record<string, string> = {
  'nav.back': 'Back',
  'legal.privacyPolicy': 'Privacy Policy',
  'legal.termsOfService': 'Terms of Service',
  'legal.lastUpdated': 'Last updated: {{date}}',
  'legal.backToHome': 'Back to Home',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { date?: string }) => {
      if (key === 'legal.lastUpdated' && opts?.date) {
        return `Last updated: ${opts.date}`;
      }
      return mockLegalTranslations[key] || key;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock LanguageSelector to simplify testing
vi.mock('@/components/i18n/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector">EN</div>,
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Import after mocks
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

const renderPrivacy = () => {
  return render(
    <BrowserRouter>
      <Privacy />
    </BrowserRouter>
  );
};

const renderTerms = () => {
  return render(
    <BrowserRouter>
      <Terms />
    </BrowserRouter>
  );
};

describe('Privacy Policy Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render privacy policy page', () => {
      renderPrivacy();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('should display last updated date', () => {
      renderPrivacy();
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });

    it('should have a back button', () => {
      renderPrivacy();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should have language selector', () => {
      renderPrivacy();
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });

  describe('content sections', () => {
    it('should have Privacy-First Philosophy section', () => {
      renderPrivacy();
      expect(screen.getByText(/Privacy-First Philosophy/i)).toBeInTheDocument();
    });

    it('should have What Data We Collect section', () => {
      renderPrivacy();
      expect(screen.getByText(/What Data We Collect/i)).toBeInTheDocument();
    });

    it('should mention Supabase as data processor', () => {
      renderPrivacy();
      // Multiple elements mention Supabase, so use getAllByText
      expect(screen.getAllByText(/Supabase/i).length).toBeGreaterThan(0);
    });

    it('should mention GDPR rights', () => {
      renderPrivacy();
      expect(screen.getAllByText(/GDPR/i).length).toBeGreaterThan(0);
    });

    it('should mention data export capability', () => {
      renderPrivacy();
      expect(screen.getAllByText(/export/i).length).toBeGreaterThan(0);
    });

    it('should mention account deletion', () => {
      renderPrivacy();
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThan(0);
    });

    it('should have contact information', () => {
      renderPrivacy();
      expect(screen.getByText(/privacy@lifesaverlabs.org/i)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should call navigate when back button is clicked', async () => {
      const user = userEvent.setup();
      renderPrivacy();

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderPrivacy();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Privacy Policy');

      // Should have multiple h2 sections
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(3);
    });

    it('should have aria-label on back button', () => {
      renderPrivacy();
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toHaveAttribute('aria-label');
    });
  });
});

describe('Terms of Service Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render terms of service page', () => {
      renderTerms();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should display last updated date', () => {
      renderTerms();
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });

    it('should have a back button', () => {
      renderTerms();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should have language selector', () => {
      renderTerms();
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });

  describe('content sections', () => {
    it('should have Introduction section', () => {
      renderTerms();
      expect(screen.getByText(/1\. Introduction/i)).toBeInTheDocument();
    });

    it('should have Description of Service section', () => {
      renderTerms();
      expect(screen.getByText(/2\. Description of Service/i)).toBeInTheDocument();
    });

    it('should have Acceptable Use section', () => {
      renderTerms();
      expect(screen.getByText(/Acceptable Use/i)).toBeInTheDocument();
    });

    it('should mention Keys Shared feature', () => {
      renderTerms();
      expect(screen.getAllByText(/Keys Shared/i).length).toBeGreaterThan(0);
    });

    it('should mention Data Liberation', () => {
      renderTerms();
      expect(screen.getAllByText(/Data Liberation/i).length).toBeGreaterThan(0);
    });

    it('should mention Limitation of Liability', () => {
      renderTerms();
      expect(screen.getByText(/Limitation of Liability/i)).toBeInTheDocument();
    });

    it('should have contact information', () => {
      renderTerms();
      expect(screen.getByText(/legal@lifesaverlabs.org/i)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should call navigate when back button is clicked', async () => {
      const user = userEvent.setup();
      renderTerms();

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderTerms();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Terms of Service');

      // Should have multiple h2 sections (numbered sections)
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(10); // Terms has 16 sections
    });

    it('should have aria-label on back button', () => {
      renderTerms();
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toHaveAttribute('aria-label');
    });
  });

  describe('legal provisions', () => {
    it('should mention anti-stalking provisions', () => {
      renderTerms();
      expect(screen.getByText(/stalking/i)).toBeInTheDocument();
    });

    it('should mention open source nature', () => {
      renderTerms();
      expect(screen.getByText(/open-source software/i)).toBeInTheDocument();
    });

    it('should mention EU GDPR rights', () => {
      renderTerms();
      expect(screen.getByText(/GDPR/i)).toBeInTheDocument();
    });

    it('should mention account termination rights', () => {
      renderTerms();
      expect(screen.getByText(/Termination/i)).toBeInTheDocument();
    });
  });
});

describe('Legal Pages - Data Liberation Front Compliance', () => {
  it('Privacy page should emphasize user ownership of data', () => {
    renderPrivacy();
    expect(screen.getAllByText(/Your data belongs to you/i).length).toBeGreaterThan(0);
  });

  it('Terms page should guarantee data export rights', () => {
    renderTerms();
    expect(screen.getAllByText(/export/i).length).toBeGreaterThan(0);
  });

  it('Terms page should guarantee deletion rights', () => {
    renderTerms();
    expect(screen.getAllByText(/delete/i).length).toBeGreaterThan(0);
  });

  it('Terms page should state no data hostage', () => {
    renderTerms();
    expect(screen.getAllByText(/never hold your data hostage/i).length).toBeGreaterThan(0);
  });
});

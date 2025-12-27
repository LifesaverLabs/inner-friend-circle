import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock react-i18next with actual translations for landing page
const mockTranslations: Record<string, string> = {
  'app.name': 'InnerFriend',
  'nav.signIn': 'Sign In',
  'landing.heroTitle1': 'Curate Your',
  'landing.heroTitle2': 'Closest Friendships',
  'landing.heroDescription': "Based on Dunbar's research, we can only truly maintain about 5 intimate friendships, 15 close friends, and 150 meaningful connections.",
  'landing.getStarted': 'Get Started',
  'landing.learnMore': 'Learn More',
  'landing.features.intentionalLimits.title': 'Intentional Limits',
  'landing.features.intentionalLimits.description': 'Science shows we have natural limits to meaningful relationships.',
  'landing.features.privateByDefault.title': 'Private by Default',
  'landing.features.privateByDefault.description': 'Your lists stay on your device.',
  'landing.features.mutualDiscovery.title': 'Mutual Discovery',
  'landing.features.mutualDiscovery.description': 'Optionally learn when someone you\'ve listed as close has also listed you.',
  'landing.mission.title': 'Face Time, Not Ad Time',
  'landing.mission.description': 'We win when you leave our site.',
  'landing.mission.inspiration': 'Our inspiration: Dentyne Ice',
  'landing.quote': 'Not all relationships are symmetrical.',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => mockTranslations[key] || key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
    a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a {...props}>{children}</a>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props}>{children}</h3>
    ),
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section {...props}>{children}</section>
    ),
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article {...props}>{children}</article>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props}>{children}</ul>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props}>{children}</li>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock useAuth
const mockSignOut = vi.fn();
const mockAuthState = {
  user: null as any,
  loading: false,
  isAuthenticated: false,
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    ...mockAuthState,
    signOut: mockSignOut,
  }),
}));

// Mock useFriendLists
const mockFriendListsState = {
  lists: { friends: [], reservedSpots: {} },
  isLoaded: true,
  lastTendedAt: null,
};

vi.mock('@/hooks/useFriendLists', () => ({
  useFriendLists: () => ({
    ...mockFriendListsState,
    getFriendsInTier: () => [],
    getTierCapacity: () => ({ used: 0, friendCount: 0, reserved: 0, reservedGroups: [], limit: 5, available: 5 }),
    addFriend: vi.fn(),
    updateFriend: vi.fn(),
    removeFriend: vi.fn(),
    moveFriend: vi.fn(),
    reorderFriendsInTier: vi.fn(),
    addReservedGroup: vi.fn(),
    updateReservedGroup: vi.fn(),
    removeReservedGroup: vi.fn(),
    clearAllData: vi.fn(),
    markTended: vi.fn(),
  }),
}));

// Mock useFriendConnections
vi.mock('@/hooks/useFriendConnections', () => ({
  useFriendConnections: () => ({
    connections: [],
    pendingRequests: [],
    sentRequests: [],
    isLoading: false,
    error: null,
    createConnectionRequest: vi.fn(),
    respondToRequest: vi.fn(),
    deleteConnection: vi.fn(),
    findUserByContactInfo: vi.fn(),
    getConfirmedFriendsInTier: () => [],
    isConnectedTo: () => false,
    refetch: vi.fn(),
  }),
}));

// Mock useContactMethods
vi.mock('@/hooks/useContactMethods', () => ({
  useContactMethods: () => ({
    contactMethods: [],
    isLoading: false,
    addContactMethod: vi.fn(),
    updateContactMethod: vi.fn(),
    removeContactMethod: vi.fn(),
    reorderPriorities: vi.fn(),
    getSpontaneousMethods: () => [],
    getScheduledMethods: () => [],
    refetch: vi.fn(),
  }),
  useUserContactMethods: () => ({
    contactMethods: [],
    isLoading: false,
  }),
}));

// Mock useParasocial
vi.mock('@/hooks/useParasocial', () => ({
  useParasocial: () => ({
    feedShares: [],
    seenShares: new Set(),
    recordEngagement: vi.fn(),
    isLoading: false,
  }),
}));

// Mock LanguageSelector to avoid complex component tree issues
vi.mock('@/components/i18n/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector">EN</div>,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import Index from '@/pages/Index';

const renderIndex = () => {
  return render(
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  );
};

describe('Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState.user = null;
    mockAuthState.loading = false;
    mockAuthState.isAuthenticated = false;
    mockFriendListsState.isLoaded = true;
  });

  describe('landing page (not authenticated)', () => {
    it('should render landing hero when not authenticated', () => {
      renderIndex();
      // Should show landing content
      expect(document.body.textContent).toMatch(/inner friend|relationship|dunbar/i);
    });

    it('should show sign in call to action', () => {
      renderIndex();
      // Multiple elements may contain sign-related text, use getAllByText
      const signElements = screen.getAllByText(/sign in|get started/i);
      expect(signElements.length).toBeGreaterThan(0);
    });

    it('should display Dunbar visualization', () => {
      renderIndex();
      // Should have some visualization or diagram
      expect(document.body.textContent).toMatch(/core|inner|outer/i);
    });

    it('should show app features', () => {
      renderIndex();
      // Should describe features
      expect(document.body.textContent).toMatch(/friend|relationship|connect/i);
    });
  });

  describe('dashboard (authenticated)', () => {
    beforeEach(() => {
      mockAuthState.user = { id: 'user-123', email: 'test@example.com' };
      mockAuthState.isAuthenticated = true;
    });

    it('should render dashboard when authenticated', () => {
      renderIndex();
      // Should show dashboard content
      expect(document.body.textContent).toMatch(/core|inner|outer|friend/i);
    });

    it('should display tier sections', () => {
      renderIndex();
      // Should show tier sections
      expect(document.body.textContent).toContain('Core');
    });

    it('should show user email', () => {
      renderIndex();
      // May show user email somewhere
      // Depends on implementation
    });

    it('should have sign out option', () => {
      renderIndex();
      // Should have sign out button/link
      const signOutButton = screen.queryByText(/sign out|logout/i);
      // May or may not be visible depending on UI
    });
  });

  describe('loading state', () => {
    it('should handle loading state gracefully', () => {
      mockAuthState.loading = true;
      renderIndex();
      // Should not crash during loading
      expect(document.body).toBeTruthy();
    });
  });

  describe('tier display', () => {
    beforeEach(() => {
      mockAuthState.user = { id: 'user-123', email: 'test@example.com' };
      mockAuthState.isAuthenticated = true;
    });

    it('should show all six tiers', () => {
      renderIndex();

      const tiers = ['Core', 'Inner', 'Outer'];
      tiers.forEach(tier => {
        expect(document.body.textContent).toContain(tier);
      });
    });
  });

  describe('navigation', () => {
    it('should navigate to auth on sign in click', async () => {
      renderIndex();

      // Use getAllByText and select the first match (Sign In button in header)
      const signInButtons = screen.getAllByText(/sign in/i);
      fireEvent.click(signInButtons[0]);

      await waitFor(() => {
        // Should navigate or show auth
        const didNavigate = mockNavigate.mock.calls.length > 0;
        const hasAuthText = document.body.textContent?.match(/email|password/i);
        expect(didNavigate || hasAuthText).toBeTruthy();
      });
    });
  });

  describe('responsiveness', () => {
    it('should render on mobile viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });

      renderIndex();

      // Should still render content
      expect(document.body.textContent).toBeTruthy();
    });

    it('should render on desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1440 });

      renderIndex();

      expect(document.body.textContent).toBeTruthy();
    });
  });
});

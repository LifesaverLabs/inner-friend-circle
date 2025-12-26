import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { Friend } from '@/types/friend';

// Mock the useFeed hook
vi.mock('@/hooks/useFeed', () => ({
  useFeed: vi.fn(() => ({
    posts: [],
    nudges: [],
    acquaintedNudgeBatch: { friends: [], shouldShow: false },
    notifications: [],
    unreadCount: 0,
    getCoreFeed: vi.fn(() => []),
    getTierFeed: vi.fn(() => []),
    getFilteredFeed: vi.fn(() => []),
    createPost: vi.fn(),
    addInteraction: vi.fn(),
    dismissNudge: vi.fn(),
    dismissAcquaintedNudge: vi.fn(),
    markNotificationRead: vi.fn(),
    markAllNotificationsRead: vi.fn(),
    getImmediateNotifications: vi.fn(() => []),
    getBatchedNotifications: vi.fn(() => []),
    canViewerSee: vi.fn(() => true),
    getVisibleContent: vi.fn(),
    shouldShowLikeCount: vi.fn(() => true),
    sortInteractionsByFidelity: vi.fn(),
    getNotificationPriority: vi.fn(() => 'immediate'),
    exportSocialGraph: vi.fn(),
    importSocialGraph: vi.fn(),
    privacySettings: {},
    notificationSettings: {},
    updatePrivacySettings: vi.fn(),
    updateNotificationSettings: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

// Helper to create mock friends
const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: `friend-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Friend',
  tier: 'core',
  addedAt: new Date(),
  ...overrides,
});

// Helper to render with router and providers
const renderWithRouter = (
  ui: React.ReactElement,
  { initialEntries = ['/'] } = {}
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </MemoryRouter>
  );
};

describe('FeedTabs', () => {
  const defaultProps = {
    friends: [] as Friend[],
    isLoggedIn: true,
    userId: 'user-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Rendering', () => {
    it('should render all four tabs', () => {
      renderWithRouter(<FeedTabs {...defaultProps} />);

      expect(screen.getByRole('tab', { name: /core feed/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /inner feed/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /outer plus/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /manage/i })).toBeInTheDocument();
    });

    it('should render tabs in correct order', () => {
      renderWithRouter(<FeedTabs {...defaultProps} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveTextContent(/core/i);
      expect(tabs[1]).toHaveTextContent(/inner/i);
      expect(tabs[2]).toHaveTextContent(/outer/i);
      expect(tabs[3]).toHaveTextContent(/manage/i);
    });

    it('should show tier color indicators on tabs', () => {
      renderWithRouter(<FeedTabs {...defaultProps} />);

      // Each feed tab should have a colored dot indicator
      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      const innerTab = screen.getByRole('tab', { name: /inner feed/i });
      const outerTab = screen.getByRole('tab', { name: /outer plus/i });

      // Check for tier color classes in tab content
      expect(coreTab.querySelector('.bg-tier-core')).toBeInTheDocument();
      expect(innerTab.querySelector('.bg-tier-inner')).toBeInTheDocument();
      expect(outerTab.querySelector('.bg-tier-outer')).toBeInTheDocument();
    });
  });

  describe('Default Tab Selection', () => {
    it('should default to Manage tab when user has no friends', () => {
      renderWithRouter(<FeedTabs {...defaultProps} friends={[]} />);

      const manageTab = screen.getByRole('tab', { name: /manage/i });
      expect(manageTab).toHaveAttribute('data-state', 'active');
    });

    it('should default to Core Feed when user has friends', () => {
      const friends = [createMockFriend({ tier: 'core' })];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      expect(coreTab).toHaveAttribute('data-state', 'active');
    });

    it('should default to Core Feed when user has friends in any tier', () => {
      const friends = [createMockFriend({ tier: 'outer' })];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      expect(coreTab).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Tab Switching', () => {
    it('should switch to Inner Feed when clicked', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const innerTab = screen.getByRole('tab', { name: /inner feed/i });
      await user.click(innerTab);

      await waitFor(() => {
        expect(innerTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should switch to Outer+ when clicked', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const outerTab = screen.getByRole('tab', { name: /outer plus/i });
      await user.click(outerTab);

      await waitFor(() => {
        expect(outerTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should switch to Manage when clicked', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const manageTab = screen.getByRole('tab', { name: /manage/i });
      await user.click(manageTab);

      await waitFor(() => {
        expect(manageTab).toHaveAttribute('data-state', 'active');
      });
    });

    it('should switch back to Core Feed from other tabs', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      // Go to Manage
      await user.click(screen.getByRole('tab', { name: /manage/i }));

      // Go back to Core
      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      await user.click(coreTab);

      await waitFor(() => {
        expect(coreTab).toHaveAttribute('data-state', 'active');
      });
    });
  });

  describe('URL State Persistence', () => {
    it('should read initial tab from URL query param', () => {
      const friends = [createMockFriend()];
      renderWithRouter(
        <FeedTabs {...defaultProps} friends={friends} />,
        { initialEntries: ['/?tab=inner'] }
      );

      const innerTab = screen.getByRole('tab', { name: /inner feed/i });
      expect(innerTab).toHaveAttribute('data-state', 'active');
    });

    it('should read outer tab from URL', () => {
      const friends = [createMockFriend()];
      renderWithRouter(
        <FeedTabs {...defaultProps} friends={friends} />,
        { initialEntries: ['/?tab=outer'] }
      );

      const outerTab = screen.getByRole('tab', { name: /outer plus/i });
      expect(outerTab).toHaveAttribute('data-state', 'active');
    });

    it('should read manage tab from URL', () => {
      const friends = [createMockFriend()];
      renderWithRouter(
        <FeedTabs {...defaultProps} friends={friends} />,
        { initialEntries: ['/?tab=manage'] }
      );

      const manageTab = screen.getByRole('tab', { name: /manage/i });
      expect(manageTab).toHaveAttribute('data-state', 'active');
    });

    it('should fall back to default when URL has invalid tab', () => {
      const friends = [createMockFriend()];
      renderWithRouter(
        <FeedTabs {...defaultProps} friends={friends} />,
        { initialEntries: ['/?tab=invalid'] }
      );

      // Should fall back to Core Feed since user has friends
      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      expect(coreTab).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Tab Content Rendering', () => {
    it('should render TierFeed for Core Feed tab', () => {
      const friends = [createMockFriend({ tier: 'core' })];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      // Core feed tab is active by default, should show tier feed content
      expect(screen.getByTestId('tier-feed-core')).toBeInTheDocument();
    });

    it('should render TierFeed for Inner Feed tab when selected', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      await user.click(screen.getByRole('tab', { name: /inner feed/i }));

      await waitFor(() => {
        expect(screen.getByTestId('tier-feed-inner')).toBeInTheDocument();
      });
    });

    it('should render TierFeed for Outer+ tab when selected', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      await user.click(screen.getByRole('tab', { name: /outer plus/i }));

      await waitFor(() => {
        expect(screen.getByTestId('tier-feed-outer')).toBeInTheDocument();
      });
    });

    it('should render manage content for Manage tab', () => {
      renderWithRouter(<FeedTabs {...defaultProps} />);

      // Manage is default when no friends
      expect(screen.getByTestId('manage-content')).toBeInTheDocument();
    });

    it('should not render multiple tab contents simultaneously', () => {
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      // Core is active - it's in the active tabpanel (no hidden attribute)
      expect(screen.getByTestId('tier-feed-core')).toBeInTheDocument();

      // Other tab panels should be hidden (Radix keeps them in DOM with hidden attribute)
      const manageContent = screen.getByTestId('manage-content');
      expect(manageContent).toHaveAttribute('hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      renderWithRouter(<FeedTabs {...defaultProps} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(4);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const coreTab = screen.getByRole('tab', { name: /core feed/i });

      // Focus the tab and use keyboard
      await user.click(coreTab);
      await user.keyboard('{ArrowRight}');

      // Arrow right should move to next tab
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /inner feed/i })).toHaveFocus();
      });
    });

    it('should have aria-selected on active tab', () => {
      const friends = [createMockFriend()];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      const coreTab = screen.getByRole('tab', { name: /core feed/i });
      expect(coreTab).toHaveAttribute('aria-selected', 'true');

      const innerTab = screen.getByRole('tab', { name: /inner feed/i });
      expect(innerTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Logged Out State', () => {
    it('should still show tabs when logged out', () => {
      renderWithRouter(<FeedTabs {...defaultProps} isLoggedIn={false} />);

      expect(screen.getByRole('tab', { name: /core feed/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /manage/i })).toBeInTheDocument();
    });

    it('should default to Manage tab when logged out', () => {
      renderWithRouter(<FeedTabs {...defaultProps} isLoggedIn={false} />);

      const manageTab = screen.getByRole('tab', { name: /manage/i });
      expect(manageTab).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Props Passing', () => {
    it('should pass friends to child components', () => {
      const friends = [
        createMockFriend({ tier: 'core', name: 'Core Friend' }),
        createMockFriend({ tier: 'inner', name: 'Inner Friend' }),
      ];
      renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

      // The TierFeed should receive filtered friends for its tier
      expect(screen.getByTestId('tier-feed-core')).toBeInTheDocument();
    });

    it('should pass userId to child components', () => {
      const friends = [createMockFriend()];
      renderWithRouter(
        <FeedTabs {...defaultProps} friends={friends} userId="test-user-id" />
      );

      expect(screen.getByTestId('tier-feed-core')).toBeInTheDocument();
    });
  });
});

describe('FeedTabs - Edge Cases', () => {
  const defaultProps = {
    friends: [] as Friend[],
    isLoggedIn: true,
    userId: 'user-123',
  };

  it('should handle rapid tab switching', async () => {
    const user = userEvent.setup();
    const friends = [createMockFriend()];
    renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

    const innerTab = screen.getByRole('tab', { name: /inner feed/i });
    const outerTab = screen.getByRole('tab', { name: /outer plus/i });
    const coreTab = screen.getByRole('tab', { name: /core feed/i });

    await user.click(innerTab);
    await user.click(outerTab);
    await user.click(coreTab);
    await user.click(innerTab);

    await waitFor(() => {
      expect(innerTab).toHaveAttribute('data-state', 'active');
    });
  });

  it('should handle empty friends array gracefully', () => {
    renderWithRouter(<FeedTabs {...defaultProps} friends={[]} />);

    // Should not crash and should show Manage tab
    const manageTab = screen.getByRole('tab', { name: /manage/i });
    expect(manageTab).toHaveAttribute('data-state', 'active');
  });

  it('should handle undefined userId', () => {
    renderWithRouter(<FeedTabs {...defaultProps} userId={undefined} />);

    // Should not crash
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});

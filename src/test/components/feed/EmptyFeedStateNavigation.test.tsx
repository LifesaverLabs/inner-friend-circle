import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { TierFeed } from '@/components/feed/TierFeed';
import { EmptyFeedState } from '@/components/feed/EmptyFeedState';
import { Friend } from '@/types/friend';

// Mock translations for EmptyFeedState
const mockTranslations: Record<string, string> = {
  // Empty state translations
  'emptyState.noFriendsYet.core': 'No Core friends yet',
  'emptyState.noFriendsYet.inner': 'No Inner Circle friends yet',
  'emptyState.noFriendsYet.outer': 'No Outer Circle friends yet',
  'emptyState.noPostsYet': 'No posts yet',
  'emptyState.noPostsDescription.core': 'Share something with your closest friends.',
  'emptyState.noPostsDescription.inner': 'Share something with your inner circle.',
  'emptyState.noPostsDescription.outer': 'Share something with your connections.',
  'tiers.coreDescription': 'Your 5 closest, most trusted friends',
  'tiers.innerDescription': 'Up to 15 close friends you see regularly',
  'tiers.outerDescription': 'Up to 150 meaningful connections that matter',
  'emptyState.getStarted.core': 'Get started by adding friends to your Core circle.',
  'emptyState.getStarted.inner': 'Get started by adding friends to your Inner circle.',
  'emptyState.getStarted.outer': 'Get started by adding friends to your Outer circle.',
  'emptyState.addToSee.core': 'Add friends to see their posts here.',
  'emptyState.addToSee.inner': 'Add friends to see their posts here.',
  'emptyState.addToSee.outer': 'Add friends to see their posts here.',
  'emptyState.addFriends.core': 'Add Core Friends',
  'emptyState.addFriends.inner': 'Add Inner Circle Friends',
  'emptyState.addFriends.outer': 'Add Outer Circle Friends',
  'emptyState.createPost': 'Create Post',
  // Feed tabs translations (actual keys from FeedTabs.tsx)
  'feed.coreFeed': 'Core Feed',
  'feed.innerFeed': 'Inner Feed',
  'feed.outerFeed': 'Outer Plus',
  'feed.manage': 'Manage',
  'accessibility.feed.tabList': 'Feed navigation tabs',
  'accessibility.feed.coreTab': 'Core Feed',
  'accessibility.feed.innerTab': 'Inner Feed',
  'accessibility.feed.outerTab': 'Outer Plus Feed',
  'accessibility.feed.manageTab': 'Manage friends',
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

// Wrapper with required providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Wrapper });
};

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

// Mock the useFeed hook
const mockUseFeed = vi.fn();
vi.mock('@/hooks/useFeed', () => ({
  useFeed: () => mockUseFeed(),
}));

// Helper to create mock friends
const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: `friend-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Friend',
  tier: 'core',
  addedAt: new Date(),
  ...overrides,
});

const defaultMockHookReturn = {
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
};

describe('EmptyFeedState - Navigation to Manage Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  describe('Button Display', () => {
    it('should show a single "Add [Tier] Friends" button when user has no friends in the tier', () => {
      renderWithProviders(
        <EmptyFeedState
          tier="core"
          hasFriends={false}
          onGoToManage={() => {}}
        />
      );

      // Should have exactly one button that includes "Add" and "Friends"
      const addButton = screen.getByRole('button', { name: /add.*friends/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should NOT show a separate "Go to Manage" button - only the Add Friends button', () => {
      renderWithProviders(
        <EmptyFeedState
          tier="core"
          hasFriends={false}
          onGoToManage={() => {}}
        />
      );

      // Should only have one button (Add Friends navigates to manage)
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('should show "Add Core Friends" for Core feed', () => {
      renderWithProviders(
        <EmptyFeedState
          tier="core"
          hasFriends={false}
          onGoToManage={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /add core friends/i })).toBeInTheDocument();
    });

    it('should show "Add Inner Circle Friends" for Inner feed', () => {
      renderWithProviders(
        <EmptyFeedState
          tier="inner"
          hasFriends={false}
          onGoToManage={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /add inner.*friends/i })).toBeInTheDocument();
    });

    it('should show "Add Outer Circle Friends" for Outer+ feed', () => {
      renderWithProviders(
        <EmptyFeedState
          tier="outer"
          hasFriends={false}
          onGoToManage={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /add outer.*friends/i })).toBeInTheDocument();
    });
  });

  describe('Button Navigation', () => {
    it('should call onGoToManage when "Add Friends" button is clicked', () => {
      const onGoToManage = vi.fn();
      renderWithProviders(
        <EmptyFeedState
          tier="core"
          hasFriends={false}
          onGoToManage={onGoToManage}
        />
      );

      const addButton = screen.getByRole('button', { name: /add.*friends/i });
      fireEvent.click(addButton);

      expect(onGoToManage).toHaveBeenCalled();
    });
  });
});

describe('TierFeed - Empty State Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should pass onGoToManage to EmptyFeedState', () => {
    const onGoToManage = vi.fn();

    renderWithProviders(
      <TierFeed
        tier="core"
        friends={[]}
        userId="user-123"
        isLoggedIn={true}
        onGoToManage={onGoToManage}
      />
    );

    // Click the add friends button
    const addButton = screen.getByRole('button', { name: /add.*friends/i });
    fireEvent.click(addButton);

    expect(onGoToManage).toHaveBeenCalled();
  });

  it('should show Add Friends button when no friends in Core feed', () => {
    renderWithProviders(
      <TierFeed
        tier="core"
        friends={[]}
        userId="user-123"
        isLoggedIn={true}
        onGoToManage={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /add core friends/i })).toBeInTheDocument();
  });

  it('should show Add Friends button when no friends in Inner feed', () => {
    renderWithProviders(
      <TierFeed
        tier="inner"
        friends={[]}
        userId="user-123"
        isLoggedIn={true}
        onGoToManage={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /add inner.*friends/i })).toBeInTheDocument();
  });

  it('should show Add Friends button when no friends in Outer+ feed', () => {
    renderWithProviders(
      <TierFeed
        tier="outer"
        friends={[]}
        userId="user-123"
        isLoggedIn={true}
        onGoToManage={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /add outer.*friends/i })).toBeInTheDocument();
  });
});

describe('FeedTabs - Empty State Navigation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should switch to Manage tab when Add Friends button is clicked in Core feed', async () => {
    const user = userEvent.setup();

    // Start with friends so we default to Core Feed, but no core friends
    const friends = [createMockFriend({ tier: 'outer' })];

    renderWithRouter(
      <FeedTabs
        friends={friends}
        isLoggedIn={true}
        userId="user-123"
      />
    );

    // Verify we're on Core Feed
    expect(screen.getByRole('tab', { name: /core feed/i })).toHaveAttribute('data-state', 'active');

    // Click the "Add Core Friends" button
    const addButton = screen.getByRole('button', { name: /add core friends/i });
    await user.click(addButton);

    // Should now be on Manage tab
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /manage/i })).toHaveAttribute('data-state', 'active');
    });
  });

  it('should switch to Manage tab when Add Friends button is clicked in Inner feed', async () => {
    const user = userEvent.setup();

    const friends = [createMockFriend({ tier: 'core' })];

    renderWithRouter(
      <FeedTabs
        friends={friends}
        isLoggedIn={true}
        userId="user-123"
      />,
      { initialEntries: ['/?tab=inner'] }
    );

    // Verify we're on Inner Feed
    expect(screen.getByRole('tab', { name: /inner feed/i })).toHaveAttribute('data-state', 'active');

    // Click the "Add Inner Friends" button
    const addButton = screen.getByRole('button', { name: /add inner.*friends/i });
    await user.click(addButton);

    // Should now be on Manage tab
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /manage/i })).toHaveAttribute('data-state', 'active');
    });
  });

  it('should switch to Manage tab when Add Friends button is clicked in Outer+ feed', async () => {
    const user = userEvent.setup();

    const friends = [createMockFriend({ tier: 'core' })];

    renderWithRouter(
      <FeedTabs
        friends={friends}
        isLoggedIn={true}
        userId="user-123"
      />,
      { initialEntries: ['/?tab=outer'] }
    );

    // Verify we're on Outer+ Feed
    expect(screen.getByRole('tab', { name: /outer plus/i })).toHaveAttribute('data-state', 'active');

    // Click the "Add Outer Friends" button
    const addButton = screen.getByRole('button', { name: /add outer.*friends/i });
    await user.click(addButton);

    // Should now be on Manage tab
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /manage/i })).toHaveAttribute('data-state', 'active');
    });
  });
});

describe('EmptyFeedState - Simplified UI', () => {
  it('should have a clean, single call-to-action for users without friends in tier', () => {
    renderWithProviders(
      <EmptyFeedState
        tier="core"
        hasFriends={false}
        onGoToManage={() => {}}
      />
    );

    // Only one button should be visible
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);

    // That button should be the Add Friends button
    expect(buttons[0]).toHaveTextContent(/add.*friends/i);
  });

  it('should not confuse users with multiple buttons that do the same thing', () => {
    renderWithProviders(
      <EmptyFeedState
        tier="inner"
        hasFriends={false}
        onGoToManage={() => {}}
      />
    );

    // Should NOT have a separate "Go to Manage" button
    expect(screen.queryByRole('button', { name: /^go to manage$/i })).not.toBeInTheDocument();
  });
});

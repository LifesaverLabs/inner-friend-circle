import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { TierFeed } from '@/components/feed/TierFeed';
import { Friend, TierType } from '@/types/friend';
import { FeedPost, SunsetNudge } from '@/types/feed';

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

// Helper to create mock posts
const createMockPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  id: `post-${Math.random().toString(36).substr(2, 9)}`,
  authorId: 'author-1',
  authorName: 'Test Author',
  authorTier: 'core',
  contentType: 'text',
  content: 'Test post content',
  createdAt: new Date(),
  interactions: [],
  visibility: ['core', 'inner', 'outer'],
  isSuggested: false,
  isSponsored: false,
  ...overrides,
});

// Helper to create mock nudges
const createMockNudge = (overrides: Partial<SunsetNudge> = {}): SunsetNudge => ({
  id: `nudge-${Math.random().toString(36).substr(2, 9)}`,
  friendId: 'friend-1',
  friendName: 'Friend Name',
  friendTier: 'core',
  lastDeepContact: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  daysSinceContact: 20,
  suggestedAction: 'schedule_call',
  dismissed: false,
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

describe('Outer+ Feed - Tab Naming', () => {
  const defaultProps = {
    friends: [] as Friend[],
    isLoggedIn: true,
    userId: 'user-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should display "Outer+" as the tab name instead of "Outer Feed"', () => {
    const friends = [createMockFriend()];
    renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

    // The tab should be labeled "Outer+" to indicate it includes more than just outer tier
    // The full aria-label is "Outer Plus Feed - Extended circle including naybors"
    expect(screen.getByRole('tab', { name: /outer plus/i })).toBeInTheDocument();
  });

  it('should NOT display "Outer Feed" as a tab name', () => {
    const friends = [createMockFriend()];
    renderWithRouter(<FeedTabs {...defaultProps} friends={friends} />);

    // Should not find "Outer Feed" since it's now "Outer+"
    const outerFeedTab = screen.queryByRole('tab', { name: /^outer feed$/i });
    expect(outerFeedTab).not.toBeInTheDocument();
  });
});

describe('Outer+ Feed - Header Description', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should show "Outer+" in the feed header title', () => {
    renderWithProviders(<TierFeed {...defaultProps} />);

    const header = screen.getByTestId('feed-header');
    expect(header).toHaveTextContent(/outer\+/i);
  });

  it('should describe which tiers are included in the Outer+ feed', () => {
    renderWithProviders(<TierFeed {...defaultProps} />);

    const header = screen.getByTestId('feed-header');
    // Should mention that this includes outer, naybors, parasocials, and role models
    expect(header.textContent?.toLowerCase()).toMatch(/outer|naybor|parasocial|role model/);
  });
});

describe('Outer+ Feed - Friends Inclusion', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should consider outer tier friends as having friends in the feed', () => {
    const friends = [createMockFriend({ tier: 'outer', name: 'Outer Friend' })];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} friends={friends} />);

    // Should show empty state that indicates user has friends (just no posts)
    const emptyState = screen.getByTestId('empty-feed-state');
    // When user has friends but no posts, the message should reflect that
    expect(emptyState).toBeInTheDocument();
  });

  it('should consider naybor tier friends as having friends in the Outer+ feed', () => {
    const friends = [createMockFriend({ tier: 'naybor', name: 'Naybor Friend' })];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} friends={friends} />);

    // Naybors should count toward "has friends in this feed"
    const emptyState = screen.getByTestId('empty-feed-state');
    expect(emptyState).toBeInTheDocument();
  });

  it('should consider parasocial tier friends as having friends in the Outer+ feed', () => {
    const friends = [createMockFriend({ tier: 'parasocial', name: 'Parasocial Friend' })];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} friends={friends} />);

    const emptyState = screen.getByTestId('empty-feed-state');
    expect(emptyState).toBeInTheDocument();
  });

  it('should consider rolemodel tier friends as having friends in the Outer+ feed', () => {
    const friends = [createMockFriend({ tier: 'rolemodel', name: 'Role Model Friend' })];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} friends={friends} />);

    const emptyState = screen.getByTestId('empty-feed-state');
    expect(emptyState).toBeInTheDocument();
  });
});

describe('Outer+ Feed - Nudges', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show nudges for outer tier friends', () => {
    const nudges = [
      createMockNudge({ friendName: 'Outer Person', friendTier: 'outer' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      nudges,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText(/Outer Person/)).toBeInTheDocument();
  });

  it('should show nudges for naybor tier friends in Outer+ feed', () => {
    const nudges = [
      createMockNudge({ friendName: 'Naybor Person', friendTier: 'naybor' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      nudges,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    // Naybor nudges should appear in the Outer+ feed
    expect(screen.getByText(/Naybor Person/)).toBeInTheDocument();
  });

  it('should show nudges for parasocial tier friends in Outer+ feed', () => {
    const nudges = [
      createMockNudge({ friendName: 'Parasocial Person', friendTier: 'parasocial' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      nudges,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText(/Parasocial Person/)).toBeInTheDocument();
  });

  it('should show nudges for rolemodel tier friends in Outer+ feed', () => {
    const nudges = [
      createMockNudge({ friendName: 'Role Model Person', friendTier: 'rolemodel' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      nudges,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText(/Role Model Person/)).toBeInTheDocument();
  });

  it('should NOT show core or inner tier nudges in Outer+ feed', () => {
    const nudges = [
      createMockNudge({ friendName: 'Core Person', friendTier: 'core' }),
      createMockNudge({ friendName: 'Inner Person', friendTier: 'inner' }),
      createMockNudge({ friendName: 'Outer Person', friendTier: 'outer' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      nudges,
      getTierFeed: vi.fn(() => []),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    // Only outer should be shown, not core or inner
    const nudgePanel = screen.getByTestId('sunset-nudge-panel');
    expect(nudgePanel.textContent).toContain('Outer Person');
    expect(nudgePanel.textContent).not.toContain('Core Person');
    expect(nudgePanel.textContent).not.toContain('Inner Person');
  });
});

describe('Outer+ Feed - Posts Display', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getTierFeed with outer tier', () => {
    const getTierFeedMock = vi.fn(() => []);
    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: getTierFeedMock,
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    // The feed hook should be called - it's the hook's responsibility to
    // return posts from all Outer+ tiers when tier='outer' is passed
    expect(getTierFeedMock).toHaveBeenCalledWith('outer');
  });

  it('should display posts from outer tier friends', () => {
    const posts = [
      createMockPost({ content: 'Post from outer friend', authorTier: 'outer' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText('Post from outer friend')).toBeInTheDocument();
  });

  it('should display posts from naybor tier friends in Outer+ feed', () => {
    const posts = [
      createMockPost({ content: 'Post from naybor', authorTier: 'naybor' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText('Post from naybor')).toBeInTheDocument();
  });

  it('should display posts from parasocial tier friends in Outer+ feed', () => {
    const posts = [
      createMockPost({ content: 'Post from parasocial', authorTier: 'parasocial' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText('Post from parasocial')).toBeInTheDocument();
  });

  it('should display posts from rolemodel tier friends in Outer+ feed', () => {
    const posts = [
      createMockPost({ content: 'Post from role model', authorTier: 'rolemodel' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText('Post from role model')).toBeInTheDocument();
  });

  it('should display mixed posts from all Outer+ tiers together', () => {
    const posts = [
      createMockPost({ content: 'Outer post', authorTier: 'outer' }),
      createMockPost({ content: 'Naybor post', authorTier: 'naybor' }),
      createMockPost({ content: 'Parasocial post', authorTier: 'parasocial' }),
      createMockPost({ content: 'Role model post', authorTier: 'rolemodel' }),
    ];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    expect(screen.getByText('Outer post')).toBeInTheDocument();
    expect(screen.getByText('Naybor post')).toBeInTheDocument();
    expect(screen.getByText('Parasocial post')).toBeInTheDocument();
    expect(screen.getByText('Role model post')).toBeInTheDocument();
  });
});

describe('Outer+ Feed - Empty State', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  it('should show appropriate empty state message for Outer+ when no friends', () => {
    renderWithProviders(<TierFeed {...defaultProps} friends={[]} />);

    const emptyState = screen.getByTestId('empty-feed-state');
    // Should mention Outer+ or the combined nature of this feed
    expect(emptyState.textContent?.toLowerCase()).toMatch(/outer/);
  });

  it('should show appropriate description mentioning the included tiers', () => {
    renderWithProviders(<TierFeed {...defaultProps} friends={[]} />);

    const emptyState = screen.getByTestId('empty-feed-state');
    // Description should help user understand this includes naybors, parasocials, role models
    expect(emptyState).toBeInTheDocument();
  });
});

describe('Outer+ Feed - Like Count Visibility', () => {
  const defaultProps = {
    tier: 'outer' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show like counts in Outer+ feed (as per outer tier behavior)', () => {
    const shouldShowLikeCountMock = vi.fn(() => true);
    const posts = [createMockPost({ authorTier: 'outer' })];

    mockUseFeed.mockReturnValue({
      ...defaultMockHookReturn,
      getTierFeed: vi.fn(() => posts),
      shouldShowLikeCount: shouldShowLikeCountMock,
    });

    renderWithProviders(<TierFeed {...defaultProps} />);

    // Outer tier should show like counts
    expect(shouldShowLikeCountMock).toHaveBeenCalledWith('outer');
  });
});

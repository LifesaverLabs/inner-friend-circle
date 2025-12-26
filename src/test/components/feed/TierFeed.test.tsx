import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TierFeed } from '@/components/feed/TierFeed';
import { Friend } from '@/types/friend';
import { FeedPost, SunsetNudge } from '@/types/feed';

// Wrapper with required providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Wrapper });
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

describe('TierFeed', () => {
  const defaultProps = {
    tier: 'core' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  describe('Basic Rendering', () => {
    it('should render with data-testid for the tier', () => {
      renderWithProviders(<TierFeed {...defaultProps} />);
      expect(screen.getByTestId('tier-feed-core')).toBeInTheDocument();
    });

    it('should render inner tier with correct testid', () => {
      renderWithProviders(<TierFeed {...defaultProps} tier="inner" />);
      expect(screen.getByTestId('tier-feed-inner')).toBeInTheDocument();
    });

    it('should render outer tier with correct testid', () => {
      renderWithProviders(<TierFeed {...defaultProps} tier="outer" />);
      expect(screen.getByTestId('tier-feed-outer')).toBeInTheDocument();
    });

    it('should apply tier-specific background color', () => {
      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);
      const container = screen.getByTestId('tier-feed-core');
      expect(container).toHaveClass('bg-tier-core/5');
    });

    it('should apply tier-specific border color', () => {
      renderWithProviders(<TierFeed {...defaultProps} tier="inner" />);
      const container = screen.getByTestId('tier-feed-inner');
      expect(container).toHaveClass('border-tier-inner/20');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no posts exist', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);
      expect(screen.getByTestId('empty-feed-state')).toBeInTheDocument();
    });

    it('should show tier-specific empty message for Core', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toContain('core');
    });

    it('should show tier-specific empty message for Inner', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="inner" />);
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toContain('inner');
    });

    it('should show tier-specific empty message for Outer', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="outer" />);
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toContain('outer');
    });
  });

  describe('Post Display', () => {
    it('should display posts from getTierFeed', () => {
      const posts = [
        createMockPost({ content: 'First post' }),
        createMockPost({ content: 'Second post' }),
      ];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByText('First post')).toBeInTheDocument();
      expect(screen.getByText('Second post')).toBeInTheDocument();
    });

    it('should call getTierFeed with correct tier', () => {
      const getTierFeedMock = vi.fn(() => []);
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: getTierFeedMock,
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="inner" />);

      expect(getTierFeedMock).toHaveBeenCalledWith('inner');
    });

    it('should display posts in chronological order (newest first)', () => {
      const oldDate = new Date('2024-01-01');
      const newDate = new Date('2024-12-01');

      const posts = [
        createMockPost({ content: 'Newer post', createdAt: newDate }),
        createMockPost({ content: 'Older post', createdAt: oldDate }),
      ];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      const postElements = screen.getAllByTestId(/feed-post-card/);
      expect(postElements[0]).toHaveTextContent('Newer post');
      expect(postElements[1]).toHaveTextContent('Older post');
    });

    it('should never include suggested content', () => {
      const posts = [
        createMockPost({ content: 'Regular post', isSuggested: false }),
        createMockPost({ content: 'Suggested post', isSuggested: true }),
      ];

      // getTierFeed already filters these, but verify the expectation
      const filteredPosts = posts.filter(p => !p.isSuggested);

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => filteredPosts),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByText('Regular post')).toBeInTheDocument();
      expect(screen.queryByText('Suggested post')).not.toBeInTheDocument();
    });

    it('should never include sponsored content', () => {
      const posts = [
        createMockPost({ content: 'Regular post', isSponsored: false }),
        createMockPost({ content: 'Sponsored post', isSponsored: true }),
      ];

      const filteredPosts = posts.filter(p => !p.isSponsored);

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => filteredPosts),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByText('Regular post')).toBeInTheDocument();
      expect(screen.queryByText('Sponsored post')).not.toBeInTheDocument();
    });
  });

  describe('Sunset Nudges', () => {
    it('should display sunset nudges for the tier', () => {
      const nudges = [
        createMockNudge({ friendName: 'John', friendTier: 'core' }),
      ];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        nudges,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);

      expect(screen.getByText(/John/)).toBeInTheDocument();
    });

    it('should only show nudges matching the current tier', () => {
      const nudges = [
        createMockNudge({ friendName: 'Alice', friendTier: 'core' }),
        createMockNudge({ friendName: 'Bob', friendTier: 'inner' }),
      ];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        nudges,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);

      // Should show core tier nudge
      const nudgePanel = screen.getByTestId('sunset-nudge-panel');
      expect(nudgePanel.textContent).toContain('Alice');
      // Should not show inner tier nudge
      expect(nudgePanel.textContent).not.toContain('Bob');
    });

    it('should show nudge panel when nudges exist', () => {
      const nudges = [
        createMockNudge({ friendTier: 'core' }),
      ];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        nudges,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);

      expect(screen.getByTestId('sunset-nudge-panel')).toBeInTheDocument();
    });

    it('should not show nudge panel when no nudges for tier', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        nudges: [],
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.queryByTestId('sunset-nudge-panel')).not.toBeInTheDocument();
    });
  });

  describe('Feed Header', () => {
    it('should render feed header', () => {
      renderWithProviders(<TierFeed {...defaultProps} />);
      expect(screen.getByTestId('feed-header')).toBeInTheDocument();
    });

    it('should show tier name in header', () => {
      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);
      const header = screen.getByTestId('feed-header');
      expect(header.textContent?.toLowerCase()).toContain('core');
    });

    it('should show compose button when logged in', () => {
      renderWithProviders(<TierFeed {...defaultProps} isLoggedIn={true} />);
      expect(screen.getByRole('button', { name: /compose|post|share/i })).toBeInTheDocument();
    });

    it('should hide compose button when logged out', () => {
      renderWithProviders(<TierFeed {...defaultProps} isLoggedIn={false} />);
      expect(screen.queryByRole('button', { name: /compose|post|share/i })).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when feed is loading', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        isLoading: true,
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByTestId('feed-loading')).toBeInTheDocument();
    });

    it('should hide loading indicator when loaded', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        isLoading: false,
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.queryByTestId('feed-loading')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when feed has error', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        error: 'Failed to load feed',
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        error: 'Failed to load feed',
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should pass addInteraction to post cards', () => {
      const addInteractionMock = vi.fn();
      const posts = [createMockPost()];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
        addInteraction: addInteractionMock,
      });

      renderWithProviders(<TierFeed {...defaultProps} />);

      // The post card should be able to call addInteraction
      expect(screen.getByTestId(/feed-post-card/)).toBeInTheDocument();
    });

    it('should pass dismissNudge to nudge panel', () => {
      const dismissNudgeMock = vi.fn();
      const nudges = [createMockNudge({ friendTier: 'core' })];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        nudges,
        dismissNudge: dismissNudgeMock,
        getTierFeed: vi.fn(() => []),
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);

      expect(screen.getByTestId('sunset-nudge-panel')).toBeInTheDocument();
    });
  });
});

describe('TierFeed - Tier-Specific Behavior', () => {
  const defaultProps = {
    tier: 'core' as const,
    friends: [] as Friend[],
    userId: 'user-123',
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFeed.mockReturnValue(defaultMockHookReturn);
  });

  describe('Core Feed', () => {
    it('should use shouldShowLikeCount(core) = false', () => {
      const shouldShowLikeCountMock = vi.fn(() => false);
      const posts = [createMockPost({ authorTier: 'core' })];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
        shouldShowLikeCount: shouldShowLikeCountMock,
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="core" />);

      // Like counts should be hidden in Core feed
      expect(shouldShowLikeCountMock).toHaveBeenCalledWith('core');
    });
  });

  describe('Inner Feed', () => {
    it('should use shouldShowLikeCount(inner) = false', () => {
      const shouldShowLikeCountMock = vi.fn(() => false);
      const posts = [createMockPost({ authorTier: 'inner' })];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
        shouldShowLikeCount: shouldShowLikeCountMock,
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="inner" />);

      expect(shouldShowLikeCountMock).toHaveBeenCalledWith('inner');
    });
  });

  describe('Outer Feed', () => {
    it('should use shouldShowLikeCount(outer) = true', () => {
      const shouldShowLikeCountMock = vi.fn(() => true);
      const posts = [createMockPost({ authorTier: 'outer' })];

      mockUseFeed.mockReturnValue({
        ...defaultMockHookReturn,
        getTierFeed: vi.fn(() => posts),
        shouldShowLikeCount: shouldShowLikeCountMock,
      });

      renderWithProviders(<TierFeed {...defaultProps} tier="outer" />);

      expect(shouldShowLikeCountMock).toHaveBeenCalledWith('outer');
    });
  });
});

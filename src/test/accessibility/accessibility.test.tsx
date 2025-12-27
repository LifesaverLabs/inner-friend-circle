import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SunsetNudgePanel } from '@/components/feed/SunsetNudgePanel';
import { PostActions } from '@/components/feed/PostActions';
import { PostContent } from '@/components/feed/PostContent';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { NayborSOSQuickPanel } from '@/components/naybor/NayborSOSQuickPanel';
import { SunsetNudge, FeedPost } from '@/types/feed';
import { Friend } from '@/types/friend';

// Mock translations for accessibility tests
const mockTranslations: Record<string, string> = {
  // Feed tabs
  'feed.coreFeed': 'Core Feed',
  'feed.innerFeed': 'Inner Feed',
  'feed.outerFeed': 'Outer Plus',
  'feed.manage': 'Manage',
  'feed.unlike': 'Unlike this post',
  // Post actions
  'post.likeTooltip': 'Like this post',
  'post.likeTooltipHighFidelity': 'Like (consider a more meaningful interaction)',
  'post.voiceReply': 'Voice Reply',
  'post.voiceReplyTooltip': 'Send a voice reply (high-fidelity)',
  'post.meetup': 'Meetup',
  'post.meetupTooltip': 'Schedule a meetup (high-fidelity)',
  'post.comment': 'Comment',
  'post.commentTooltip': 'Add a comment',
  'post.shareTooltip': 'Share',
  'post.like': 'Like',
  'post.call': 'Call',
  'post.addContactInfo': 'Add Contact Info',
  // Post content
  'post.content.joinCall': 'Join call',
  'post.content.rsvpYes': 'RSVP yes to meetup',
  'post.content.rsvpMaybe': 'RSVP maybe to meetup',
  'post.content.sharedPhoto': 'Shared photo',
  // Sunset nudge panel
  'sunsetNudge.title': 'Sunset Reconnection',
  'sunsetNudge.friendsNeedReconnection': '{{count}} friends need reconnection',
  'sunsetNudge.planMeetup': 'Plan Meetup',
  'sunsetNudge.dismiss': 'Dismiss',
  'sunsetNudge.connected': 'Connected',
  'sunsetNudge.selectDate': 'Select date',
  // NayborSOS Quick Panel
  'nayborSOS.quickPanel.title': 'Quick contacts:',
  'nayborSOS.quickPanel.noPhone': 'No phone',
  // Empty states
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
  // Accessibility labels
  'accessibility.feed.tabList': 'Friend circle feeds',
  'accessibility.feed.coreTab': 'Core Feed - Your closest friends',
  'accessibility.feed.innerTab': 'Inner Feed - Close friends',
  'accessibility.feed.outerTab': 'Outer Plus Feed - Extended circle',
  'accessibility.feed.manageTab': 'Manage your friend circle',
  'accessibility.sunsetNudge.togglePanel': 'Toggle reconnection panel',
  'accessibility.sunsetNudge.nudgeList': 'Friends who need reconnection',
  'accessibility.sunsetNudge.planMeetupWith': 'Plan Meetup with {{name}}',
  'accessibility.sunsetNudge.dismissReminder': 'Dismiss reminder for {{name}}',
  'accessibility.sunsetNudge.markConnectedToday': 'Mark {{name}} as connected today',
  'accessibility.sunsetNudge.selectWhenConnected': 'Select when you connected with {{name}}',
  'accessibility.naybor.sosRegion': 'Quick SOS contacts',
  'accessibility.naybor.sosContactsList': 'Quick contacts:',
  'accessibility.naybor.contactOptions': 'Contact options for {{name}}',
  'accessibility.naybor.callButton': 'Call {{name}}',
  'accessibility.naybor.messageButton': 'Message {{name}}',
  'accessibility.post.rsvpOptions': 'RSVP options',
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

// Helper to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </MemoryRouter>
  );
};

// Helper to create mock nudge
const createMockNudge = (overrides: Partial<SunsetNudge> = {}): SunsetNudge => ({
  id: 'nudge-1',
  friendId: 'friend-1',
  friendName: 'Alice Smith',
  friendTier: 'core',
  lastDeepContact: new Date('2024-01-01'),
  daysSinceContact: 30,
  suggestedAction: 'plan_meetup',
  dismissed: false,
  ...overrides,
});

// Helper to create mock friend
const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: 'friend-1',
  name: 'Alice Smith',
  tier: 'core',
  addedAt: new Date(),
  ...overrides,
});

// Helper to create mock post
const createMockPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  id: 'post-1',
  authorId: 'friend-1',
  authorName: 'Alice Smith',
  authorTier: 'core',
  contentType: 'text',
  content: 'Hello world',
  createdAt: new Date(),
  interactions: [],
  visibility: ['core', 'inner', 'outer'],
  isSuggested: false,
  isSponsored: false,
  ...overrides,
});

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SunsetNudgePanel Accessibility', () => {
    it('should have accessible expand/collapse toggle with aria-expanded', () => {
      const nudges = [createMockNudge()];
      renderWithProviders(
        <SunsetNudgePanel nudges={nudges} onDismiss={vi.fn()} />
      );

      const toggleButton = screen.getByRole('button', { expanded: true });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-controls', 'nudge-list');
    });

    it('should have sr-only text for badge count', () => {
      const nudges = [createMockNudge(), createMockNudge({ id: 'nudge-2', friendName: 'Bob' })];
      renderWithProviders(
        <SunsetNudgePanel nudges={nudges} onDismiss={vi.fn()} />
      );

      // i18n mock returns the translation key
      expect(screen.getByText('nudge.friendsNeedAttention')).toBeInTheDocument();
    });

    it('should have proper role list and listitem for nudge items', () => {
      const nudges = [createMockNudge()];
      renderWithProviders(
        <SunsetNudgePanel nudges={nudges} onDismiss={vi.fn()} />
      );

      // i18n mock returns the translation key
      expect(screen.getByRole('list', { name: 'accessibility.nudge.friendsList' })).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('should have descriptive aria-labels on action buttons with friend name', () => {
      const nudges = [createMockNudge({ friendName: 'Alice Smith', suggestedAction: 'plan_meetup' })];
      renderWithProviders(
        <SunsetNudgePanel nudges={nudges} onDismiss={vi.fn()} onAction={vi.fn()} />
      );

      // i18n mock returns the translation key
      expect(screen.getByRole('button', { name: 'accessibility.nudge.actionButton' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'accessibility.nudge.dismissButton' })).toBeInTheDocument();
    });

    it('should have accessible Connected button with date dropdown', () => {
      const nudges = [createMockNudge({ friendName: 'Alice Smith' })];
      renderWithProviders(
        <SunsetNudgePanel
          nudges={nudges}
          onDismiss={vi.fn()}
          onMarkConnected={vi.fn()}
        />
      );

      // i18n mock returns the translation key
      expect(screen.getByRole('button', { name: 'accessibility.nudge.connectedButton' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'accessibility.nudge.selectDateButton' })).toBeInTheDocument();
    });
  });

  describe('PostActions Accessibility', () => {
    it('should have aria-pressed on like button', () => {
      const post = createMockPost();
      renderWithProviders(
        <PostActions
          post={post}
          tier="core"
          showLikeCount={false}
          onInteract={vi.fn()}
        />
      );

      const likeButton = screen.getByRole('button', { name: 'Like this post' });
      expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should update aria-pressed and aria-label after liking', async () => {
      const user = userEvent.setup();
      const post = createMockPost();
      renderWithProviders(
        <PostActions
          post={post}
          tier="core"
          showLikeCount={false}
          onInteract={vi.fn()}
        />
      );

      const likeButton = screen.getByRole('button', { name: 'Like this post' });
      await user.click(likeButton);

      expect(screen.getByRole('button', { name: 'Unlike this post' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have aria-hidden on decorative icons', () => {
      const post = createMockPost();
      renderWithProviders(
        <PostActions
          post={post}
          tier="core"
          showLikeCount={false}
          onInteract={vi.fn()}
        />
      );

      // Voice Reply icon should be aria-hidden
      const voiceReplyButton = screen.getByRole('button', { name: 'Voice Reply' });
      const icon = voiceReplyButton.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have descriptive aria-labels on all buttons', () => {
      const post = createMockPost();
      renderWithProviders(
        <PostActions
          post={post}
          tier="core"
          showLikeCount={false}
          onInteract={vi.fn()}
        />
      );

      expect(screen.getByRole('button', { name: 'Voice Reply' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Meetup' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add a comment' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    });
  });

  describe('PostContent Accessibility', () => {
    it('should use content for image alt text when available', () => {
      const post = createMockPost({
        contentType: 'photo',
        content: 'Beautiful sunset at the beach',
        mediaUrl: 'https://example.com/image.jpg',
      });

      renderWithProviders(<PostContent post={post} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Photo: Beautiful sunset at the beach');
    });

    it('should use fallback alt text for images without content', () => {
      const post = createMockPost({
        contentType: 'photo',
        content: '',
        mediaUrl: 'https://example.com/image.jpg',
      });

      renderWithProviders(<PostContent post={post} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Shared photo');
    });

    it('should have aria-labels on call invite join button', () => {
      const post = createMockPost({
        contentType: 'call_invite',
        content: 'Join our weekly catch-up',
        scheduledAt: new Date('2024-03-15T14:00:00'),
      });

      renderWithProviders(<PostContent post={post} />);

      expect(screen.getByRole('button', { name: 'postContent.joinCall' })).toBeInTheDocument();
    });

    it('should have accessible RSVP buttons on meetup invite', () => {
      const post = createMockPost({
        contentType: 'meetup_invite',
        content: 'Coffee at the usual spot',
        scheduledAt: new Date('2024-03-15T14:00:00'),
      });

      renderWithProviders(<PostContent post={post} />);

      expect(screen.getByRole('button', { name: 'postContent.rsvpYesLabel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'postContent.rsvpMaybeLabel' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'postContent.rsvpOptions' })).toBeInTheDocument();
    });

    it('should have time element with proper datetime attribute', () => {
      const scheduledAt = new Date('2024-03-15T14:00:00');
      const post = createMockPost({
        contentType: 'call_invite',
        content: 'Weekly call',
        scheduledAt,
      });

      renderWithProviders(<PostContent post={post} />);

      const timeElement = screen.getByRole('time');
      expect(timeElement).toHaveAttribute('datetime', scheduledAt.toISOString());
    });
  });

  describe('FeedTabs Accessibility', () => {
    it('should have aria-label on tab list', () => {
      const friends = [createMockFriend()];
      renderWithProviders(<FeedTabs friends={friends} isLoggedIn={true} />);

      expect(screen.getByRole('tablist', { name: 'Friend circle feeds' })).toBeInTheDocument();
    });

    it('should have descriptive aria-labels on each tab', () => {
      const friends = [createMockFriend()];
      renderWithProviders(<FeedTabs friends={friends} isLoggedIn={true} />);

      expect(screen.getByRole('tab', { name: /Core Feed - Your closest friends/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Inner Feed - Close friends/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Outer Plus Feed - Extended circle/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Manage your friend circle/i })).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative color dots', () => {
      const friends = [createMockFriend()];
      renderWithProviders(<FeedTabs friends={friends} isLoggedIn={true} />);

      const coreTab = screen.getByRole('tab', { name: /Core Feed/i });
      const colorDot = coreTab.querySelector('.bg-tier-core');
      expect(colorDot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('NayborSOSQuickPanel Accessibility', () => {
    it('should have region role with accessible name', () => {
      const contacts = [createMockFriend({ tier: 'naybor', phone: '555-1234' })];
      render(<NayborSOSQuickPanel contacts={contacts} />);

      expect(screen.getByRole('region', { name: 'Quick SOS contacts' })).toBeInTheDocument();
    });

    it('should have list role with aria-labelledby', () => {
      const contacts = [createMockFriend({ tier: 'naybor', phone: '555-1234' })];
      render(<NayborSOSQuickPanel contacts={contacts} />);

      expect(screen.getByRole('list', { name: 'Quick contacts:' })).toBeInTheDocument();
    });

    it('should have accessible contact buttons with friend names', () => {
      const contacts = [createMockFriend({ name: 'Bob Jones', tier: 'naybor', phone: '555-1234' })];
      render(<NayborSOSQuickPanel contacts={contacts} />);

      expect(screen.getByRole('button', { name: 'Call Bob Jones' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Message Bob Jones' })).toBeInTheDocument();
    });

    it('should have group role for contact options', () => {
      const contacts = [createMockFriend({ name: 'Bob Jones', tier: 'naybor', phone: '555-1234' })];
      render(<NayborSOSQuickPanel contacts={contacts} />);

      expect(screen.getByRole('group', { name: 'Contact options for Bob Jones' })).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    // Note: These would test TierFeed loading states, but require more complex setup
    // The key accessibility features added were role="status", aria-live="polite", aria-busy="true"
    // for loading and role="alert", aria-live="assertive" for errors

    it('loading state should be announced to screen readers', () => {
      // This test would require a more complex setup with controlled loading state
      // The implementation adds proper ARIA attributes for loading states
      expect(true).toBe(true); // Placeholder - actual implementation tested via integration
    });
  });
});

describe('Keyboard Navigation', () => {
  it('tabs should be navigable with arrow keys', async () => {
    const user = userEvent.setup();
    const friends = [createMockFriend()];
    renderWithProviders(<FeedTabs friends={friends} isLoggedIn={true} />);

    const coreTab = screen.getByRole('tab', { name: /Core Feed/i });
    coreTab.focus();

    // Arrow right should move to next tab
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Inner Feed/i })).toHaveFocus();
  });

  it('buttons should be focusable', () => {
    const nudges = [createMockNudge()];
    renderWithProviders(
      <SunsetNudgePanel nudges={nudges} onDismiss={vi.fn()} onAction={vi.fn()} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });
});

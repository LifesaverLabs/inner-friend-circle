import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PostActions } from '@/components/feed/PostActions';
import { FeedPost } from '@/types/feed';
import { ContactMethod as FriendContactMethod } from '@/types/friend';

// Wrapper with required providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Wrapper });
};

// Mock window.open for contact URLs
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen, writable: true });

// Mock toast for notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock warning suppression utilities
vi.mock('@/lib/warningSuppressionUtils', () => ({
  isWarningSuppressed: vi.fn(() => false),
  suppressWarningUntilNextMonth: vi.fn(),
  SUPPRESSIBLE_METHODS: ['wechat', 'vk', 'max'],
}));

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

// Extended post with contact info for testing
interface TestPost extends FeedPost {
  authorPhone?: string;
  authorEmail?: string;
  authorPreferredContact?: FriendContactMethod;
}

const createTestPost = (overrides: Partial<TestPost> = {}): TestPost => ({
  ...createMockPost(),
  ...overrides,
});

describe('PostActions', () => {
  const mockOnInteract = vi.fn();
  const mockOnRequestContactInfo = vi.fn();
  const mockOnContactMethodChange = vi.fn();

  // Default props with phone for call button tests
  const defaultPropsWithPhone = {
    post: createMockPost(),
    tier: 'core' as const,
    showLikeCount: false,
    onInteract: mockOnInteract,
    authorPhone: '+15551234567',
  };

  // Default props without phone (shows Add Contact Info)
  const defaultProps = {
    post: createMockPost(),
    tier: 'core' as const,
    showLikeCount: false,
    onInteract: mockOnInteract,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowOpen.mockClear();
  });

  describe('Call Button - Basic Rendering', () => {
    it('should render call button when author has phone', () => {
      renderWithProviders(<PostActions {...defaultPropsWithPhone} />);
      expect(screen.getByRole('button', { name: /call via/i })).toBeInTheDocument();
    });

    it('should show call button prominently in core tier when author has phone', () => {
      renderWithProviders(<PostActions {...defaultPropsWithPhone} tier="core" />);
      const callButton = screen.getByRole('button', { name: /call via/i });
      // Core tier should have prominent styling (primary color)
      expect(callButton).toHaveClass('text-primary');
    });

    it('should show call button prominently in inner tier when author has phone', () => {
      renderWithProviders(<PostActions {...defaultPropsWithPhone} tier="inner" />);
      const callButton = screen.getByRole('button', { name: /call via/i });
      expect(callButton).toHaveClass('text-primary');
    });

    it('should show call button in outer tier when author has phone', () => {
      renderWithProviders(<PostActions {...defaultPropsWithPhone} tier="outer" />);
      // In outer tier, call button should exist
      const callButton = screen.getByRole('button', { name: /call via/i });
      expect(callButton).toBeInTheDocument();
    });
  });

  describe('Call Button - Initiating Contact', () => {
    it('should initiate phone call when author has phone and tel is preferred', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'tel',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith('tel:+15551234567', '_blank');
    });

    it('should initiate FaceTime when facetime is preferred', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'facetime',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith('facetime:+15551234567', '_blank');
    });

    it('should initiate WhatsApp call when whatsapp is preferred', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'whatsapp',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/15551234567'),
        '_blank'
      );
    });

    it('should initiate Signal call when signal is preferred', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'signal',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('signal.me'),
        '_blank'
      );
    });

    it('should initiate Telegram when telegram is preferred', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'telegram',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('t.me'),
        '_blank'
      );
    });

    it('should initiate WeChat when wechat is preferred', () => {
      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="wechat"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('weixin://'),
        '_blank'
      );
    });

    it('should show censorship warning when using WeChat', async () => {
      const { toast } = await import('sonner');

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="wechat"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      // Should show warning toast about surveillance with action to suppress
      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining('surveillance'),
        expect.objectContaining({ duration: 10000, action: expect.any(Object) })
      );
    });

    it('should show censorship warning when using VK Messenger', async () => {
      const { toast } = await import('sonner');

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="vk"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      // Should show warning toast about Russian surveillance
      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining('Russian government surveillance'),
        expect.objectContaining({ duration: 10000, action: expect.any(Object) })
      );
    });

    it('should show censorship warning when using MAX', async () => {
      const { toast } = await import('sonner');

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="max"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      // Should show warning toast about Rossiyan thought-kontrol
      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining('thought-kontrol'),
        expect.objectContaining({ duration: 10000, action: expect.any(Object) })
      );
    });

    it('should not show warning when suppressed for WeChat', async () => {
      const { toast } = await import('sonner');
      const { isWarningSuppressed } = await import('@/lib/warningSuppressionUtils');
      vi.mocked(isWarningSuppressed).mockReturnValue(true);

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="wechat"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      // Should NOT show warning toast when suppressed
      expect(toast.warning).not.toHaveBeenCalled();
      // But should still initiate the call
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('weixin://'),
        '_blank'
      );

      // Reset mock
      vi.mocked(isWarningSuppressed).mockReturnValue(false);
    });

    it('should include TearDownThisFirewall.org link in warning', async () => {
      const { toast } = await import('sonner');

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="wechat"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining('TearDownThisFirewall.org'),
        expect.any(Object)
      );
    });

    it('should include lifesaving liberty warning in message', async () => {
      const { toast } = await import('sonner');

      renderWithProviders(
        <PostActions
          post={createMockPost()}
          tier="core"
          showLikeCount={false}
          onInteract={mockOnInteract}
          authorPhone="+15551234567"
          authorPreferredContact="vk"
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(toast.warning).toHaveBeenCalledWith(
        expect.stringContaining('lifesaving liberty'),
        expect.any(Object)
      );
    });

    it('should default to tel when no preferred contact is set', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: undefined,
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
        />
      );

      const callButton = screen.getByRole('button', { name: /call/i });
      fireEvent.click(callButton);

      expect(mockWindowOpen).toHaveBeenCalledWith('tel:+15551234567', '_blank');
    });
  });

  describe('Contact Method Dropdown', () => {
    it('should show dropdown indicator when author has phone', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
        />
      );

      // Should show dropdown trigger button with chevron
      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      expect(dropdownTrigger).toBeInTheDocument();
    });

    it('should show contact method options in dropdown', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'tel',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      // Open dropdown
      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      await user.click(dropdownTrigger);

      // Should show all available contact methods
      expect(screen.getByText(/phone call/i)).toBeInTheDocument();
      expect(screen.getByText(/facetime/i)).toBeInTheDocument();
      expect(screen.getByText(/whatsapp/i)).toBeInTheDocument();
      expect(screen.getByText(/signal/i)).toBeInTheDocument();
      expect(screen.getByText(/telegram/i)).toBeInTheDocument();
      expect(screen.getByText(/wechat/i)).toBeInTheDocument();
    });

    it('should show warning indicator for WeChat in dropdown', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'tel',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      // Open dropdown
      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      await user.click(dropdownTrigger);

      // WeChat entry should have warning indicator
      const wechatItem = screen.getByText(/wechat/i).closest('[role="menuitem"]');
      expect(wechatItem).toHaveClass('text-amber-600');
    });

    it('should indicate current preferred method in dropdown', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'whatsapp',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
        />
      );

      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      await user.click(dropdownTrigger);

      // WhatsApp should be marked as selected
      const whatsappOption = screen.getByText(/whatsapp/i).closest('[role="menuitem"]');
      expect(whatsappOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should allow selecting a different contact method', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: '+15551234567',
        authorPreferredContact: 'tel',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          authorPreferredContact={post.authorPreferredContact}
          onContactMethodChange={mockOnContactMethodChange}
        />
      );

      // Open dropdown
      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      await user.click(dropdownTrigger);

      // Select WhatsApp
      const whatsappOption = screen.getByText(/whatsapp/i);
      await user.click(whatsappOption);

      // Should initiate WhatsApp call
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank'
      );
    });
  });

  describe('Add Contact Info Option', () => {
    it('should show "Add Contact Info" when author has no phone', () => {
      const post = createTestPost({
        authorPhone: undefined,
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={undefined}
        />
      );

      expect(screen.getByText(/add contact info/i)).toBeInTheDocument();
    });

    it('should call onRequestContactInfo when "Add Contact Info" is clicked', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: undefined,
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={undefined}
          onRequestContactInfo={mockOnRequestContactInfo}
        />
      );

      const addContactButton = screen.getByText(/add contact info/i);
      await user.click(addContactButton);

      expect(mockOnRequestContactInfo).toHaveBeenCalledWith(post.authorId);
    });

    it('should show "Add Contact Info" at end of dropdown when phone exists but user wants more options', async () => {
      const user = userEvent.setup();
      const post = createTestPost({
        authorPhone: '+15551234567',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
          onRequestContactInfo={mockOnRequestContactInfo}
        />
      );

      const dropdownTrigger = screen.getByTestId('contact-method-dropdown');
      await user.click(dropdownTrigger);

      // "Add Contact Info" should be in the dropdown
      expect(screen.getByText(/add more contact info/i)).toBeInTheDocument();
    });
  });

  describe('Tier-Specific Default Actions', () => {
    it('should show Voice Reply prominently for Core tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="core" />);
      const voiceButton = screen.getByRole('button', { name: /voice reply/i });
      expect(voiceButton).toHaveClass('text-primary');
    });

    it('should show Voice Reply prominently for Inner tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="inner" />);
      const voiceButton = screen.getByRole('button', { name: /voice reply/i });
      expect(voiceButton).toHaveClass('text-primary');
    });

    it('should show Meetup button prominently for Core tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="core" />);
      const meetupButton = screen.getByRole('button', { name: /meetup/i });
      expect(meetupButton).toHaveClass('text-primary');
    });

    it('should show Meetup button prominently for Inner tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="inner" />);
      const meetupButton = screen.getByRole('button', { name: /meetup/i });
      expect(meetupButton).toHaveClass('text-primary');
    });

    it('should deprioritize Like button in Core tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="core" />);
      const likeButton = screen.getByRole('button', { name: /like/i });
      // Like button should have muted styling
      expect(likeButton.className).toContain('text-muted-foreground/50');
    });

    it('should deprioritize Like button in Inner tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="inner" />);
      const likeButton = screen.getByRole('button', { name: /like/i });
      expect(likeButton.className).toContain('text-muted-foreground/50');
    });

    it('should show Like button normally in Outer tier', () => {
      renderWithProviders(<PostActions {...defaultProps} tier="outer" />);
      const likeButton = screen.getByRole('button', { name: /like/i });
      expect(likeButton.className).not.toContain('text-muted-foreground/50');
    });
  });

  describe('Logging Interactions', () => {
    it('should log call_accepted interaction when call is made', () => {
      const post = createTestPost({
        authorPhone: '+15551234567',
      });

      renderWithProviders(
        <PostActions
          {...defaultProps}
          post={post}
          authorPhone={post.authorPhone}
        />
      );

      const callButton = screen.getByRole('button', { name: /call via/i });
      fireEvent.click(callButton);

      expect(mockOnInteract).toHaveBeenCalledWith('call_accepted');
    });

    it('should log like interaction', () => {
      renderWithProviders(<PostActions {...defaultProps} />);

      const likeButton = screen.getByRole('button', { name: /like/i });
      fireEvent.click(likeButton);

      expect(mockOnInteract).toHaveBeenCalledWith('like');
    });

    it('should log voice_reply interaction', () => {
      renderWithProviders(<PostActions {...defaultProps} />);

      const voiceButton = screen.getByRole('button', { name: /voice/i });
      fireEvent.click(voiceButton);

      expect(mockOnInteract).toHaveBeenCalledWith('voice_reply', '');
    });

    it('should log meetup_rsvp interaction', () => {
      renderWithProviders(<PostActions {...defaultProps} />);

      const meetupButton = screen.getByRole('button', { name: /meetup/i });
      fireEvent.click(meetupButton);

      expect(mockOnInteract).toHaveBeenCalledWith('meetup_rsvp');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels on all action buttons', () => {
      renderWithProviders(<PostActions {...defaultPropsWithPhone} />);

      // With phone, we should see call button
      expect(screen.getByRole('button', { name: /call via/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /voice/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /meetup/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
    });

    it('should have accessible labels for add contact info when no phone', () => {
      renderWithProviders(<PostActions {...defaultProps} />);

      // Without phone, we should see add contact info
      expect(screen.getByRole('button', { name: /add contact info/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /voice/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /meetup/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      renderWithProviders(<PostActions {...defaultPropsWithPhone} />);

      // Tab to the first button (Voice Reply in core tier)
      await user.tab();
      await user.keyboard('{Enter}');

      // Should trigger the voice reply action
      expect(mockOnInteract).toHaveBeenCalledWith('voice_reply', '');
    });
  });
});

describe('PostActions - Feed Default Contact Method', () => {
  const mockOnInteract = vi.fn();
  const mockOnDefaultContactMethodChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowOpen.mockClear();
  });

  it('should use feed-level default contact method when set', () => {
    const post = createTestPost({
      authorPhone: '+15551234567',
      authorPreferredContact: 'tel', // Author prefers tel
    });

    // But feed-level default is whatsapp
    renderWithProviders(
      <PostActions
        post={post}
        tier="core"
        showLikeCount={false}
        onInteract={mockOnInteract}
        authorPhone={post.authorPhone}
        feedDefaultContactMethod="whatsapp"
      />
    );

    const callButton = screen.getByRole('button', { name: /call/i });
    fireEvent.click(callButton);

    // Should use feed default (whatsapp) over author's preference
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank'
    );
  });

  it('should fallback to author preference when no feed default is set', () => {
    const post = createTestPost({
      authorPhone: '+15551234567',
      authorPreferredContact: 'facetime',
    });

    renderWithProviders(
      <PostActions
        post={post}
        tier="core"
        showLikeCount={false}
        onInteract={mockOnInteract}
        authorPhone={post.authorPhone}
        authorPreferredContact={post.authorPreferredContact}
        feedDefaultContactMethod={undefined}
      />
    );

    const callButton = screen.getByRole('button', { name: /call/i });
    fireEvent.click(callButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'facetime:+15551234567',
      '_blank'
    );
  });
});

describe('PostActions - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowOpen.mockClear();
  });

  it('should handle invalid phone numbers gracefully', () => {
    const post = createTestPost({
      authorPhone: 'not-a-phone-number',
    });

    renderWithProviders(
      <PostActions
        post={post}
        tier="core"
        showLikeCount={false}
        onInteract={vi.fn()}
        authorPhone={post.authorPhone}
      />
    );

    const callButton = screen.getByRole('button', { name: /call via/i });
    fireEvent.click(callButton);

    // Should still attempt to call
    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it('should show error toast when window.open throws', async () => {
    const { toast } = await import('sonner');
    mockWindowOpen.mockImplementation(() => {
      throw new Error('Popup blocked');
    });

    const post = createTestPost({
      authorPhone: '+15551234567',
    });

    renderWithProviders(
      <PostActions
        post={post}
        tier="core"
        showLikeCount={false}
        onInteract={vi.fn()}
        authorPhone={post.authorPhone}
      />
    );

    const callButton = screen.getByRole('button', { name: /call via/i });
    fireEvent.click(callButton);

    expect(toast.error).toHaveBeenCalledWith('Failed to initiate contact');
  });
});

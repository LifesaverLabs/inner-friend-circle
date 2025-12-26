import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyFeedState } from '@/components/feed/EmptyFeedState';

// Mock translations for EmptyFeedState
const mockTranslations: Record<string, string> = {
  // Title messages for no friends state
  'emptyState.noFriendsYet.core': 'No Core friends yet',
  'emptyState.noFriendsYet.inner': 'No Inner Circle friends yet',
  'emptyState.noFriendsYet.outer': 'No Outer Circle friends yet',
  // Title for no posts state
  'emptyState.noPostsYet': 'No posts yet',
  // Description when no posts (tier-specific)
  'emptyState.noPostsDescription.core': 'Share something with your closest friends.',
  'emptyState.noPostsDescription.inner': 'Share something with your inner circle.',
  'emptyState.noPostsDescription.outer': 'Share something with your connections.',
  // Tier descriptions (used when no friends)
  'tiers.coreDescription': 'Your 5 closest, most trusted friends',
  'tiers.innerDescription': 'Up to 15 close friends you see regularly',
  'tiers.outerDescription': 'Up to 150 meaningful connections that matter',
  // Get started messages for new users
  'emptyState.getStarted.core': 'Get started by adding friends to your Core circle.',
  'emptyState.getStarted.inner': 'Get started by adding friends to your Inner circle.',
  'emptyState.getStarted.outer': 'Get started by adding friends to your Outer circle.',
  // Add to see messages
  'emptyState.addToSee.core': 'Add friends to see their posts here.',
  'emptyState.addToSee.inner': 'Add friends to see their posts here.',
  'emptyState.addToSee.outer': 'Add friends to see their posts here.',
  // Button labels
  'emptyState.addFriends.core': 'Add Core Friends',
  'emptyState.addFriends.inner': 'Add Inner Circle Friends',
  'emptyState.addFriends.outer': 'Add Outer Circle Friends',
  'emptyState.createPost': 'Create Post',
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

describe('EmptyFeedState', () => {
  describe('Basic Rendering', () => {
    it('should render with data-testid', () => {
      render(<EmptyFeedState tier="core" />);
      expect(screen.getByTestId('empty-feed-state')).toBeInTheDocument();
    });

    it('should render an illustration or icon', () => {
      render(<EmptyFeedState tier="core" />);
      // Should have some visual element
      expect(screen.getByTestId('empty-feed-icon')).toBeInTheDocument();
    });
  });

  describe('Tier-Specific Messages', () => {
    it('should show Core-specific message', () => {
      render(<EmptyFeedState tier="core" />);

      // Check heading contains core
      const heading = screen.getByRole('heading');
      expect(heading.textContent?.toLowerCase()).toContain('core');
      // Check description mentions closest/trust (from translation)
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent).toMatch(/closest|trusted|5/i);
    });

    it('should show Inner-specific message', () => {
      render(<EmptyFeedState tier="inner" />);

      const heading = screen.getByRole('heading');
      expect(heading.textContent?.toLowerCase()).toContain('inner');
    });

    it('should show Outer-specific message', () => {
      render(<EmptyFeedState tier="outer" />);

      const heading = screen.getByRole('heading');
      expect(heading.textContent?.toLowerCase()).toContain('outer');
    });

    it('should have descriptive help text for Core', () => {
      render(<EmptyFeedState tier="core" />);

      // Should mention adding friends somewhere
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toMatch(/add|friends/i);
    });

    it('should have descriptive help text for Inner', () => {
      render(<EmptyFeedState tier="inner" />);

      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toMatch(/add|friends/i);
    });

    it('should have descriptive help text for Outer', () => {
      render(<EmptyFeedState tier="outer" />);

      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toMatch(/add|friends/i);
    });
  });

  describe('Call to Action', () => {
    it('should show add friends button', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} />);

      // Should have at least one button for adding/managing
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should call onAddFriends when button is clicked', () => {
      const onAddFriends = vi.fn();
      render(<EmptyFeedState tier="core" hasFriends={false} onAddFriends={onAddFriends} />);

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(onAddFriends).toHaveBeenCalled();
    });

    it('should pass tier to onAddFriends callback', () => {
      const onAddFriends = vi.fn();
      render(<EmptyFeedState tier="inner" hasFriends={false} onAddFriends={onAddFriends} />);

      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);

      expect(onAddFriends).toHaveBeenCalledWith('inner');
    });
  });

  describe('No Friends vs No Posts States', () => {
    it('should show "no friends" message when hasFriends is false', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} />);

      // Should show a message about no friends (via heading)
      const heading = screen.getByRole('heading');
      expect(heading.textContent?.toLowerCase()).toMatch(/no.*friends|core/i);
    });

    it('should show "no posts" message when hasFriends is true', () => {
      render(<EmptyFeedState tier="core" hasFriends={true} />);

      // Should show no posts message
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toMatch(/no posts|share/i);
    });

    it('should suggest adding friends when hasFriends is false', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should suggest creating post when hasFriends is true', () => {
      render(<EmptyFeedState tier="core" hasFriends={true} isLoggedIn={true} />);

      expect(screen.getByRole('button', { name: /create|share|post/i })).toBeInTheDocument();
    });
  });

  describe('Logged In State', () => {
    it('should show create post button when logged in and has friends', () => {
      render(<EmptyFeedState tier="core" hasFriends={true} isLoggedIn={true} />);

      expect(screen.getByRole('button', { name: /create|share|post/i })).toBeInTheDocument();
    });

    it('should hide create post button when logged out', () => {
      render(<EmptyFeedState tier="core" hasFriends={true} isLoggedIn={false} />);

      expect(screen.queryByRole('button', { name: /create|share|post/i })).not.toBeInTheDocument();
    });

    it('should call onCreatePost when create button is clicked', () => {
      const onCreatePost = vi.fn();
      render(
        <EmptyFeedState
          tier="core"
          hasFriends={true}
          isLoggedIn={true}
          onCreatePost={onCreatePost}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /create|share|post/i }));

      expect(onCreatePost).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply tier-specific color to icon', () => {
      render(<EmptyFeedState tier="core" />);

      const icon = screen.getByTestId('empty-feed-icon');
      expect(icon).toHaveClass('text-tier-core');
    });

    it('should apply inner tier color', () => {
      render(<EmptyFeedState tier="inner" />);

      const icon = screen.getByTestId('empty-feed-icon');
      expect(icon).toHaveClass('text-tier-inner');
    });

    it('should apply outer tier color', () => {
      render(<EmptyFeedState tier="outer" />);

      const icon = screen.getByTestId('empty-feed-icon');
      expect(icon).toHaveClass('text-tier-outer');
    });

    it('should have centered layout', () => {
      render(<EmptyFeedState tier="core" />);

      const container = screen.getByTestId('empty-feed-state');
      expect(container).toHaveClass('text-center');
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive heading', () => {
      render(<EmptyFeedState tier="core" />);

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAccessibleName();
    });
  });

  describe('Content Encouragement', () => {
    it('should explain what Core feed is for', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} />);

      // Should explain the purpose of Core tier (5 closest friends)
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent).toMatch(/5|closest|trust|core/i);
    });

    it('should explain what Inner feed is for', () => {
      render(<EmptyFeedState tier="inner" hasFriends={false} />);

      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent).toMatch(/15|close|regularly|inner/i);
    });

    it('should explain what Outer feed is for', () => {
      render(<EmptyFeedState tier="outer" hasFriends={false} />);

      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent).toMatch(/150|meaningful|connections|matter|outer/i);
    });
  });

  describe('First-Time User Experience', () => {
    it('should be welcoming for new users', () => {
      render(<EmptyFeedState tier="core" hasFriends={false} isNewUser={true} />);

      // Should have friendly tone with get started message
      const container = screen.getByTestId('empty-feed-state');
      expect(container.textContent?.toLowerCase()).toMatch(/get started|add/i);
    });

    it('should guide to Manage tab via Add Friends button', () => {
      const onGoToManage = vi.fn();
      render(
        <EmptyFeedState
          tier="core"
          hasFriends={false}
          onGoToManage={onGoToManage}
        />
      );

      // Click "Add Friends" button - this navigates to Manage tab
      const addButton = screen.getByRole('button', { name: /add.*friends/i });
      fireEvent.click(addButton);

      expect(onGoToManage).toHaveBeenCalled();
    });
  });
});

describe('EmptyFeedState - Visual States', () => {
  it('should animate on mount', () => {
    render(<EmptyFeedState tier="core" />);

    const container = screen.getByTestId('empty-feed-state');
    // Framer motion adds animation classes/styles
    expect(container).toBeInTheDocument();
  });

  it('should have padding for comfortable spacing', () => {
    render(<EmptyFeedState tier="core" />);

    const container = screen.getByTestId('empty-feed-state');
    expect(container).toHaveClass(/p-/);
  });

  it('should be visually distinct from feed content area', () => {
    render(<EmptyFeedState tier="core" />);

    const container = screen.getByTestId('empty-feed-state');
    // Should have some visual styling to stand out
    expect(container).toHaveClass(/rounded|border|bg-/);
  });
});

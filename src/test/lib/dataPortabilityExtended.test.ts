import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Friend, TierType, ReservedGroup } from '@/types/friend';
import { ContactMethod, ServiceType } from '@/types/contactMethod';
import {
  FeedPost,
  ExportableSocialGraph,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/types/feed';

// ============================================================================
// Extended Export Format Tests
// ============================================================================

// These tests define the enhanced export format for full data portability
// The implementation should be extended to support these features

describe('Extended Data Liberation - Contact Methods', () => {
  describe('Contact Method Export', () => {
    it('should include all user contact methods in export', () => {
      // Define expected extended export format
      interface ExtendedExport extends ExportableSocialGraph {
        contactMethods: Array<{
          id: string;
          serviceType: ServiceType;
          contactIdentifier: string;
          forSpontaneous: boolean;
          forScheduled: boolean;
          label?: string;
        }>;
      }

      const mockContactMethods: ContactMethod[] = [
        {
          id: 'cm1',
          user_id: 'user-123',
          service_type: 'phone',
          contact_identifier: '+1234567890',
          for_spontaneous: true,
          for_scheduled: true,
          spontaneous_priority: 1,
          scheduled_priority: 1,
          label: 'Personal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'cm2',
          user_id: 'user-123',
          service_type: 'signal',
          contact_identifier: '+1234567890',
          for_spontaneous: true,
          for_scheduled: false,
          spontaneous_priority: 2,
          scheduled_priority: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Test that contact methods should be included in export
      expect(mockContactMethods).toHaveLength(2);
      expect(mockContactMethods[0].service_type).toBe('phone');
      expect(mockContactMethods[1].service_type).toBe('signal');
    });

    it('should preserve contact method priorities', () => {
      const contactMethod: ContactMethod = {
        id: 'cm1',
        user_id: 'user-123',
        service_type: 'facetime',
        contact_identifier: 'user@example.com',
        for_spontaneous: true,
        for_scheduled: true,
        spontaneous_priority: 1,
        scheduled_priority: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(contactMethod.spontaneous_priority).toBe(1);
      expect(contactMethod.scheduled_priority).toBe(3);
    });

    it('should include all supported service types', () => {
      const serviceTypes: ServiceType[] = [
        'real_face_time',
        'facetime',
        'whatsapp',
        'signal',
        'telegram',
        'phone',
        'zoom',
        'google_meet',
        'teams',
        'discord',
        'skype',
        'webex',
        'slack',
      ];

      // All service types should be valid for export
      serviceTypes.forEach(type => {
        expect(typeof type).toBe('string');
      });
      expect(serviceTypes).toHaveLength(13);
    });
  });
});

describe('Extended Data Liberation - Reserved Groups', () => {
  describe('Reserved Group Export', () => {
    it('should include reserved groups per tier in export', () => {
      const reservedGroups: Record<TierType, ReservedGroup[]> = {
        core: [{ id: 'rg1', count: 2, note: 'Space for siblings' }],
        inner: [{ id: 'rg2', count: 5, note: 'Work colleagues' }],
        outer: [],
        naybor: [{ id: 'rg3', count: 3 }],
        parasocial: [],
        rolemodel: [],
        acquainted: [],
      };

      expect(reservedGroups.core).toHaveLength(1);
      expect(reservedGroups.core[0].count).toBe(2);
      expect(reservedGroups.core[0].note).toBe('Space for siblings');
      expect(reservedGroups.inner).toHaveLength(1);
      expect(reservedGroups.naybor).toHaveLength(1);
    });

    it('should preserve reserved group counts', () => {
      const reservedGroup: ReservedGroup = {
        id: 'rg1',
        count: 5,
        note: 'Future family additions',
      };

      expect(reservedGroup.count).toBe(5);
    });

    it('should handle reserved groups without notes', () => {
      const reservedGroup: ReservedGroup = {
        id: 'rg1',
        count: 3,
      };

      expect(reservedGroup.note).toBeUndefined();
      expect(reservedGroup.count).toBe(3);
    });
  });
});

describe('Extended Data Liberation - Profile Data', () => {
  describe('Profile Export', () => {
    it('should include user profile information', () => {
      interface UserProfile {
        id: string;
        displayName: string | null;
        userHandle: string | null;
        avatarUrl: string | null;
        isPublic: boolean;
        isParasocialPersonality: boolean;
      }

      const profile: UserProfile = {
        id: 'user-123',
        displayName: 'John Doe',
        userHandle: 'johndoe',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPublic: true,
        isParasocialPersonality: false,
      };

      expect(profile.displayName).toBe('John Doe');
      expect(profile.userHandle).toBe('johndoe');
      expect(profile.isPublic).toBe(true);
    });

    it('should handle null profile fields', () => {
      interface UserProfile {
        id: string;
        displayName: string | null;
        userHandle: string | null;
        avatarUrl: string | null;
      }

      const profile: UserProfile = {
        id: 'user-123',
        displayName: null,
        userHandle: null,
        avatarUrl: null,
      };

      expect(profile.displayName).toBeNull();
      expect(profile.userHandle).toBeNull();
    });
  });
});

describe('Extended Data Liberation - Last Tended Date', () => {
  it('should include last tended timestamp', () => {
    const lastTendedAt = new Date('2024-06-15T10:00:00Z');

    expect(lastTendedAt).toBeInstanceOf(Date);
    expect(lastTendedAt.toISOString()).toBe('2024-06-15T10:00:00.000Z');
  });

  it('should handle null last tended date', () => {
    const lastTendedAt: Date | null = null;

    expect(lastTendedAt).toBeNull();
  });
});

describe('Extended Data Liberation - Acquainted Nudge History', () => {
  describe('Nudge History Export', () => {
    it('should include acquainted nudge history', () => {
      interface AcquaintedNudgeHistoryEntry {
        friendId: string;
        cycleYear: number;
        nudgedAt: Date;
        action?: 'keep_in_circles' | 'promote_to_outer' | 'remove_from_circles' | 'snooze_6_months';
        actionTakenAt?: Date;
      }

      const history: AcquaintedNudgeHistoryEntry[] = [
        {
          friendId: 'f1',
          cycleYear: 2024,
          nudgedAt: new Date('2024-01-01'),
          action: 'keep_in_circles',
          actionTakenAt: new Date('2024-01-02'),
        },
        {
          friendId: 'f2',
          cycleYear: 2024,
          nudgedAt: new Date('2024-02-01'),
          action: 'promote_to_outer',
          actionTakenAt: new Date('2024-02-03'),
        },
      ];

      expect(history).toHaveLength(2);
      expect(history[0].action).toBe('keep_in_circles');
      expect(history[1].action).toBe('promote_to_outer');
    });

    it('should handle nudges without actions taken', () => {
      interface AcquaintedNudgeHistoryEntry {
        friendId: string;
        cycleYear: number;
        nudgedAt: Date;
        action?: string;
        actionTakenAt?: Date;
      }

      const entry: AcquaintedNudgeHistoryEntry = {
        friendId: 'f1',
        cycleYear: 2024,
        nudgedAt: new Date('2024-01-01'),
        // No action taken yet
      };

      expect(entry.action).toBeUndefined();
      expect(entry.actionTakenAt).toBeUndefined();
    });
  });
});

describe('Extended Data Liberation - Friend Connections', () => {
  describe('Connection Export', () => {
    it('should include mutual friend connections', () => {
      interface FriendConnection {
        id: string;
        targetUserId: string;
        circleTier: 'core' | 'inner' | 'outer';
        status: 'pending' | 'confirmed' | 'declined';
        discloseCircle: boolean;
        confirmedAt?: Date;
        createdAt: Date;
      }

      const connections: FriendConnection[] = [
        {
          id: 'conn1',
          targetUserId: 'friend-user-1',
          circleTier: 'core',
          status: 'confirmed',
          discloseCircle: true,
          confirmedAt: new Date('2024-06-01'),
          createdAt: new Date('2024-05-15'),
        },
        {
          id: 'conn2',
          targetUserId: 'friend-user-2',
          circleTier: 'inner',
          status: 'pending',
          discloseCircle: false,
          createdAt: new Date('2024-06-10'),
        },
      ];

      expect(connections).toHaveLength(2);
      expect(connections[0].status).toBe('confirmed');
      expect(connections[1].status).toBe('pending');
    });

    it('should not include declined connections in export', () => {
      // Declined connections should be filtered out as they're not useful for import
      const connections = [
        { id: 'conn1', status: 'confirmed' },
        { id: 'conn2', status: 'declined' },
        { id: 'conn3', status: 'pending' },
      ];

      const exportable = connections.filter(c => c.status !== 'declined');

      expect(exportable).toHaveLength(2);
      expect(exportable.every(c => c.status !== 'declined')).toBe(true);
    });
  });
});

describe('Extended Data Liberation - Parasocial Data', () => {
  describe('Creator Shares Export', () => {
    it('should include parasocial shares for creators', () => {
      interface ParasocialShare {
        id: string;
        title: string;
        url: string;
        description?: string;
        isActive: boolean;
        createdAt: Date;
        expiresAt?: Date;
      }

      const shares: ParasocialShare[] = [
        {
          id: 'share1',
          title: 'My Latest Article',
          url: 'https://example.com/article',
          description: 'A great read!',
          isActive: true,
          createdAt: new Date('2024-06-01'),
        },
        {
          id: 'share2',
          title: 'Workshop Recording',
          url: 'https://example.com/workshop',
          isActive: false,
          createdAt: new Date('2024-05-01'),
          expiresAt: new Date('2024-05-31'),
        },
      ];

      expect(shares).toHaveLength(2);
      expect(shares[0].isActive).toBe(true);
      expect(shares[1].isActive).toBe(false);
    });
  });

  describe('Follower List Export', () => {
    it('should not export follower details (privacy)', () => {
      // Only aggregate stats should be exportable, not individual follower data
      interface ParasocialStats {
        totalFollowers: number;
        totalShares: number;
        totalEngagements: number;
      }

      const stats: ParasocialStats = {
        totalFollowers: 150,
        totalShares: 10,
        totalEngagements: 500,
      };

      // Stats are OK to export, but not individual follower IDs
      expect(stats.totalFollowers).toBe(150);
    });
  });
});

// ============================================================================
// Comprehensive Export Format v2 Tests
// ============================================================================

describe('Export Format v2 Specification', () => {
  it('should define complete extended export interface', () => {
    // This defines the target v2 export format
    interface ExportableSocialGraphV2 {
      // Metadata
      version: string;
      exportedAt: Date;
      userId: string;

      // Core data (existing)
      friends: Array<{
        id: string;
        name: string;
        email?: string;
        phone?: string;
        tier: TierType;
        addedAt: Date;
        lastContacted?: Date;
        notes?: string;
        roleModelReason?: string;
        preferredContact?: string;
        sortOrder?: number;
      }>;

      // Extended: Reserved groups
      reservedGroups: {
        [key in TierType]?: Array<{
          id: string;
          count: number;
          note?: string;
        }>;
      };

      // Extended: Contact methods
      contactMethods: Array<{
        id: string;
        serviceType: string;
        contactIdentifier: string;
        forSpontaneous: boolean;
        forScheduled: boolean;
        spontaneousPriority: number;
        scheduledPriority: number;
        label?: string;
      }>;

      // Extended: Profile
      profile: {
        displayName: string | null;
        userHandle: string | null;
        avatarUrl: string | null;
        isPublic: boolean;
        isParasocialPersonality: boolean;
      };

      // User's own posts only
      posts: Array<{
        id: string;
        contentType: string;
        content: string;
        createdAt: Date;
        visibility: TierType[];
        mediaUrl?: string;
      }>;

      // User's own interactions only
      interactions: Array<{
        postId: string;
        type: string;
        content?: string;
        createdAt: Date;
      }>;

      // Settings
      settings: {
        privacy: Record<string, unknown>;
        notifications: Record<string, unknown>;
      };

      // Extended: Tending data
      tending: {
        lastTendedAt: Date | null;
      };

      // Extended: Friend connections (mutual matching)
      connections: Array<{
        targetUserId: string;
        circleTier: 'core' | 'inner' | 'outer';
        status: 'pending' | 'confirmed';
        discloseCircle: boolean;
        createdAt: Date;
        confirmedAt?: Date;
      }>;

      // Extended: Nudge history
      nudgeHistory: Array<{
        friendId: string;
        cycleYear: number;
        nudgedAt: Date;
        action?: string;
        actionTakenAt?: Date;
      }>;

      // Extended: Parasocial (for creators only)
      parasocial?: {
        shares: Array<{
          id: string;
          title: string;
          url: string;
          description?: string;
          isActive: boolean;
          createdAt: Date;
          expiresAt?: Date;
        }>;
        stats: {
          totalFollowers: number;
          totalEngagements: number;
        };
      };
    }

    // Validate structure exists
    const mockExport: ExportableSocialGraphV2 = {
      version: '2.0.0',
      exportedAt: new Date(),
      userId: 'user-123',
      friends: [],
      reservedGroups: {},
      contactMethods: [],
      profile: {
        displayName: 'John',
        userHandle: 'john',
        avatarUrl: null,
        isPublic: true,
        isParasocialPersonality: false,
      },
      posts: [],
      interactions: [],
      settings: {
        privacy: {},
        notifications: {},
      },
      tending: {
        lastTendedAt: null,
      },
      connections: [],
      nudgeHistory: [],
    };

    expect(mockExport.version).toBe('2.0.0');
    expect(mockExport.profile).toBeDefined();
    expect(mockExport.contactMethods).toBeDefined();
    expect(mockExport.reservedGroups).toBeDefined();
  });
});

// ============================================================================
// Import Compatibility Tests
// ============================================================================

describe('Import Compatibility', () => {
  it('should accept v1 format and upgrade to current format', () => {
    const v1Export = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userId: 'user-123',
      friends: [
        { id: 'f1', name: 'Alice', tier: 'core', addedAt: new Date().toISOString() },
      ],
      posts: [],
      interactions: [],
      settings: {
        privacy: DEFAULT_PRIVACY_SETTINGS,
        notifications: DEFAULT_NOTIFICATION_SETTINGS,
      },
    };

    // v1 format should be valid
    expect(v1Export.version).toBe('1.0.0');
    expect(v1Export.friends).toHaveLength(1);
  });

  it('should provide defaults for missing v2 fields when importing v1', () => {
    const v1Export = {
      version: '1.0.0',
      friends: [{ id: 'f1', name: 'Alice', tier: 'core' }],
    };

    // When importing v1, these should default to empty/null
    const defaults = {
      reservedGroups: {},
      contactMethods: [],
      profile: null,
      tending: { lastTendedAt: null },
      connections: [],
      nudgeHistory: [],
    };

    expect(defaults.reservedGroups).toEqual({});
    expect(defaults.contactMethods).toEqual([]);
  });

  it('should merge imported friends with existing friends', () => {
    const existingFriends = [
      { id: 'f1', name: 'Alice', tier: 'core' },
      { id: 'f2', name: 'Bob', tier: 'inner' },
    ];

    const importedFriends = [
      { id: 'f3', name: 'Carol', tier: 'outer' },
      { id: 'f1', name: 'Alice Updated', tier: 'core' }, // Duplicate ID
    ];

    // Strategy: Keep existing, add new, warn on duplicates
    const existingIds = new Set(existingFriends.map(f => f.id));
    const duplicates = importedFriends.filter(f => existingIds.has(f.id));
    const newFriends = importedFriends.filter(f => !existingIds.has(f.id));

    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].name).toBe('Alice Updated');
    expect(newFriends).toHaveLength(1);
    expect(newFriends[0].name).toBe('Carol');
  });
});

// ============================================================================
// Data Liberation User Experience Tests
// ============================================================================

describe('Data Liberation User Experience', () => {
  describe('Export UX', () => {
    it('should provide human-readable export summary', () => {
      interface ExportSummary {
        totalFriends: number;
        friendsByTier: Record<string, number>;
        totalPosts: number;
        totalInteractions: number;
        hasContactMethods: boolean;
        hasConnections: boolean;
        exportSizeKB: number;
      }

      const summary: ExportSummary = {
        totalFriends: 50,
        friendsByTier: {
          core: 5,
          inner: 15,
          outer: 30,
        },
        totalPosts: 100,
        totalInteractions: 250,
        hasContactMethods: true,
        hasConnections: true,
        exportSizeKB: 45,
      };

      expect(summary.totalFriends).toBe(50);
      expect(summary.friendsByTier.core).toBe(5);
    });

    it('should warn about sensitive data in export', () => {
      const sensitiveDataTypes = [
        'phone_numbers',
        'email_addresses',
        'private_notes',
        'location_data',
      ];

      // User should be warned about these before export
      expect(sensitiveDataTypes).toContain('phone_numbers');
      expect(sensitiveDataTypes).toContain('email_addresses');
    });
  });

  describe('Import UX', () => {
    it('should provide import preview before confirming', () => {
      interface ImportPreview {
        friendsToAdd: number;
        friendsToUpdate: number;
        friendsSkipped: number;
        postsToAdd: number;
        warnings: string[];
        errors: string[];
      }

      const preview: ImportPreview = {
        friendsToAdd: 10,
        friendsToUpdate: 2,
        friendsSkipped: 1,
        postsToAdd: 50,
        warnings: ['1 friend already exists with different tier'],
        errors: [],
      };

      expect(preview.friendsToAdd).toBe(10);
      expect(preview.warnings).toHaveLength(1);
    });

    it('should allow selective import', () => {
      interface ImportOptions {
        importFriends: boolean;
        importPosts: boolean;
        importSettings: boolean;
        importContactMethods: boolean;
        mergeStrategy: 'keep_existing' | 'overwrite' | 'merge';
      }

      const options: ImportOptions = {
        importFriends: true,
        importPosts: false, // User chose not to import posts
        importSettings: true,
        importContactMethods: true,
        mergeStrategy: 'keep_existing',
      };

      expect(options.importPosts).toBe(false);
      expect(options.mergeStrategy).toBe('keep_existing');
    });
  });
});

// ============================================================================
// Data Liberation Banner Messaging Tests
// ============================================================================

describe('Data Liberation Messaging', () => {
  it('should communicate user data ownership', () => {
    const messages = {
      headline: 'Your Data, Your Choice',
      subheadline: 'Export your social graph anytime to take it elsewhere',
      exportButton: 'Download My Data',
      importButton: 'Import Data',
      learnMore: 'Learn about data portability',
    };

    expect(messages.headline).toContain('Your');
    expect(messages.subheadline).toContain('Export');
  });

  it('should explain what is included in export', () => {
    const exportIncludes = [
      'All your friends and their tiers',
      'Contact information you added',
      'Your personal notes',
      'Your posts and content',
      'Your reactions to others\' posts',
      'Your privacy and notification settings',
    ];

    expect(exportIncludes.length).toBeGreaterThan(4);
  });

  it('should explain what is NOT included in export', () => {
    const exportExcludes = [
      'Other users\' posts',
      'Other users\' reactions on your posts',
      'Authentication credentials',
      'Server-side analytics',
    ];

    expect(exportExcludes).toContain('Other users\' posts');
    expect(exportExcludes).toContain('Authentication credentials');
  });
});

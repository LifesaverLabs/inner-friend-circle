import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportSocialGraph,
  serializeExport,
  createExportFile,
  generateExportFilename,
  validateVersion,
  validateFriendTiers,
  validatePostContentTypes,
  validateInteractionTypes,
  validateImportData,
  parseImportData,
  importSocialGraph,
  convertImportedFriends,
} from '@/lib/dataPortability';
import { Friend, TierType } from '@/types/friend';
import {
  FeedPost,
  PostInteraction,
  ExportableSocialGraph,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/types/feed';

// ============================================================================
// Test Helpers
// ============================================================================

const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: `friend-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Friend',
  tier: 'core' as TierType,
  addedAt: new Date('2024-01-15'),
  ...overrides,
});

const createMockPost = (overrides: Partial<FeedPost> = {}): FeedPost => ({
  id: `post-${Math.random().toString(36).substr(2, 9)}`,
  authorId: 'user-123',
  authorName: 'Test User',
  authorTier: 'core' as TierType,
  contentType: 'text',
  content: 'Test post content',
  createdAt: new Date('2024-06-01'),
  interactions: [],
  visibility: ['core', 'inner'],
  isSuggested: false,
  isSponsored: false,
  ...overrides,
});

const createMockInteraction = (overrides: Partial<PostInteraction> = {}): PostInteraction => ({
  id: `interaction-${Math.random().toString(36).substr(2, 9)}`,
  postId: 'post-1',
  userId: 'user-123',
  userName: 'Test User',
  type: 'like',
  createdAt: new Date('2024-06-02'),
  ...overrides,
});

// ============================================================================
// Data Liberation Front - Core Principles Tests
// ============================================================================

describe('Data Liberation Front - Core Principles', () => {
  describe('User Ownership', () => {
    it('should export only the user\'s own data, never data belonging to others', () => {
      const userId = 'user-123';
      const friends = [
        createMockFriend({ name: 'Alice' }),
        createMockFriend({ name: 'Bob' }),
      ];

      // Posts by the user and by others
      const posts = [
        createMockPost({ id: 'post-1', authorId: userId, content: 'My post' }),
        createMockPost({ id: 'post-2', authorId: 'other-user', content: 'Their post' }),
      ];

      const result = exportSocialGraph(userId, friends, posts);

      // Should include only user's own posts
      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].content).toBe('My post');
    });

    it('should export only the user\'s own interactions, not others\' reactions', () => {
      const userId = 'user-123';
      const friends: Friend[] = [];

      const posts = [
        createMockPost({
          id: 'post-1',
          authorId: 'other-user',
          interactions: [
            createMockInteraction({ userId, type: 'like' }),
            createMockInteraction({ userId: 'another-user', type: 'comment' }),
          ],
        }),
      ];

      const result = exportSocialGraph(userId, friends, posts);

      // Should include only user's own interactions
      expect(result.interactions).toHaveLength(1);
      expect(result.interactions[0].type).toBe('like');
    });

    it('should preserve all friend contact information for portability', () => {
      const userId = 'user-123';
      const friends = [
        createMockFriend({
          name: 'Alice',
          email: 'alice@example.com',
          phone: '+1234567890',
          notes: 'Met at conference',
          lastContacted: new Date('2024-05-01'),
        }),
      ];

      const result = exportSocialGraph(userId, friends, []);

      expect(result.friends[0]).toMatchObject({
        name: 'Alice',
        email: 'alice@example.com',
        phone: '+1234567890',
        notes: 'Met at conference',
      });
      expect(result.friends[0].lastContacted).toEqual(new Date('2024-05-01'));
    });
  });

  describe('Data Completeness', () => {
    it('should include all tier types in export', () => {
      const userId = 'user-123';
      const tiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
      const friends = tiers.map(tier => createMockFriend({ tier }));

      const result = exportSocialGraph(userId, friends, []);

      const exportedTiers = result.friends.map(f => f.tier);
      tiers.forEach(tier => {
        expect(exportedTiers).toContain(tier);
      });
    });

    it('should include privacy settings per tier', () => {
      const userId = 'user-123';
      const result = exportSocialGraph(userId, [], []);

      expect(result.settings.privacy).toHaveProperty('core');
      expect(result.settings.privacy).toHaveProperty('inner');
      expect(result.settings.privacy).toHaveProperty('outer');
      expect(result.settings.privacy).toHaveProperty('naybor');
      expect(result.settings.privacy).toHaveProperty('parasocial');
      expect(result.settings.privacy).toHaveProperty('rolemodel');
      expect(result.settings.privacy).toHaveProperty('acquainted');
    });

    it('should include notification settings per tier', () => {
      const userId = 'user-123';
      const result = exportSocialGraph(userId, [], []);

      expect(result.settings.notifications).toHaveProperty('core');
      expect(result.settings.notifications).toHaveProperty('inner');
      expect(result.settings.notifications).toHaveProperty('outer');
    });

    it('should include export version for forward compatibility', () => {
      const userId = 'user-123';
      const result = exportSocialGraph(userId, [], []);

      expect(result.version).toBeDefined();
      expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should include export timestamp', () => {
      const userId = 'user-123';
      const before = new Date();
      const result = exportSocialGraph(userId, [], []);
      const after = new Date();

      expect(result.exportedAt).toBeInstanceOf(Date);
      expect(result.exportedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.exportedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Portability Standards', () => {
    it('should produce valid JSON that can be parsed', () => {
      const userId = 'user-123';
      const friends = [createMockFriend({ name: 'Alice' })];
      const posts = [createMockPost({ content: 'Hello world' })];

      const exportData = exportSocialGraph(userId, friends, posts);
      const jsonString = serializeExport(exportData);

      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    it('should handle special characters in content', () => {
      const userId = 'user-123';
      const friends = [createMockFriend({ name: 'José García' })];
      const posts = [createMockPost({ content: 'Hello 🎉 "quotes" & special <chars>' })];

      const exportData = exportSocialGraph(userId, friends, posts);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.friends[0].name).toBe('José García');
      expect(parsed.posts[0].content).toBe('Hello 🎉 "quotes" & special <chars>');
    });

    it('should convert Date objects to ISO strings in serialized output', () => {
      const userId = 'user-123';
      const specificDate = new Date('2024-06-15T10:30:00Z');
      const friends = [createMockFriend({ addedAt: specificDate })];

      const exportData = exportSocialGraph(userId, friends, []);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.friends[0].addedAt).toBe('2024-06-15T10:30:00.000Z');
    });

    it('should create downloadable file with correct MIME type', () => {
      const userId = 'user-123';
      const exportData = exportSocialGraph(userId, [], []);
      const blob = createExportFile(exportData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });

    it('should generate timestamped filename', () => {
      const userId = 'user-123';
      const filename = generateExportFilename(userId);

      expect(filename).toMatch(/^inner-friend-circles-export-\d{4}-\d{2}-\d{2}\.json$/);
    });
  });
});

// ============================================================================
// Export Function Tests
// ============================================================================

describe('Export Functions', () => {
  describe('exportSocialGraph', () => {
    it('should create export with user ID', () => {
      const result = exportSocialGraph('user-abc', [], []);
      expect(result.userId).toBe('user-abc');
    });

    it('should include all provided friends', () => {
      const friends = [
        createMockFriend({ name: 'Alice', tier: 'core' }),
        createMockFriend({ name: 'Bob', tier: 'inner' }),
        createMockFriend({ name: 'Carol', tier: 'outer' }),
      ];

      const result = exportSocialGraph('user-123', friends, []);

      expect(result.friends).toHaveLength(3);
      expect(result.friends.map(f => f.name)).toEqual(['Alice', 'Bob', 'Carol']);
    });

    it('should filter posts to only include user\'s own posts', () => {
      const posts = [
        createMockPost({ authorId: 'user-123', content: 'My post 1' }),
        createMockPost({ authorId: 'user-123', content: 'My post 2' }),
        createMockPost({ authorId: 'other-user', content: 'Not my post' }),
      ];

      const result = exportSocialGraph('user-123', [], posts);

      expect(result.posts).toHaveLength(2);
      expect(result.posts.every(p => p.content.startsWith('My post'))).toBe(true);
    });

    it('should aggregate all user interactions across all posts', () => {
      const userId = 'user-123';
      const posts = [
        createMockPost({
          id: 'post-1',
          authorId: 'friend-1',
          interactions: [
            createMockInteraction({ postId: 'post-1', userId, type: 'like' }),
            createMockInteraction({ postId: 'post-1', userId: 'other', type: 'comment' }),
          ],
        }),
        createMockPost({
          id: 'post-2',
          authorId: 'friend-2',
          interactions: [
            createMockInteraction({ postId: 'post-2', userId, type: 'voice_reply' }),
          ],
        }),
      ];

      const result = exportSocialGraph(userId, [], posts);

      expect(result.interactions).toHaveLength(2);
      expect(result.interactions.map(i => i.type)).toEqual(['like', 'voice_reply']);
    });

    it('should use default settings when not provided', () => {
      const result = exportSocialGraph('user-123', [], []);

      expect(result.settings.privacy).toEqual(DEFAULT_PRIVACY_SETTINGS);
      expect(result.settings.notifications).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('should use custom settings when provided', () => {
      const customPrivacy = { ...DEFAULT_PRIVACY_SETTINGS };
      customPrivacy.core.canSeeLocation = false;

      const customNotifications = { ...DEFAULT_NOTIFICATION_SETTINGS };
      customNotifications.core.soundEnabled = false;

      const result = exportSocialGraph(
        'user-123',
        [],
        [],
        customPrivacy,
        customNotifications
      );

      expect(result.settings.privacy.core.canSeeLocation).toBe(false);
      expect(result.settings.notifications.core.soundEnabled).toBe(false);
    });
  });

  describe('serializeExport', () => {
    it('should produce pretty-printed JSON', () => {
      const exportData = exportSocialGraph('user-123', [], []);
      const jsonString = serializeExport(exportData);

      // Pretty-printed JSON should have newlines
      expect(jsonString).toContain('\n');
    });

    it('should handle undefined optional fields gracefully', () => {
      const friends = [createMockFriend({ email: undefined, phone: undefined })];
      const exportData = exportSocialGraph('user-123', friends, []);
      const jsonString = serializeExport(exportData);

      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    it('should handle empty arrays', () => {
      const exportData = exportSocialGraph('user-123', [], []);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.friends).toEqual([]);
      expect(parsed.posts).toEqual([]);
      expect(parsed.interactions).toEqual([]);
    });
  });
});

// ============================================================================
// Import Validation Tests
// ============================================================================

describe('Import Validation', () => {
  describe('validateVersion', () => {
    it('should accept version 1.0.0', () => {
      const result = validateVersion('1.0.0');
      expect(result.valid).toBe(true);
    });

    it('should accept any 1.x.x version', () => {
      expect(validateVersion('1.0.0').valid).toBe(true);
      expect(validateVersion('1.0.1').valid).toBe(true);
      expect(validateVersion('1.1.0').valid).toBe(true);
      expect(validateVersion('1.99.99').valid).toBe(true);
    });

    it('should reject version 2.x.x', () => {
      const result = validateVersion('2.0.0');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported version');
    });

    it('should reject missing version', () => {
      const result = validateVersion(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing version');
    });
  });

  describe('validateFriendTiers', () => {
    it('should accept all valid tier types', () => {
      const friends = [
        { tier: 'core' },
        { tier: 'inner' },
        { tier: 'outer' },
        { tier: 'naybor' },
        { tier: 'parasocial' },
        { tier: 'rolemodel' },
        { tier: 'acquainted' },
      ];

      const result = validateFriendTiers(friends);
      expect(result.valid).toBe(true);
      expect(result.invalidTiers).toHaveLength(0);
    });

    it('should reject invalid tier types', () => {
      const friends = [
        { tier: 'core' },
        { tier: 'invalid_tier' },
        { tier: 'close_friend' },
      ];

      const result = validateFriendTiers(friends);
      expect(result.valid).toBe(false);
      expect(result.invalidTiers).toHaveLength(2);
    });

    it('should identify which friends have invalid tiers', () => {
      const friends = [
        { tier: 'core' },
        { tier: 'bad_tier' },
      ];

      const result = validateFriendTiers(friends);
      expect(result.invalidTiers[0]).toContain('index 1');
      expect(result.invalidTiers[0]).toContain('bad_tier');
    });
  });

  describe('validatePostContentTypes', () => {
    it('should accept all valid content types', () => {
      const posts = [
        { contentType: 'text' },
        { contentType: 'photo' },
        { contentType: 'voice_note' },
        { contentType: 'video' },
        { contentType: 'call_invite' },
        { contentType: 'meetup_invite' },
        { contentType: 'proximity_ping' },
        { contentType: 'life_update' },
      ];

      const result = validatePostContentTypes(posts);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid content types', () => {
      const posts = [
        { contentType: 'text' },
        { contentType: 'story' }, // Invalid
      ];

      const result = validatePostContentTypes(posts);
      expect(result.valid).toBe(false);
      expect(result.invalidTypes[0]).toContain('story');
    });
  });

  describe('validateInteractionTypes', () => {
    it('should accept all valid interaction types', () => {
      const interactions = [
        { type: 'like' },
        { type: 'comment' },
        { type: 'voice_reply' },
        { type: 'call_accepted' },
        { type: 'meetup_rsvp' },
        { type: 'share' },
      ];

      const result = validateInteractionTypes(interactions);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid interaction types', () => {
      const interactions = [
        { type: 'like' },
        { type: 'retweet' }, // Invalid
      ];

      const result = validateInteractionTypes(interactions);
      expect(result.valid).toBe(false);
      expect(result.invalidTypes[0]).toContain('retweet');
    });
  });

  describe('validateImportData', () => {
    it('should validate a complete valid export', () => {
      const validData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userId: 'user-123',
        friends: [
          { id: 'f1', name: 'Alice', tier: 'core', addedAt: new Date().toISOString() },
        ],
        posts: [
          { id: 'p1', contentType: 'text', content: 'Hello', createdAt: new Date().toISOString(), visibility: ['core'] },
        ],
        interactions: [
          { postId: 'p1', type: 'like', createdAt: new Date().toISOString() },
        ],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const result = validateImportData(validData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object data', () => {
      expect(validateImportData(null).valid).toBe(false);
      expect(validateImportData('string').valid).toBe(false);
      expect(validateImportData(123).valid).toBe(false);
    });

    it('should reject data without version', () => {
      const result = validateImportData({ friends: [] });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing version');
    });

    it('should reject data without friends array', () => {
      const result = validateImportData({ version: '1.0.0' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Friends must be an array');
    });

    it('should warn about missing friend fields but not fail', () => {
      const data = {
        version: '1.0.0',
        friends: [{ tier: 'core' }], // Missing id, name, addedAt
      };

      const result = validateImportData(data);
      expect(result.valid).toBe(true); // Still valid
      expect(result.warnings.some(w => w.includes('missing id'))).toBe(true);
      expect(result.warnings.some(w => w.includes('missing name'))).toBe(true);
    });

    it('should error on missing required friend tier', () => {
      const data = {
        version: '1.0.0',
        friends: [{ id: 'f1', name: 'Alice' }], // Missing tier
      };

      const result = validateImportData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('missing tier'))).toBe(true);
    });
  });
});

// ============================================================================
// Import Parsing Tests
// ============================================================================

describe('Import Parsing', () => {
  describe('parseImportData', () => {
    it('should parse valid JSON string', () => {
      const data = {
        version: '1.0.0',
        exportedAt: '2024-06-15T10:00:00.000Z',
        userId: 'user-123',
        friends: [],
        posts: [],
        interactions: [],
        settings: {
          privacy: DEFAULT_PRIVACY_SETTINGS,
          notifications: DEFAULT_NOTIFICATION_SETTINGS,
        },
      };

      const result = parseImportData(JSON.stringify(data));

      expect(result.data).not.toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should convert date strings to Date objects', () => {
      const data = {
        version: '1.0.0',
        exportedAt: '2024-06-15T10:00:00.000Z',
        userId: 'user-123',
        friends: [
          { id: 'f1', name: 'Alice', tier: 'core', addedAt: '2024-01-15T00:00:00.000Z' },
        ],
        posts: [
          { id: 'p1', contentType: 'text', content: 'Hello', createdAt: '2024-06-01T00:00:00.000Z', visibility: ['core'] },
        ],
        interactions: [
          { postId: 'p1', type: 'like', createdAt: '2024-06-02T00:00:00.000Z' },
        ],
        settings: {},
      };

      const result = parseImportData(JSON.stringify(data));

      expect(result.data!.exportedAt).toBeInstanceOf(Date);
      expect(result.data!.friends[0].addedAt).toBeInstanceOf(Date);
      expect(result.data!.posts[0].createdAt).toBeInstanceOf(Date);
      expect(result.data!.interactions[0].createdAt).toBeInstanceOf(Date);
    });

    it('should return error for invalid JSON', () => {
      const result = parseImportData('not valid json {{{');

      expect(result.data).toBeNull();
      expect(result.error).toContain('Failed to parse JSON');
    });

    it('should handle missing optional date fields', () => {
      const data = {
        version: '1.0.0',
        exportedAt: '2024-06-15T10:00:00.000Z',
        userId: 'user-123',
        friends: [
          { id: 'f1', name: 'Alice', tier: 'core' }, // Missing addedAt
        ],
        posts: [],
        interactions: [],
        settings: {},
      };

      const result = parseImportData(JSON.stringify(data));

      expect(result.data).not.toBeNull();
      expect(result.data!.friends[0].addedAt).toBeInstanceOf(Date);
    });
  });

  describe('importSocialGraph', () => {
    it('should successfully import valid data', () => {
      const data = {
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

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should fail import with parse error', () => {
      const result = importSocialGraph('invalid json');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail import with validation error', () => {
      const data = {
        version: '1.0.0',
        friends: [{ tier: 'invalid_tier' }],
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.includes('invalid tier'))).toBe(true);
    });

    it('should return warnings for minor issues', () => {
      const data = {
        version: '1.0.0',
        friends: [{ tier: 'core' }], // Missing id, name
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('convertImportedFriends', () => {
    it('should convert all friend fields correctly', () => {
      const importedFriends = [
        {
          id: 'f1',
          name: 'Alice',
          email: 'alice@example.com',
          phone: '+1234567890',
          tier: 'core' as TierType,
          addedAt: new Date('2024-01-15'),
          lastContacted: new Date('2024-06-01'),
          notes: 'Best friend',
        },
      ];

      const result = convertImportedFriends(importedFriends);

      expect(result[0]).toEqual({
        id: 'f1',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '+1234567890',
        tier: 'core',
        addedAt: new Date('2024-01-15'),
        lastContacted: new Date('2024-06-01'),
        notes: 'Best friend',
      });
    });

    it('should handle string dates', () => {
      const importedFriends = [
        {
          id: 'f1',
          name: 'Alice',
          tier: 'core' as TierType,
          addedAt: '2024-01-15T00:00:00.000Z' as unknown as Date,
        },
      ];

      const result = convertImportedFriends(importedFriends);

      expect(result[0].addedAt).toBeInstanceOf(Date);
      expect(result[0].addedAt.toISOString()).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should handle missing optional fields', () => {
      const importedFriends = [
        {
          id: 'f1',
          name: 'Alice',
          tier: 'core' as TierType,
          addedAt: new Date('2024-01-15'),
        },
      ];

      const result = convertImportedFriends(importedFriends);

      expect(result[0].email).toBeUndefined();
      expect(result[0].phone).toBeUndefined();
      expect(result[0].lastContacted).toBeUndefined();
      expect(result[0].notes).toBeUndefined();
    });
  });
});

// ============================================================================
// Cross-Platform Interoperability Tests
// ============================================================================

describe('Cross-Platform Interoperability', () => {
  describe('Standard Format Compliance', () => {
    it('should use ISO 8601 date format', () => {
      const exportData = exportSocialGraph('user-123', [], []);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(parsed.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should use semantic versioning', () => {
      const exportData = exportSocialGraph('user-123', [], []);

      // Semantic versioning: MAJOR.MINOR.PATCH
      expect(exportData.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should produce UTF-8 encoded content', () => {
      const friends = [createMockFriend({ name: '日本語名前', notes: 'Ñoño 中文 العربية' })];
      const exportData = exportSocialGraph('user-123', friends, []);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.friends[0].name).toBe('日本語名前');
      expect(parsed.friends[0].notes).toBe('Ñoño 中文 العربية');
    });
  });

  describe('Forward Compatibility', () => {
    it('should ignore unknown fields in import', () => {
      const data = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userId: 'user-123',
        friends: [{ id: 'f1', name: 'Alice', tier: 'core', addedAt: new Date().toISOString(), unknownField: 'should be ignored' }],
        posts: [],
        interactions: [],
        settings: {},
        futureFeature: { data: 'should be ignored' },
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.success).toBe(true);
    });

    it('should accept imports from future minor versions', () => {
      const data = {
        version: '1.5.0', // Future minor version
        exportedAt: new Date().toISOString(),
        userId: 'user-123',
        friends: [{ id: 'f1', name: 'Alice', tier: 'core', addedAt: new Date().toISOString() }],
        posts: [],
        interactions: [],
        settings: {},
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.success).toBe(true);
    });
  });

  describe('Backward Compatibility', () => {
    it('should provide default values for missing optional fields', () => {
      const data = {
        version: '1.0.0',
        friends: [{ id: 'f1', name: 'Alice', tier: 'core' }], // Missing addedAt
        posts: [],
        interactions: [],
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.success).toBe(true);
      expect(result.data!.friends[0].addedAt).toBeInstanceOf(Date);
    });
  });
});

// ============================================================================
// Data Integrity Tests
// ============================================================================

describe('Data Integrity', () => {
  describe('Round-trip Preservation', () => {
    it('should preserve data through export->import cycle', () => {
      const originalFriends = [
        createMockFriend({
          id: 'f1',
          name: 'Alice',
          email: 'alice@example.com',
          tier: 'core',
          addedAt: new Date('2024-01-15T10:30:00.000Z'),
          notes: 'Best friend',
        }),
      ];
      const originalPosts = [
        createMockPost({
          id: 'p1',
          authorId: 'user-123',
          contentType: 'text',
          content: 'Hello world',
          createdAt: new Date('2024-06-01T12:00:00.000Z'),
        }),
      ];

      // Export
      const exportData = exportSocialGraph('user-123', originalFriends, originalPosts);
      const jsonString = serializeExport(exportData);

      // Import
      const importResult = importSocialGraph(jsonString);

      expect(importResult.success).toBe(true);
      expect(importResult.data!.friends[0].name).toBe('Alice');
      expect(importResult.data!.friends[0].email).toBe('alice@example.com');
      expect(importResult.data!.friends[0].tier).toBe('core');
      expect(importResult.data!.posts[0].content).toBe('Hello world');
    });

    it('should preserve friend ordering', () => {
      const friends = [
        createMockFriend({ id: 'f1', name: 'Alice' }),
        createMockFriend({ id: 'f2', name: 'Bob' }),
        createMockFriend({ id: 'f3', name: 'Carol' }),
      ];

      const exportData = exportSocialGraph('user-123', friends, []);
      const jsonString = serializeExport(exportData);
      const importResult = importSocialGraph(jsonString);

      expect(importResult.data!.friends.map(f => f.id)).toEqual(['f1', 'f2', 'f3']);
    });
  });

  describe('Large Data Handling', () => {
    it('should handle export with many friends', () => {
      const friends = Array.from({ length: 1000 }, (_, i) =>
        createMockFriend({ id: `f${i}`, name: `Friend ${i}` })
      );

      const exportData = exportSocialGraph('user-123', friends, []);
      const jsonString = serializeExport(exportData);
      const importResult = importSocialGraph(jsonString);

      expect(importResult.success).toBe(true);
      expect(importResult.data!.friends).toHaveLength(1000);
    });

    it('should handle export with many posts', () => {
      const posts = Array.from({ length: 500 }, (_, i) =>
        createMockPost({ id: `p${i}`, authorId: 'user-123', content: `Post ${i}` })
      );

      const exportData = exportSocialGraph('user-123', [], posts);
      const jsonString = serializeExport(exportData);
      const importResult = importSocialGraph(jsonString);

      expect(importResult.success).toBe(true);
      expect(importResult.data!.posts).toHaveLength(500);
    });

    it('should handle export with long content', () => {
      const longContent = 'A'.repeat(10000);
      const posts = [createMockPost({ authorId: 'user-123', content: longContent })];

      const exportData = exportSocialGraph('user-123', [], posts);
      const jsonString = serializeExport(exportData);
      const importResult = importSocialGraph(jsonString);

      expect(importResult.success).toBe(true);
      expect(importResult.data!.posts[0].content).toHaveLength(10000);
    });
  });
});

// ============================================================================
// Privacy & Security Tests
// ============================================================================

describe('Privacy & Security', () => {
  describe('Data Isolation', () => {
    it('should never include other users\' content in export', () => {
      const posts = [
        createMockPost({ id: 'p1', authorId: 'user-123', content: 'My post' }),
        createMockPost({ id: 'p2', authorId: 'friend-1', content: 'Friend post' }),
        createMockPost({ id: 'p3', authorId: 'stranger', content: 'Stranger post' }),
      ];

      const result = exportSocialGraph('user-123', [], posts);

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0].content).toBe('My post');
    });

    it('should never include other users\' interactions on user\'s posts', () => {
      const posts = [
        createMockPost({
          id: 'p1',
          authorId: 'user-123',
          interactions: [
            createMockInteraction({ userId: 'friend-1', type: 'like' }),
            createMockInteraction({ userId: 'friend-2', type: 'comment', content: 'Great!' }),
          ],
        }),
      ];

      const result = exportSocialGraph('user-123', [], posts);

      // User's post is exported but without others' interactions
      expect(result.posts).toHaveLength(1);
      expect(result.interactions).toHaveLength(0);
    });

    it('should only include user\'s own reactions to others\' posts', () => {
      const userId = 'user-123';
      const posts = [
        createMockPost({
          id: 'p1',
          authorId: 'friend-1',
          interactions: [
            createMockInteraction({ userId, type: 'like' }),
            createMockInteraction({ userId, type: 'comment', content: 'Nice!' }),
            createMockInteraction({ userId: 'friend-2', type: 'like' }),
          ],
        }),
      ];

      const result = exportSocialGraph(userId, [], posts);

      expect(result.interactions).toHaveLength(2);
      expect(result.interactions.every(i => i.type === 'like' || i.type === 'comment')).toBe(true);
    });
  });

  describe('Sensitive Data Handling', () => {
    it('should include contact information that user explicitly added', () => {
      const friends = [
        createMockFriend({
          name: 'Alice',
          email: 'alice@example.com',
          phone: '+1234567890',
        }),
      ];

      const result = exportSocialGraph('user-123', friends, []);

      // Contact info should be included for portability
      expect(result.friends[0].email).toBe('alice@example.com');
      expect(result.friends[0].phone).toBe('+1234567890');
    });

    it('should preserve private notes about friends', () => {
      const friends = [
        createMockFriend({
          name: 'Alice',
          notes: 'Met at work - potential business partner',
        }),
      ];

      const result = exportSocialGraph('user-123', friends, []);

      expect(result.friends[0].notes).toBe('Met at work - potential business partner');
    });
  });
});

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('Error Handling', () => {
  describe('Graceful Degradation', () => {
    it('should handle corrupted JSON gracefully', () => {
      const result = importSocialGraph('{"version":"1.0.0", broken');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.data).toBeUndefined();
    });

    it('should handle empty string input', () => {
      const result = importSocialGraph('');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle null bytes in content', () => {
      const friends = [createMockFriend({ name: 'Alice\x00Bob' })];
      const exportData = exportSocialGraph('user-123', friends, []);
      const jsonString = serializeExport(exportData);

      // Should not throw
      expect(() => JSON.parse(jsonString)).not.toThrow();
    });
  });

  describe('Validation Error Messages', () => {
    it('should provide clear error messages for invalid tiers', () => {
      const data = {
        version: '1.0.0',
        friends: [{ id: 'f1', name: 'Alice', tier: 'best_friend' }],
      };

      const result = importSocialGraph(JSON.stringify(data));

      expect(result.errors.some(e => e.includes('invalid tier'))).toBe(true);
      expect(result.errors.some(e => e.includes('best_friend'))).toBe(true);
    });

    it('should identify all validation errors at once', () => {
      const data = {
        version: '2.0.0', // Invalid version
        friends: [
          { tier: 'invalid' }, // Invalid tier, missing fields
          { tier: 'another_bad' }, // Another invalid tier
        ],
        posts: [{ contentType: 'story' }], // Invalid content type
      };

      const result = importSocialGraph(JSON.stringify(data));

      // Should report all errors, not just the first one
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });
});

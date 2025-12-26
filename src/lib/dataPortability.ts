import { Friend, TierType } from '@/types/friend';
import {
  FeedPost,
  PostInteraction,
  ExportableSocialGraph,
  PrivacySettings,
  NotificationSettings,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  InteractionType,
  PostContentType,
} from '@/types/feed';

// ============================================================================
// Export Functions
// ============================================================================

const EXPORT_VERSION = '1.0.0';

/**
 * Create an exportable social graph from user data
 */
export function exportSocialGraph(
  userId: string,
  friends: Friend[],
  posts: FeedPost[],
  privacySettings: PrivacySettings = DEFAULT_PRIVACY_SETTINGS,
  notificationSettings: NotificationSettings = DEFAULT_NOTIFICATION_SETTINGS
): ExportableSocialGraph {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date(),
    userId,
    friends: friends.map(f => ({
      id: f.id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      tier: f.tier,
      addedAt: f.addedAt,
      lastContacted: f.lastContacted,
      notes: f.notes,
    })),
    posts: posts
      .filter(p => p.authorId === userId) // Only export user's own posts
      .map(p => ({
        id: p.id,
        contentType: p.contentType,
        content: p.content,
        createdAt: p.createdAt,
        visibility: p.visibility,
      })),
    interactions: posts.flatMap(p =>
      p.interactions
        .filter(i => i.userId === userId) // Only export user's own interactions
        .map(i => ({
          postId: i.postId,
          type: i.type,
          createdAt: i.createdAt,
        }))
    ),
    settings: {
      privacy: privacySettings,
      notifications: notificationSettings,
    },
  };
}

/**
 * Serialize export data to JSON string
 */
export function serializeExport(data: ExportableSocialGraph): string {
  return JSON.stringify(data, (key, value) => {
    // Convert Date objects to ISO strings
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }, 2);
}

/**
 * Create a downloadable file from export data
 */
export function createExportFile(data: ExportableSocialGraph): Blob {
  const jsonString = serializeExport(data);
  return new Blob([jsonString], { type: 'application/json' });
}

/**
 * Generate a filename for the export
 */
export function generateExportFilename(userId: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `inner-friend-circles-export-${date}.json`;
}

// ============================================================================
// Import & Validation Functions
// ============================================================================

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_TIERS: TierType[] = [
  'core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'
];

const VALID_CONTENT_TYPES: PostContentType[] = [
  'text', 'photo', 'voice_note', 'video', 'call_invite', 'meetup_invite', 'proximity_ping', 'life_update'
];

const VALID_INTERACTION_TYPES: InteractionType[] = [
  'like', 'comment', 'voice_reply', 'call_accepted', 'meetup_rsvp', 'share'
];

/**
 * Validate the version of import data
 */
export function validateVersion(version: string | undefined): { valid: boolean; error?: string } {
  if (!version) {
    return { valid: false, error: 'Missing version' };
  }

  // Support version 1.x.x
  if (!version.startsWith('1.')) {
    return { valid: false, error: `Unsupported version: ${version}. Expected 1.x.x` };
  }

  return { valid: true };
}

/**
 * Validate friend tier information
 */
export function validateFriendTiers(friends: Array<{ tier: string }>): { valid: boolean; invalidTiers: string[] } {
  const invalidTiers: string[] = [];

  friends.forEach((f, index) => {
    if (!VALID_TIERS.includes(f.tier as TierType)) {
      invalidTiers.push(`Friend at index ${index} has invalid tier: ${f.tier}`);
    }
  });

  return {
    valid: invalidTiers.length === 0,
    invalidTiers,
  };
}

/**
 * Validate post content types
 */
export function validatePostContentTypes(
  posts: Array<{ contentType: string }>
): { valid: boolean; invalidTypes: string[] } {
  const invalidTypes: string[] = [];

  posts.forEach((p, index) => {
    if (!VALID_CONTENT_TYPES.includes(p.contentType as PostContentType)) {
      invalidTypes.push(`Post at index ${index} has invalid contentType: ${p.contentType}`);
    }
  });

  return {
    valid: invalidTypes.length === 0,
    invalidTypes,
  };
}

/**
 * Validate interaction types
 */
export function validateInteractionTypes(
  interactions: Array<{ type: string }>
): { valid: boolean; invalidTypes: string[] } {
  const invalidTypes: string[] = [];

  interactions.forEach((i, index) => {
    if (!VALID_INTERACTION_TYPES.includes(i.type as InteractionType)) {
      invalidTypes.push(`Interaction at index ${index} has invalid type: ${i.type}`);
    }
  });

  return {
    valid: invalidTypes.length === 0,
    invalidTypes,
  };
}

/**
 * Comprehensive validation of import data
 */
export function validateImportData(data: unknown): ImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Import data must be an object'], warnings: [] };
  }

  const importData = data as Partial<ExportableSocialGraph>;

  // Validate version
  const versionResult = validateVersion(importData.version);
  if (!versionResult.valid) {
    errors.push(versionResult.error!);
  }

  // Validate friends array
  if (!Array.isArray(importData.friends)) {
    errors.push('Friends must be an array');
  } else {
    const tierResult = validateFriendTiers(importData.friends as Array<{ tier: string }>);
    if (!tierResult.valid) {
      errors.push(...tierResult.invalidTiers);
    }

    // Check for required friend fields
    importData.friends.forEach((f, index) => {
      const friend = f as Partial<Friend>;
      if (!friend.id) warnings.push(`Friend at index ${index} missing id`);
      if (!friend.name) warnings.push(`Friend at index ${index} missing name`);
      if (!friend.tier) errors.push(`Friend at index ${index} missing tier`);
      if (!friend.addedAt) warnings.push(`Friend at index ${index} missing addedAt`);
    });
  }

  // Validate posts array (optional)
  if (importData.posts && !Array.isArray(importData.posts)) {
    errors.push('Posts must be an array');
  } else if (importData.posts) {
    const contentResult = validatePostContentTypes(importData.posts as Array<{ contentType: string }>);
    if (!contentResult.valid) {
      errors.push(...contentResult.invalidTypes);
    }
  }

  // Validate interactions array (optional)
  if (importData.interactions && !Array.isArray(importData.interactions)) {
    errors.push('Interactions must be an array');
  } else if (importData.interactions) {
    const interactionResult = validateInteractionTypes(importData.interactions as Array<{ type: string }>);
    if (!interactionResult.valid) {
      errors.push(...interactionResult.invalidTypes);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Parse import JSON string
 */
export function parseImportData(jsonString: string): { data: ExportableSocialGraph | null; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);

    // Convert date strings back to Date objects
    if (parsed.exportedAt) {
      parsed.exportedAt = new Date(parsed.exportedAt);
    }

    if (parsed.friends) {
      parsed.friends = parsed.friends.map((f: { addedAt?: string; lastContacted?: string }) => ({
        ...f,
        addedAt: f.addedAt ? new Date(f.addedAt) : new Date(),
        lastContacted: f.lastContacted ? new Date(f.lastContacted) : undefined,
      }));
    }

    if (parsed.posts) {
      parsed.posts = parsed.posts.map((p: { createdAt?: string }) => ({
        ...p,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
      }));
    }

    if (parsed.interactions) {
      parsed.interactions = parsed.interactions.map((i: { createdAt?: string }) => ({
        ...i,
        createdAt: i.createdAt ? new Date(i.createdAt) : new Date(),
      }));
    }

    return { data: parsed as ExportableSocialGraph };
  } catch (e) {
    return { data: null, error: `Failed to parse JSON: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

/**
 * Import and validate social graph data
 */
export function importSocialGraph(
  jsonString: string
): { success: boolean; data?: ExportableSocialGraph; errors: string[]; warnings: string[] } {
  // Parse JSON
  const parseResult = parseImportData(jsonString);
  if (!parseResult.data) {
    return {
      success: false,
      errors: [parseResult.error || 'Failed to parse import data'],
      warnings: [],
    };
  }

  // Validate data
  const validationResult = validateImportData(parseResult.data);

  if (!validationResult.valid) {
    return {
      success: false,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
    };
  }

  return {
    success: true,
    data: parseResult.data,
    errors: [],
    warnings: validationResult.warnings,
  };
}

/**
 * Convert imported friends to Friend type with proper dates
 */
export function convertImportedFriends(
  importedFriends: ExportableSocialGraph['friends']
): Friend[] {
  return importedFriends.map(f => ({
    id: f.id,
    name: f.name,
    email: f.email,
    phone: f.phone,
    tier: f.tier,
    addedAt: f.addedAt instanceof Date ? f.addedAt : new Date(f.addedAt),
    lastContacted: f.lastContacted
      ? (f.lastContacted instanceof Date ? f.lastContacted : new Date(f.lastContacted))
      : undefined,
    notes: f.notes,
  }));
}

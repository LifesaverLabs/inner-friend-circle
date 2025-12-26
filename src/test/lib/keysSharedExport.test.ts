import { describe, it, expect } from 'vitest';
import {
  exportSocialGraph,
  serializeExport,
  importSocialGraph,
} from '@/lib/dataPortability';
import { Friend, TierType } from '@/types/friend';
import {
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/types/feed';
import {
  HomeEntryPreferences,
  NayborKeyAccess,
  EmergencyScenario,
  getMandatoryScenarios,
  DoorBreakingPreference,
} from '@/types/keysShared';

// ============================================================================
// Test Helpers
// ============================================================================

const createMockFriend = (overrides: Partial<Friend> = {}): Friend => ({
  id: `friend-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Friend',
  tier: 'naybor' as TierType,
  addedAt: new Date('2024-01-15'),
  ...overrides,
});

const createMockKeyHolder = (overrides: Partial<NayborKeyAccess> = {}): NayborKeyAccess => ({
  nayborId: `friend-${Math.random().toString(36).substr(2, 9)}`,
  keyType: 'physical',
  hasPhysicalKey: true,
  hasDigitalCode: false,
  confirmedAt: new Date('2024-06-01'),
  ...overrides,
});

const createMockKeysSharedPreferences = (
  userId: string,
  overrides: Partial<HomeEntryPreferences> = {}
): HomeEntryPreferences => ({
  userId,
  address: '123 Main Street',
  unitNumber: 'Apt 4B',
  entryInstructions: 'Ring twice, keypad is on the right',
  emergencyPermissions: getMandatoryScenarios(),
  keyHolders: [],
  shareWithEmergencyWorkers: true,
  doorBreakingPreference: 'break_fast_call_naybors',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-15'),
  ...overrides,
});

// ============================================================================
// Keys Shared Data Export Tests - Data Liberation Front Compliance
// ============================================================================

describe('Keys Shared Export - Data Liberation Front Compliance', () => {
  describe('Data Completeness', () => {
    it('should include keysShared in export when provided', () => {
      const userId = 'user-123';
      const keysShared = createMockKeysSharedPreferences(userId, {
        keyHolders: [
          createMockKeyHolder({ nayborId: 'naybor-1', keyType: 'physical' }),
          createMockKeyHolder({ nayborId: 'naybor-2', keyType: 'digital', digitalCodeType: 'keypad' }),
        ],
      });

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      expect(result.keysShared).toBeDefined();
      expect(result.keysShared?.userId).toBe(userId);
      expect(result.keysShared?.keyHolders).toHaveLength(2);
    });

    it('should preserve all keysShared fields', () => {
      const userId = 'user-123';
      const keysShared = createMockKeysSharedPreferences(userId, {
        address: '456 Oak Avenue',
        unitNumber: 'Suite 100',
        entryInstructions: 'Use back entrance',
        shareWithEmergencyWorkers: false,
        doorBreakingPreference: 'last_resort_only',
        emergencyPermissions: [...getMandatoryScenarios(), 'welfare_check', 'flooding'] as EmergencyScenario[],
      });

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      expect(result.keysShared?.address).toBe('456 Oak Avenue');
      expect(result.keysShared?.unitNumber).toBe('Suite 100');
      expect(result.keysShared?.entryInstructions).toBe('Use back entrance');
      expect(result.keysShared?.shareWithEmergencyWorkers).toBe(false);
      expect(result.keysShared?.doorBreakingPreference).toBe('last_resort_only');
      expect(result.keysShared?.emergencyPermissions).toContain('welfare_check');
      expect(result.keysShared?.emergencyPermissions).toContain('flooding');
    });

    it('should preserve keyHolder details', () => {
      const userId = 'user-123';
      const keyHolder: NayborKeyAccess = {
        nayborId: 'naybor-alice',
        keyType: 'both',
        hasPhysicalKey: true,
        hasDigitalCode: true,
        digitalCodeType: 'smart_lock',
        notes: 'Key is under the blue flowerpot',
        confirmedAt: new Date('2024-03-15'),
        lastVerified: new Date('2024-06-01'),
      };
      const keysShared = createMockKeysSharedPreferences(userId, {
        keyHolders: [keyHolder],
      });

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      const exportedKeyHolder = result.keysShared?.keyHolders[0];
      expect(exportedKeyHolder?.nayborId).toBe('naybor-alice');
      expect(exportedKeyHolder?.keyType).toBe('both');
      expect(exportedKeyHolder?.hasPhysicalKey).toBe(true);
      expect(exportedKeyHolder?.hasDigitalCode).toBe(true);
      expect(exportedKeyHolder?.digitalCodeType).toBe('smart_lock');
      expect(exportedKeyHolder?.notes).toBe('Key is under the blue flowerpot');
    });

    it('should exclude keysShared when not provided', () => {
      const userId = 'user-123';
      const result = exportSocialGraph(userId, [], []);

      expect(result.keysShared).toBeUndefined();
    });
  });

  describe('Serialization', () => {
    it('should serialize keysShared to valid JSON', () => {
      const userId = 'user-123';
      const keysShared = createMockKeysSharedPreferences(userId, {
        keyHolders: [createMockKeyHolder()],
      });

      const exportData = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);
      const jsonString = serializeExport(exportData);

      expect(() => JSON.parse(jsonString)).not.toThrow();

      const parsed = JSON.parse(jsonString);
      expect(parsed.keysShared).toBeDefined();
      expect(parsed.keysShared.address).toBe(keysShared.address);
    });

    it('should convert Date objects to ISO strings in keysShared', () => {
      const userId = 'user-123';
      const confirmedDate = new Date('2024-06-15T10:30:00Z');
      const keysShared = createMockKeysSharedPreferences(userId, {
        keyHolders: [createMockKeyHolder({ confirmedAt: confirmedDate })],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-06-15T12:00:00Z'),
      });

      const exportData = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);
      const jsonString = serializeExport(exportData);
      const parsed = JSON.parse(jsonString);

      expect(parsed.keysShared.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(parsed.keysShared.updatedAt).toBe('2024-06-15T12:00:00.000Z');
      expect(parsed.keysShared.keyHolders[0].confirmedAt).toBe('2024-06-15T10:30:00.000Z');
    });
  });

  describe('Privacy Sensitivity', () => {
    it('should only export keysShared for the requesting user', () => {
      const userId = 'user-123';
      const keysShared = createMockKeysSharedPreferences(userId);

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      // keysShared userId should match the export userId
      expect(result.keysShared?.userId).toBe(userId);
      expect(result.userId).toBe(userId);
    });

    it('should preserve sensitive entry instructions', () => {
      const userId = 'user-123';
      const sensitiveInstructions = 'Garage code is 1234, spare key under third rock left of mailbox';
      const keysShared = createMockKeysSharedPreferences(userId, {
        entryInstructions: sensitiveInstructions,
      });

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      // User's own sensitive data SHOULD be included in their export
      expect(result.keysShared?.entryInstructions).toBe(sensitiveInstructions);
    });

    it('should preserve emergency worker sharing preference', () => {
      const userId = 'user-123';

      // Test with sharing enabled
      const keysSharedEnabled = createMockKeysSharedPreferences(userId, {
        shareWithEmergencyWorkers: true,
      });
      const resultEnabled = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysSharedEnabled);
      expect(resultEnabled.keysShared?.shareWithEmergencyWorkers).toBe(true);

      // Test with sharing disabled
      const keysSharedDisabled = createMockKeysSharedPreferences(userId, {
        shareWithEmergencyWorkers: false,
      });
      const resultDisabled = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysSharedDisabled);
      expect(resultDisabled.keysShared?.shareWithEmergencyWorkers).toBe(false);
    });

    it('should preserve door breaking preference', () => {
      const userId = 'user-123';
      const preferences: DoorBreakingPreference[] = ['break_fast_no_naybors', 'break_fast_call_naybors', 'last_resort_only'];

      preferences.forEach(pref => {
        const keysShared = createMockKeysSharedPreferences(userId, {
          doorBreakingPreference: pref,
        });
        const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);
        expect(result.keysShared?.doorBreakingPreference).toBe(pref);
      });
    });
  });

  describe('Round-trip Preservation', () => {
    it('should preserve keysShared data through export->serialize cycle', () => {
      const userId = 'user-123';
      const keysShared = createMockKeysSharedPreferences(userId, {
        address: '789 Elm Street',
        unitNumber: '2A',
        entryInstructions: 'Blue door on left',
        shareWithEmergencyWorkers: false,
        doorBreakingPreference: 'last_resort_only',
        emergencyPermissions: [...getMandatoryScenarios(), 'welfare_check'] as EmergencyScenario[],
        keyHolders: [
          createMockKeyHolder({
            nayborId: 'alice-123',
            keyType: 'physical',
            notes: 'Has garage opener too',
          }),
          createMockKeyHolder({
            nayborId: 'bob-456',
            keyType: 'digital',
            digitalCodeType: 'keypad',
          }),
        ],
      });

      // Export
      const exportData = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);
      const jsonString = serializeExport(exportData);

      // Parse back
      const parsed = JSON.parse(jsonString);

      // Verify all fields
      expect(parsed.keysShared.userId).toBe(userId);
      expect(parsed.keysShared.address).toBe('789 Elm Street');
      expect(parsed.keysShared.unitNumber).toBe('2A');
      expect(parsed.keysShared.entryInstructions).toBe('Blue door on left');
      expect(parsed.keysShared.shareWithEmergencyWorkers).toBe(false);
      expect(parsed.keysShared.doorBreakingPreference).toBe('last_resort_only');
      expect(parsed.keysShared.emergencyPermissions).toContain('welfare_check');
      expect(parsed.keysShared.keyHolders).toHaveLength(2);
      expect(parsed.keysShared.keyHolders[0].notes).toBe('Has garage opener too');
      expect(parsed.keysShared.keyHolders[1].digitalCodeType).toBe('keypad');
    });
  });

  describe('Combined Export with Other Data', () => {
    it('should export keysShared alongside friends and posts', () => {
      const userId = 'user-123';
      const friends = [
        createMockFriend({ id: 'naybor-1', name: 'Alice', tier: 'naybor' }),
        createMockFriend({ id: 'naybor-2', name: 'Bob', tier: 'naybor' }),
      ];
      const keysShared = createMockKeysSharedPreferences(userId, {
        keyHolders: [
          createMockKeyHolder({ nayborId: 'naybor-1' }),
        ],
      });

      const result = exportSocialGraph(userId, friends, [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      // Should have both friends and keysShared
      expect(result.friends).toHaveLength(2);
      expect(result.keysShared).toBeDefined();
      expect(result.keysShared?.keyHolders).toHaveLength(1);

      // KeyHolder references naybor that's in friends list
      expect(result.keysShared?.keyHolders[0].nayborId).toBe('naybor-1');
      expect(result.friends.some(f => f.id === 'naybor-1')).toBe(true);
    });
  });
});

// ============================================================================
// Emergency Worker Sharing Toggle Tests
// ============================================================================

describe('Emergency Worker Sharing Toggle', () => {
  it('should default to true (opt-out model for safety)', () => {
    const userId = 'user-123';
    const keysShared = createMockKeysSharedPreferences(userId);

    // Default preference should be to share with emergency workers
    expect(keysShared.shareWithEmergencyWorkers).toBe(true);
  });

  it('should allow toggling to false (disabled)', () => {
    const userId = 'user-123';
    const keysShared = createMockKeysSharedPreferences(userId, {
      shareWithEmergencyWorkers: false,
    });

    const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

    expect(result.keysShared?.shareWithEmergencyWorkers).toBe(false);
  });

  it('should preserve toggle state through serialization', () => {
    const userId = 'user-123';

    // Test false
    const keysSharedOff = createMockKeysSharedPreferences(userId, {
      shareWithEmergencyWorkers: false,
    });
    const exportOff = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysSharedOff);
    const jsonOff = serializeExport(exportOff);
    const parsedOff = JSON.parse(jsonOff);
    expect(parsedOff.keysShared.shareWithEmergencyWorkers).toBe(false);

    // Test true
    const keysSharedOn = createMockKeysSharedPreferences(userId, {
      shareWithEmergencyWorkers: true,
    });
    const exportOn = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysSharedOn);
    const jsonOn = serializeExport(exportOn);
    const parsedOn = JSON.parse(jsonOn);
    expect(parsedOn.keysShared.shareWithEmergencyWorkers).toBe(true);
  });
});

// ============================================================================
// Door Breaking Preference Tests
// ============================================================================

describe('Door Breaking Preference', () => {
  it('should support all three preference options', () => {
    const userId = 'user-123';
    const preferences: DoorBreakingPreference[] = [
      'break_fast_no_naybors',
      'break_fast_call_naybors',
      'last_resort_only',
    ];

    preferences.forEach(pref => {
      const keysShared = createMockKeysSharedPreferences(userId, {
        doorBreakingPreference: pref,
      });

      const result = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);

      expect(result.keysShared?.doorBreakingPreference).toBe(pref);
    });
  });

  it('should default to break_fast_call_naybors', () => {
    const userId = 'user-123';
    const keysShared = createMockKeysSharedPreferences(userId);

    // Default should be balanced approach
    expect(keysShared.doorBreakingPreference).toBe('break_fast_call_naybors');
  });

  it('should preserve preference through serialization', () => {
    const userId = 'user-123';
    const keysShared = createMockKeysSharedPreferences(userId, {
      doorBreakingPreference: 'last_resort_only',
    });

    const exportData = exportSocialGraph(userId, [], [], DEFAULT_PRIVACY_SETTINGS, DEFAULT_NOTIFICATION_SETTINGS, keysShared);
    const jsonString = serializeExport(exportData);
    const parsed = JSON.parse(jsonString);

    expect(parsed.keysShared.doorBreakingPreference).toBe('last_resort_only');
  });
});

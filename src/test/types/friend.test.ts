import { describe, it, expect } from 'vitest';
import {
  TIER_LIMITS,
  TIER_INFO,
  CONTACT_METHODS,
  type TierType,
  type ContactMethod,
  type Friend,
  type ReservedGroup,
  type ReservedSpots,
  type FriendLists,
} from '@/types/friend';

describe('Friend Types and Constants', () => {
  describe('TIER_LIMITS', () => {
    it('should have core limit of 5', () => {
      expect(TIER_LIMITS.core).toBe(5);
    });

    it('should have inner limit of 15', () => {
      expect(TIER_LIMITS.inner).toBe(15);
    });

    it('should have outer limit of 150', () => {
      expect(TIER_LIMITS.outer).toBe(150);
    });

    it('should have parasocial limit of 25', () => {
      expect(TIER_LIMITS.parasocial).toBe(25);
    });

    it('should have rolemodel limit of 25', () => {
      expect(TIER_LIMITS.rolemodel).toBe(25);
    });

    it('should have naybor limit of 25', () => {
      expect(TIER_LIMITS.naybor).toBe(25);
    });

    it('should have acquainted limit of 1000', () => {
      expect(TIER_LIMITS.acquainted).toBe(1000);
    });

    it('should have exactly 7 tier limits', () => {
      expect(Object.keys(TIER_LIMITS)).toHaveLength(7);
    });

    it('should have all tiers defined', () => {
      const expectedTiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
      expectedTiers.forEach(tier => {
        expect(TIER_LIMITS[tier]).toBeDefined();
        expect(typeof TIER_LIMITS[tier]).toBe('number');
      });
    });

    it('should have positive limits for all tiers', () => {
      Object.values(TIER_LIMITS).forEach(limit => {
        expect(limit).toBeGreaterThan(0);
      });
    });

    it('should follow Dunbar number pattern (increasing limits)', () => {
      expect(TIER_LIMITS.core).toBeLessThan(TIER_LIMITS.inner);
      expect(TIER_LIMITS.inner).toBeLessThan(TIER_LIMITS.outer);
    });
  });

  describe('TIER_INFO', () => {
    const allTiers: TierType[] = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];

    it('should have info for all tiers', () => {
      allTiers.forEach(tier => {
        expect(TIER_INFO[tier]).toBeDefined();
      });
    });

    it('should have name for each tier', () => {
      allTiers.forEach(tier => {
        expect(TIER_INFO[tier].name).toBeDefined();
        expect(typeof TIER_INFO[tier].name).toBe('string');
        expect(TIER_INFO[tier].name.length).toBeGreaterThan(0);
      });
    });

    it('should have description for each tier', () => {
      allTiers.forEach(tier => {
        expect(TIER_INFO[tier].description).toBeDefined();
        expect(typeof TIER_INFO[tier].description).toBe('string');
      });
    });

    it('should have color for each tier', () => {
      allTiers.forEach(tier => {
        expect(TIER_INFO[tier].color).toBeDefined();
        expect(typeof TIER_INFO[tier].color).toBe('string');
      });
    });

    it('should have core tier named "Core"', () => {
      expect(TIER_INFO.core.name).toBe('Core');
    });

    it('should have inner tier named "Inner"', () => {
      expect(TIER_INFO.inner.name).toBe('Inner');
    });

    it('should have outer tier named "Outer"', () => {
      expect(TIER_INFO.outer.name).toBe('Outer');
    });

    it('should have parasocial tier properly named', () => {
      expect(TIER_INFO.parasocial.name.toLowerCase()).toContain('parasocial');
    });

    it('should have rolemodel tier properly named', () => {
      expect(TIER_INFO.rolemodel.name.toLowerCase()).toContain('role');
    });

    it('should have naybor tier properly named', () => {
      expect(TIER_INFO.naybor.name.toLowerCase()).toContain('naybor');
    });

    it('should have acquainted tier properly named', () => {
      expect(TIER_INFO.acquainted.name.toLowerCase()).toContain('acqua');
    });
  });

  describe('CONTACT_METHODS', () => {
    const allMethods: ContactMethod[] = ['tel', 'facetime', 'whatsapp', 'signal', 'telegram'];

    it('should have all contact methods defined', () => {
      allMethods.forEach(method => {
        expect(CONTACT_METHODS[method]).toBeDefined();
      });
    });

    it('should have name for each contact method', () => {
      allMethods.forEach(method => {
        expect(CONTACT_METHODS[method].name).toBeDefined();
        expect(typeof CONTACT_METHODS[method].name).toBe('string');
      });
    });

    it('should have icon for each contact method', () => {
      allMethods.forEach(method => {
        expect(CONTACT_METHODS[method].icon).toBeDefined();
      });
    });

    it('should have tel named "Phone Call"', () => {
      expect(CONTACT_METHODS.tel.name).toBe('Phone Call');
    });

    it('should have facetime named "FaceTime"', () => {
      expect(CONTACT_METHODS.facetime.name).toBe('FaceTime');
    });

    it('should have whatsapp named "WhatsApp"', () => {
      expect(CONTACT_METHODS.whatsapp.name).toBe('WhatsApp');
    });

    it('should have signal named "Signal"', () => {
      expect(CONTACT_METHODS.signal.name).toBe('Signal');
    });

    it('should have telegram named "Telegram"', () => {
      expect(CONTACT_METHODS.telegram.name).toBe('Telegram');
    });

    it('should have getUrl function for each contact method', () => {
      allMethods.forEach(method => {
        expect(typeof CONTACT_METHODS[method].getUrl).toBe('function');
      });
    });

    it('should generate tel: URL for phone', () => {
      const url = CONTACT_METHODS.tel.getUrl('1234567890');
      expect(url).toBe('tel:1234567890');
    });

    it('should generate facetime: URL for FaceTime', () => {
      const url = CONTACT_METHODS.facetime.getUrl('1234567890');
      expect(url).toBe('facetime:1234567890');
    });

    it('should generate whatsapp URL', () => {
      const url = CONTACT_METHODS.whatsapp.getUrl('1234567890');
      expect(url).toContain('wa.me');
      expect(url).toContain('1234567890');
    });

    it('should generate signal URL', () => {
      const url = CONTACT_METHODS.signal.getUrl('1234567890');
      expect(url).toContain('signal');
    });

    it('should generate telegram URL', () => {
      const url = CONTACT_METHODS.telegram.getUrl('username');
      expect(url).toContain('t.me');
    });
  });

  describe('Type Structure Validation', () => {
    it('should accept valid Friend object', () => {
      const friend: Friend = {
        id: 'test-id',
        name: 'John Doe',
        tier: 'core',
        addedAt: new Date(),
      };

      expect(friend.id).toBe('test-id');
      expect(friend.name).toBe('John Doe');
      expect(friend.tier).toBe('core');
      expect(friend.addedAt).toBeInstanceOf(Date);
    });

    it('should accept Friend with optional fields', () => {
      const friend: Friend = {
        id: 'test-id',
        name: 'John Doe',
        tier: 'inner',
        addedAt: new Date(),
        email: 'john@example.com',
        phone: '1234567890',
        preferredContact: 'whatsapp',
        notes: 'Test notes',
        sortOrder: 1,
      };

      expect(friend.email).toBe('john@example.com');
      expect(friend.phone).toBe('1234567890');
      expect(friend.preferredContact).toBe('whatsapp');
      expect(friend.notes).toBe('Test notes');
      expect(friend.sortOrder).toBe(1);
    });

    it('should accept valid ReservedGroup object', () => {
      const group: ReservedGroup = {
        id: 'group-1',
        count: 3,
      };

      expect(group.id).toBe('group-1');
      expect(group.count).toBe(3);
    });

    it('should accept ReservedGroup with note', () => {
      const group: ReservedGroup = {
        id: 'group-1',
        count: 5,
        note: 'Reserved for work friends',
      };

      expect(group.note).toBe('Reserved for work friends');
    });

    it('should accept valid ReservedSpots structure', () => {
      const spots: ReservedSpots = {
        core: [{ id: '1', count: 2 }],
        inner: [],
        outer: [],
        naybor: [{ id: '2', count: 3, note: 'Neighbors' }],
        parasocial: [],
        rolemodel: [],
        acquainted: [],
      };

      expect(spots.core).toHaveLength(1);
      expect(spots.inner).toHaveLength(0);
      expect(spots.naybor).toHaveLength(1);
      expect(spots.naybor[0].count).toBe(3);
    });

    it('should accept valid FriendLists structure', () => {
      const lists: FriendLists = {
        friends: [
          {
            id: '1',
            name: 'Friend 1',
            tier: 'core',
            addedAt: new Date(),
          },
        ],
        reservedSpots: {
          core: [],
          inner: [],
          outer: [],
          naybor: [],
          parasocial: [],
          rolemodel: [],
          acquainted: [],
        },
      };

      expect(lists.friends).toHaveLength(1);
      expect(lists.reservedSpots).toBeDefined();
    });

    it('should accept Friend with naybor tier', () => {
      const friend: Friend = {
        id: 'naybor-friend',
        name: 'Neighbor Friend',
        tier: 'naybor',
        addedAt: new Date(),
      };

      expect(friend.tier).toBe('naybor');
    });
  });

  describe('TierType values', () => {
    it('should include core', () => {
      const tier: TierType = 'core';
      expect(tier).toBe('core');
    });

    it('should include inner', () => {
      const tier: TierType = 'inner';
      expect(tier).toBe('inner');
    });

    it('should include outer', () => {
      const tier: TierType = 'outer';
      expect(tier).toBe('outer');
    });

    it('should include naybor', () => {
      const tier: TierType = 'naybor';
      expect(tier).toBe('naybor');
    });

    it('should include parasocial', () => {
      const tier: TierType = 'parasocial';
      expect(tier).toBe('parasocial');
    });

    it('should include rolemodel', () => {
      const tier: TierType = 'rolemodel';
      expect(tier).toBe('rolemodel');
    });

    it('should include acquainted', () => {
      const tier: TierType = 'acquainted';
      expect(tier).toBe('acquainted');
    });
  });

  describe('ContactMethod values', () => {
    it('should include tel', () => {
      const method: ContactMethod = 'tel';
      expect(method).toBe('tel');
    });

    it('should include facetime', () => {
      const method: ContactMethod = 'facetime';
      expect(method).toBe('facetime');
    });

    it('should include whatsapp', () => {
      const method: ContactMethod = 'whatsapp';
      expect(method).toBe('whatsapp');
    });

    it('should include signal', () => {
      const method: ContactMethod = 'signal';
      expect(method).toBe('signal');
    });

    it('should include telegram', () => {
      const method: ContactMethod = 'telegram';
      expect(method).toBe('telegram');
    });
  });
});

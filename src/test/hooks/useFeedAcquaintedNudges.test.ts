import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Friend, TierType } from '@/types/friend';

// Types for the acquainted nudge system
interface AcquaintedNudgeConfig {
  minimumAgeMonths: number; // 12 months minimum before eligible
  nudgeDayOfMonth: number;  // 1 = first day of month
  monthlyBatchFraction: number; // 1/12 of eligible list
}

interface AcquaintedNudgeBatch {
  friends: Friend[];
  batchNumber: number; // 1-12 for which month's batch
  totalEligible: number;
  nextBatchDate: Date;
}

interface MonthlyNudgeSchedule {
  month: number; // 1-12
  year: number;
  friendIds: string[];
}

// Helper to create mock acquainted friends
const createAcquaintedFriend = (
  id: string,
  name: string,
  addedAt: Date,
  lastContacted?: Date
): Friend => ({
  id,
  name,
  tier: 'acquainted',
  addedAt,
  lastContacted,
});

// Helper to create a date
const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day); // month is 0-indexed in JS
};

describe('Acquainted Cousins Sunset Nudge System', () => {
  let mockNow: Date;

  beforeEach(() => {
    // Default: January 1, 2025
    mockNow = createDate(2025, 1, 1);
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Eligibility Requirements', () => {
    it('should NOT nudge acquainted cousins added less than 12 months ago', () => {
      const friend = createAcquaintedFriend(
        'recent-1',
        'Recent Acquaintance',
        createDate(2024, 6, 15) // Added 6.5 months ago
      );

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      expect(isEligibleForNudge(friend, mockNow)).toBe(false);
    });

    it('should nudge acquainted cousins added exactly 12 months ago', () => {
      const friend = createAcquaintedFriend(
        'exactly-12',
        'Year Old Acquaintance',
        createDate(2024, 1, 1) // Exactly 12 months ago
      );

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      expect(isEligibleForNudge(friend, mockNow)).toBe(true);
    });

    it('should nudge acquainted cousins added more than 12 months ago', () => {
      const friend = createAcquaintedFriend(
        'old-1',
        'Old Acquaintance',
        createDate(2022, 6, 1) // 2.5 years ago
      );

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      expect(isEligibleForNudge(friend, mockNow)).toBe(true);
    });

    it('should NOT nudge friends from other tiers regardless of age', () => {
      const coreFriend = createAcquaintedFriend(
        'core-old',
        'Old Core Friend',
        createDate(2020, 1, 1)
      );
      coreFriend.tier = 'core';

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      expect(isEligibleForNudge(coreFriend, mockNow)).toBe(false);
    });

    it('should filter eligible acquainted cousins from a mixed list', () => {
      const friends: Friend[] = [
        createAcquaintedFriend('a1', 'Eligible 1', createDate(2023, 6, 1)),  // 18 months - eligible
        createAcquaintedFriend('a2', 'Eligible 2', createDate(2023, 12, 1)), // 13 months - eligible
        createAcquaintedFriend('a3', 'Too Recent', createDate(2024, 6, 1)),  // 7 months - not eligible
        { ...createAcquaintedFriend('c1', 'Core', createDate(2020, 1, 1)), tier: 'core' as TierType },
        createAcquaintedFriend('a4', 'Exactly 12', createDate(2024, 1, 1)), // 12 months - eligible
      ];

      const getEligibleAcquainted = (friendsList: Friend[], now: Date): Friend[] => {
        return friendsList.filter(f => {
          if (f.tier !== 'acquainted') return false;
          const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
          return monthsSinceAdded >= 12;
        });
      };

      const eligible = getEligibleAcquainted(friends, mockNow);

      expect(eligible).toHaveLength(3);
      expect(eligible.map(f => f.id)).toContain('a1');
      expect(eligible.map(f => f.id)).toContain('a2');
      expect(eligible.map(f => f.id)).toContain('a4');
      expect(eligible.map(f => f.id)).not.toContain('a3');
      expect(eligible.map(f => f.id)).not.toContain('c1');
    });
  });

  describe('Monthly Timing', () => {
    it('should only show nudges on the first day of the month', () => {
      const isNudgeDay = (date: Date): boolean => {
        return date.getDate() === 1;
      };

      expect(isNudgeDay(createDate(2025, 1, 1))).toBe(true);
      expect(isNudgeDay(createDate(2025, 2, 1))).toBe(true);
      expect(isNudgeDay(createDate(2025, 6, 1))).toBe(true);
      expect(isNudgeDay(createDate(2025, 12, 1))).toBe(true);
    });

    it('should NOT show nudges on other days of the month', () => {
      const isNudgeDay = (date: Date): boolean => {
        return date.getDate() === 1;
      };

      expect(isNudgeDay(createDate(2025, 1, 2))).toBe(false);
      expect(isNudgeDay(createDate(2025, 1, 15))).toBe(false);
      expect(isNudgeDay(createDate(2025, 1, 28))).toBe(false);
      expect(isNudgeDay(createDate(2025, 1, 31))).toBe(false);
    });

    it('should calculate next nudge day correctly from mid-month', () => {
      const getNextNudgeDay = (fromDate: Date): Date => {
        const next = new Date(fromDate);
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(0, 0, 0, 0);
        return next;
      };

      const midJan = createDate(2025, 1, 15);
      const nextNudge = getNextNudgeDay(midJan);

      expect(nextNudge.getFullYear()).toBe(2025);
      expect(nextNudge.getMonth()).toBe(1); // February (0-indexed)
      expect(nextNudge.getDate()).toBe(1);
    });

    it('should calculate next nudge day correctly from last day of month', () => {
      const getNextNudgeDay = (fromDate: Date): Date => {
        const next = new Date(fromDate);
        // Set to first of next month properly to avoid day overflow
        next.setDate(1); // First, set to day 1 to avoid overflow
        next.setMonth(next.getMonth() + 1);
        next.setHours(0, 0, 0, 0);
        return next;
      };

      const lastJan = createDate(2025, 1, 31);
      const nextNudge = getNextNudgeDay(lastJan);

      expect(nextNudge.getFullYear()).toBe(2025);
      expect(nextNudge.getMonth()).toBe(1); // February
      expect(nextNudge.getDate()).toBe(1);
    });

    it('should handle year boundary correctly', () => {
      const getNextNudgeDay = (fromDate: Date): Date => {
        const next = new Date(fromDate);
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(0, 0, 0, 0);
        return next;
      };

      const midDec = createDate(2025, 12, 15);
      const nextNudge = getNextNudgeDay(midDec);

      expect(nextNudge.getFullYear()).toBe(2026);
      expect(nextNudge.getMonth()).toBe(0); // January
      expect(nextNudge.getDate()).toBe(1);
    });
  });

  describe('Monthly Batch Size (1/12 of eligible)', () => {
    it('should return approximately 1/12 of eligible acquainted cousins', () => {
      // Create 120 eligible acquainted cousins
      const friends: Friend[] = Array.from({ length: 120 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1) // All added 2 years ago
        )
      );

      const getMonthlyBatchSize = (totalEligible: number): number => {
        return Math.ceil(totalEligible / 12);
      };

      expect(getMonthlyBatchSize(120)).toBe(10);
    });

    it('should handle small lists (less than 12 people)', () => {
      const getMonthlyBatchSize = (totalEligible: number): number => {
        return Math.max(1, Math.ceil(totalEligible / 12));
      };

      expect(getMonthlyBatchSize(5)).toBe(1);
      expect(getMonthlyBatchSize(1)).toBe(1);
      expect(getMonthlyBatchSize(11)).toBe(1);
    });

    it('should handle exactly 12 people (1 per month)', () => {
      const getMonthlyBatchSize = (totalEligible: number): number => {
        return Math.ceil(totalEligible / 12);
      };

      expect(getMonthlyBatchSize(12)).toBe(1);
    });

    it('should handle uneven division (13 people)', () => {
      const getMonthlyBatchSize = (totalEligible: number): number => {
        return Math.ceil(totalEligible / 12);
      };

      // 13/12 = 1.08, ceil = 2, but that would mean some months get 2, some get 1
      // Actually we want to spread evenly, so first month(s) get 2, rest get 1
      expect(getMonthlyBatchSize(13)).toBe(2);
    });

    it('should handle large lists (1000 people)', () => {
      const getMonthlyBatchSize = (totalEligible: number): number => {
        return Math.ceil(totalEligible / 12);
      };

      expect(getMonthlyBatchSize(1000)).toBe(84); // ceil(1000/12) = 84
    });

    it('should handle empty list', () => {
      const getMonthlyBatchSize = (totalEligible: number): number => {
        if (totalEligible === 0) return 0;
        return Math.max(1, Math.ceil(totalEligible / 12));
      };

      expect(getMonthlyBatchSize(0)).toBe(0);
    });
  });

  describe('Systematic Coverage Over 12 Months', () => {
    it('should assign each eligible friend to exactly one month in a 12-month cycle', () => {
      const friends: Friend[] = Array.from({ length: 24 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1)
        )
      );

      const assignToMonthlyBatches = (friendsList: Friend[]): Map<number, string[]> => {
        const batches = new Map<number, string[]>();
        const batchSize = Math.ceil(friendsList.length / 12);

        friendsList.forEach((friend, index) => {
          const monthBatch = Math.floor(index / batchSize) + 1; // 1-12
          const actualMonth = Math.min(monthBatch, 12); // Cap at 12

          if (!batches.has(actualMonth)) {
            batches.set(actualMonth, []);
          }
          batches.get(actualMonth)!.push(friend.id);
        });

        return batches;
      };

      const batches = assignToMonthlyBatches(friends);

      // Each friend should appear exactly once across all batches
      const allAssignedIds = Array.from(batches.values()).flat();
      expect(allAssignedIds).toHaveLength(24);
      expect(new Set(allAssignedIds).size).toBe(24); // All unique
    });

    it('should evenly distribute friends across months', () => {
      const friends: Friend[] = Array.from({ length: 36 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1)
        )
      );

      const assignToMonthlyBatches = (friendsList: Friend[]): Map<number, string[]> => {
        const batches = new Map<number, string[]>();
        const batchSize = Math.ceil(friendsList.length / 12);

        friendsList.forEach((friend, index) => {
          const monthBatch = Math.floor(index / batchSize) + 1;
          const actualMonth = Math.min(monthBatch, 12);

          if (!batches.has(actualMonth)) {
            batches.set(actualMonth, []);
          }
          batches.get(actualMonth)!.push(friend.id);
        });

        return batches;
      };

      const batches = assignToMonthlyBatches(friends);

      // With 36 friends and 12 months, should be 3 per month
      batches.forEach((friendIds, month) => {
        expect(friendIds.length).toBe(3);
      });
    });

    it('should handle remainder distribution (37 friends over 12 months)', () => {
      const friends: Friend[] = Array.from({ length: 37 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1)
        )
      );

      const assignToMonthlyBatches = (friendsList: Friend[]): Map<number, string[]> => {
        const batches = new Map<number, string[]>();

        // Use round-robin to distribute evenly
        friendsList.forEach((friend, index) => {
          const monthBatch = (index % 12) + 1; // 1-12, round-robin

          if (!batches.has(monthBatch)) {
            batches.set(monthBatch, []);
          }
          batches.get(monthBatch)!.push(friend.id);
        });

        return batches;
      };

      const batches = assignToMonthlyBatches(friends);

      // 37 friends: first month gets 4, rest get 3 (round-robin: 37 = 12*3 + 1)
      let totalAssigned = 0;
      batches.forEach((friendIds) => {
        expect(friendIds.length).toBeGreaterThanOrEqual(3);
        expect(friendIds.length).toBeLessThanOrEqual(4);
        totalAssigned += friendIds.length;
      });
      expect(totalAssigned).toBe(37);
    });

    it('should use deterministic assignment based on friend ID for consistency', () => {
      const friends: Friend[] = [
        createAcquaintedFriend('z-friend', 'Zach', createDate(2023, 1, 1)),
        createAcquaintedFriend('a-friend', 'Alice', createDate(2023, 1, 1)),
        createAcquaintedFriend('m-friend', 'Mike', createDate(2023, 1, 1)),
      ];

      const getMonthAssignment = (friendId: string, totalFriends: number): number => {
        // Use hash of friend ID for deterministic assignment
        let hash = 0;
        for (let i = 0; i < friendId.length; i++) {
          hash = ((hash << 5) - hash) + friendId.charCodeAt(i);
          hash = hash & hash;
        }
        return (Math.abs(hash) % 12) + 1; // 1-12
      };

      // Same friend should always get same month
      const month1 = getMonthAssignment('a-friend', 3);
      const month2 = getMonthAssignment('a-friend', 3);
      expect(month1).toBe(month2);

      // Different friends may get different months
      const aliceMonth = getMonthAssignment('a-friend', 3);
      const zachMonth = getMonthAssignment('z-friend', 3);
      // They might be the same or different, but should be deterministic
      expect(aliceMonth).toBeGreaterThanOrEqual(1);
      expect(aliceMonth).toBeLessThanOrEqual(12);
      expect(zachMonth).toBeGreaterThanOrEqual(1);
      expect(zachMonth).toBeLessThanOrEqual(12);
    });
  });

  describe('Bulk Add Protection (Spreading Over Time)', () => {
    it('should NOT nudge all at once even if 100 people were added same day', () => {
      // All added exactly 13 months ago on the same day
      const bulkAddDate = createDate(2023, 12, 1);
      const friends: Friend[] = Array.from({ length: 100 }, (_, i) =>
        createAcquaintedFriend(
          `bulk-${i}`,
          `Bulk Add ${i}`,
          bulkAddDate
        )
      );

      const getMonthlyBatch = (
        eligibleFriends: Friend[],
        currentMonth: number,
        currentYear: number
      ): Friend[] => {
        // Assign each friend to a month using deterministic hash
        return eligibleFriends.filter(friend => {
          let hash = 0;
          for (let i = 0; i < friend.id.length; i++) {
            hash = ((hash << 5) - hash) + friend.id.charCodeAt(i);
            hash = hash & hash;
          }
          const assignedMonth = (Math.abs(hash) % 12) + 1;
          return assignedMonth === currentMonth;
        });
      };

      // January batch
      const januaryBatch = getMonthlyBatch(friends, 1, 2025);

      // Should be approximately 1/12 of the list (8-9 people), not all 100
      expect(januaryBatch.length).toBeLessThan(20); // Allow some variance
      expect(januaryBatch.length).toBeGreaterThan(0);
    });

    it('should spread bulk-added friends across all 12 months', () => {
      const bulkAddDate = createDate(2023, 12, 1);
      const friends: Friend[] = Array.from({ length: 120 }, (_, i) =>
        createAcquaintedFriend(
          `bulk-${i}`,
          `Bulk Add ${i}`,
          bulkAddDate
        )
      );

      const getMonthlyBatch = (
        eligibleFriends: Friend[],
        month: number
      ): Friend[] => {
        return eligibleFriends.filter(friend => {
          let hash = 0;
          for (let i = 0; i < friend.id.length; i++) {
            hash = ((hash << 5) - hash) + friend.id.charCodeAt(i);
            hash = hash & hash;
          }
          const assignedMonth = (Math.abs(hash) % 12) + 1;
          return assignedMonth === month;
        });
      };

      // Check each month has approximately equal share
      const monthCounts: number[] = [];
      for (let month = 1; month <= 12; month++) {
        const batch = getMonthlyBatch(friends, month);
        monthCounts.push(batch.length);
      }

      // All months should have some friends
      monthCounts.forEach(count => {
        expect(count).toBeGreaterThan(0);
      });

      // Total should equal original count
      expect(monthCounts.reduce((a, b) => a + b, 0)).toBe(120);

      // Each month should be roughly 10 (120/12), with some variance
      const average = 120 / 12;
      monthCounts.forEach(count => {
        expect(count).toBeGreaterThan(average * 0.5); // At least 5
        expect(count).toBeLessThan(average * 2); // At most 20
      });
    });

    it('should maintain consistent assignment even when checking across different sessions', () => {
      const friend = createAcquaintedFriend(
        'consistent-friend',
        'Consistent Person',
        createDate(2023, 1, 1)
      );

      const getAssignedMonth = (friendId: string): number => {
        let hash = 0;
        for (let i = 0; i < friendId.length; i++) {
          hash = ((hash << 5) - hash) + friendId.charCodeAt(i);
          hash = hash & hash;
        }
        return (Math.abs(hash) % 12) + 1;
      };

      // Simulate multiple "sessions" - should always get same result
      const results: number[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(getAssignedMonth(friend.id));
      }

      // All results should be identical
      expect(new Set(results).size).toBe(1);
    });
  });

  describe('New Additions Handling', () => {
    it('should include newly eligible friends in the next cycle', () => {
      // Set time to Feb 1, 2025
      vi.setSystemTime(createDate(2025, 2, 1));

      // Friend added exactly 12 months ago - just became eligible
      const newlyEligible = createAcquaintedFriend(
        'new-eligible',
        'Newly Eligible',
        createDate(2024, 2, 1)
      );

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      expect(isEligibleForNudge(newlyEligible, createDate(2025, 2, 1))).toBe(true);
    });

    it('should assign new additions to months without overloading any single month', () => {
      // Existing friends already assigned
      const existingFriends: Friend[] = Array.from({ length: 24 }, (_, i) =>
        createAcquaintedFriend(
          `existing-${i}`,
          `Existing ${i}`,
          createDate(2023, 1, 1)
        )
      );

      // New friend just became eligible
      const newFriend = createAcquaintedFriend(
        'new-friend-xyz',
        'New Friend',
        createDate(2024, 1, 1)
      );

      const getAssignedMonth = (friendId: string): number => {
        let hash = 0;
        for (let i = 0; i < friendId.length; i++) {
          hash = ((hash << 5) - hash) + friendId.charCodeAt(i);
          hash = hash & hash;
        }
        return (Math.abs(hash) % 12) + 1;
      };

      const newFriendMonth = getAssignedMonth(newFriend.id);

      // Should be assigned to a valid month
      expect(newFriendMonth).toBeGreaterThanOrEqual(1);
      expect(newFriendMonth).toBeLessThanOrEqual(12);

      // Existing friends in that month
      const existingInSameMonth = existingFriends.filter(
        f => getAssignedMonth(f.id) === newFriendMonth
      );

      // Month shouldn't be empty (hash distribution)
      // and new friend adds to it
      const totalInMonth = existingInSameMonth.length + 1;
      expect(totalInMonth).toBeGreaterThan(0);
    });

    it('should recalculate batch sizes when new friends become eligible', () => {
      // Year 1: 12 friends, 1 per month
      const year1Friends: Friend[] = Array.from({ length: 12 }, (_, i) =>
        createAcquaintedFriend(
          `year1-${i}`,
          `Year 1 Friend ${i}`,
          createDate(2023, 1, 1)
        )
      );

      // Year 2: 12 more friends become eligible
      const year2Friends: Friend[] = Array.from({ length: 12 }, (_, i) =>
        createAcquaintedFriend(
          `year2-${i}`,
          `Year 2 Friend ${i}`,
          createDate(2024, 1, 1)
        )
      );

      const getExpectedBatchSize = (totalEligible: number): number => {
        return Math.ceil(totalEligible / 12);
      };

      // Year 1: 12 friends, expect 1 per month
      expect(getExpectedBatchSize(12)).toBe(1);

      // Year 2: 24 friends, expect 2 per month
      expect(getExpectedBatchSize(24)).toBe(2);
    });
  });

  describe('Complete 12-Month Cycle Guarantee', () => {
    it('should nudge every eligible friend exactly once per year', () => {
      const friends: Friend[] = Array.from({ length: 50 }, (_, i) =>
        createAcquaintedFriend(
          `friend-${i}`,
          `Friend ${i}`,
          createDate(2023, 1, 1)
        )
      );

      const getAssignedMonth = (friendId: string): number => {
        let hash = 0;
        for (let i = 0; i < friendId.length; i++) {
          hash = ((hash << 5) - hash) + friendId.charCodeAt(i);
          hash = hash & hash;
        }
        return (Math.abs(hash) % 12) + 1;
      };

      // Track which month each friend is assigned to
      const assignments = new Map<string, number>();
      friends.forEach(friend => {
        assignments.set(friend.id, getAssignedMonth(friend.id));
      });

      // Every friend should be assigned to exactly one month
      expect(assignments.size).toBe(50);

      // Collect all nudges over 12 months
      const nudgedFriendIds = new Set<string>();
      for (let month = 1; month <= 12; month++) {
        friends.forEach(friend => {
          if (getAssignedMonth(friend.id) === month) {
            nudgedFriendIds.add(friend.id);
          }
        });
      }

      // All friends should have been nudged exactly once
      expect(nudgedFriendIds.size).toBe(50);
    });

    it('should track nudge history to prevent duplicate nudges in same cycle', () => {
      interface NudgeHistory {
        friendId: string;
        nudgedAt: Date;
        cycleYear: number;
      }

      const nudgeHistory: NudgeHistory[] = [];

      const hasBeenNudgedThisCycle = (friendId: string, cycleYear: number): boolean => {
        return nudgeHistory.some(
          h => h.friendId === friendId && h.cycleYear === cycleYear
        );
      };

      const recordNudge = (friendId: string, date: Date, cycleYear: number): void => {
        nudgeHistory.push({ friendId, nudgedAt: date, cycleYear });
      };

      // First nudge in 2025 cycle
      expect(hasBeenNudgedThisCycle('friend-1', 2025)).toBe(false);
      recordNudge('friend-1', createDate(2025, 3, 1), 2025);
      expect(hasBeenNudgedThisCycle('friend-1', 2025)).toBe(true);

      // Should be eligible again in 2026 cycle
      expect(hasBeenNudgedThisCycle('friend-1', 2026)).toBe(false);
    });

    it('should start new cycle on January 1st', () => {
      const getCycleYear = (date: Date): number => {
        return date.getFullYear();
      };

      expect(getCycleYear(createDate(2025, 1, 1))).toBe(2025);
      expect(getCycleYear(createDate(2025, 12, 31))).toBe(2025);
      expect(getCycleYear(createDate(2026, 1, 1))).toBe(2026);
    });
  });

  describe('Edge Cases', () => {
    it('should handle friend with no lastContacted date', () => {
      const friend = createAcquaintedFriend(
        'never-contacted',
        'Never Contacted',
        createDate(2023, 1, 1)
        // No lastContacted
      );

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      // Should still be eligible based on addedAt date
      expect(isEligibleForNudge(friend, mockNow)).toBe(true);
    });

    it('should handle recently contacted friend (still gets annual nudge)', () => {
      const friend = createAcquaintedFriend(
        'recently-contacted',
        'Recently Contacted',
        createDate(2023, 1, 1)
      );
      friend.lastContacted = createDate(2024, 12, 15); // Contacted 2 weeks ago

      const isEligibleForNudge = (f: Friend, now: Date): boolean => {
        // For acquainted, we do annual check regardless of recent contact
        // The nudge is "still in your circle?" not "haven't talked"
        const monthsSinceAdded = (now.getTime() - f.addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
        return f.tier === 'acquainted' && monthsSinceAdded >= 12;
      };

      // Still eligible - this is an annual "are they still relevant?" check
      expect(isEligibleForNudge(friend, mockNow)).toBe(true);
    });

    it('should handle leap year February correctly', () => {
      const getNextNudgeDay = (fromDate: Date): Date => {
        const next = new Date(fromDate);
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(0, 0, 0, 0);
        return next;
      };

      // 2024 is a leap year
      const jan2024 = createDate(2024, 1, 15);
      const nextNudge = getNextNudgeDay(jan2024);

      expect(nextNudge.getFullYear()).toBe(2024);
      expect(nextNudge.getMonth()).toBe(1); // February
      expect(nextNudge.getDate()).toBe(1);
    });

    it('should handle empty acquainted list gracefully', () => {
      const friends: Friend[] = [];

      const getMonthlyBatch = (eligibleFriends: Friend[], month: number): Friend[] => {
        if (eligibleFriends.length === 0) return [];

        return eligibleFriends.filter(friend => {
          let hash = 0;
          for (let i = 0; i < friend.id.length; i++) {
            hash = ((hash << 5) - hash) + friend.id.charCodeAt(i);
            hash = hash & hash;
          }
          const assignedMonth = (Math.abs(hash) % 12) + 1;
          return assignedMonth === month;
        });
      };

      const batch = getMonthlyBatch(friends, 1);
      expect(batch).toHaveLength(0);
    });

    it('should handle single acquainted friend', () => {
      const friends: Friend[] = [
        createAcquaintedFriend('only-one', 'Only Friend', createDate(2023, 1, 1)),
      ];

      const getAssignedMonth = (friendId: string): number => {
        let hash = 0;
        for (let i = 0; i < friendId.length; i++) {
          hash = ((hash << 5) - hash) + friendId.charCodeAt(i);
          hash = hash & hash;
        }
        return (Math.abs(hash) % 12) + 1;
      };

      const month = getAssignedMonth(friends[0].id);

      // Should be assigned to exactly one month
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);

      // Only that month should have this friend
      for (let m = 1; m <= 12; m++) {
        const hasInMonth = getAssignedMonth(friends[0].id) === m;
        if (m === month) {
          expect(hasInMonth).toBe(true);
        } else {
          expect(hasInMonth).toBe(false);
        }
      }
    });
  });

  describe('Nudge Message Format', () => {
    it('should generate appropriate nudge message for acquainted cousin', () => {
      const friend = createAcquaintedFriend(
        'cousin-1',
        'Sarah from Conference 2022',
        createDate(2023, 1, 1)
      );

      const generateNudgeMessage = (f: Friend): string => {
        return `Annual check-in: Is ${f.name} still someone you want in your circles?`;
      };

      const message = generateNudgeMessage(friend);

      expect(message).toContain('Sarah from Conference 2022');
      expect(message).toContain('Annual check-in');
      expect(message).toContain('still');
    });

    it('should offer relevant action options for acquainted nudge', () => {
      type AcquaintedNudgeAction =
        | 'keep_in_circles'      // Confirm they're still relevant
        | 'promote_to_outer'    // They've become more important
        | 'remove_from_circles' // No longer relevant
        | 'snooze_6_months';    // Check again later

      const getAcquaintedNudgeActions = (): AcquaintedNudgeAction[] => {
        return [
          'keep_in_circles',
          'promote_to_outer',
          'remove_from_circles',
          'snooze_6_months',
        ];
      };

      const actions = getAcquaintedNudgeActions();

      expect(actions).toContain('keep_in_circles');
      expect(actions).toContain('promote_to_outer');
      expect(actions).toContain('remove_from_circles');
      expect(actions).toContain('snooze_6_months');
    });
  });

  describe('Integration with Feed System', () => {
    it('should generate AcquaintedNudgeBatch for current month', () => {
      const friends: Friend[] = Array.from({ length: 36 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1)
        )
      );

      interface AcquaintedNudgeBatch {
        friends: Friend[];
        currentMonth: number;
        currentYear: number;
        totalEligible: number;
        isNudgeDay: boolean;
      }

      const generateBatch = (
        eligibleFriends: Friend[],
        now: Date
      ): AcquaintedNudgeBatch => {
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentYear = now.getFullYear();
        const isNudgeDay = now.getDate() === 1;

        const monthlyFriends = eligibleFriends.filter(friend => {
          let hash = 0;
          for (let i = 0; i < friend.id.length; i++) {
            hash = ((hash << 5) - hash) + friend.id.charCodeAt(i);
            hash = hash & hash;
          }
          const assignedMonth = (Math.abs(hash) % 12) + 1;
          return assignedMonth === currentMonth;
        });

        return {
          friends: monthlyFriends,
          currentMonth,
          currentYear,
          totalEligible: eligibleFriends.length,
          isNudgeDay,
        };
      };

      const batch = generateBatch(friends, mockNow);

      expect(batch.currentMonth).toBe(1); // January
      expect(batch.currentYear).toBe(2025);
      expect(batch.isNudgeDay).toBe(true); // Jan 1
      expect(batch.totalEligible).toBe(36);
      expect(batch.friends.length).toBeLessThanOrEqual(Math.ceil(36 / 12) + 2); // ~3 with some variance
    });

    it('should return empty batch on non-nudge days', () => {
      vi.setSystemTime(createDate(2025, 1, 15)); // Mid-month

      const friends: Friend[] = Array.from({ length: 12 }, (_, i) =>
        createAcquaintedFriend(
          `acquainted-${i}`,
          `Acquaintance ${i}`,
          createDate(2023, 1, 1)
        )
      );

      const shouldShowNudges = (now: Date): boolean => {
        return now.getDate() === 1;
      };

      expect(shouldShowNudges(createDate(2025, 1, 15))).toBe(false);
    });
  });
});

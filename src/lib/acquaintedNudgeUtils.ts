import { Friend } from '@/types/friend';
import {
  ACQUAINTED_NUDGE_CONFIG,
  AcquaintedNudgeBatch,
  AcquaintedNudgeAction,
} from '@/types/feed';

// ============================================================================
// Eligibility
// ============================================================================

/**
 * Calculate months since a friend was added
 */
export function getMonthsSinceAdded(addedAt: Date, now: Date = new Date()): number {
  return (now.getTime() - addedAt.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
}

/**
 * Check if an acquainted cousin is eligible for nudging
 * Must be in circles for at least 12 months
 */
export function isEligibleForAcquaintedNudge(friend: Friend, now: Date = new Date()): boolean {
  if (friend.tier !== 'acquainted') return false;
  const monthsSinceAdded = getMonthsSinceAdded(friend.addedAt, now);
  return monthsSinceAdded >= ACQUAINTED_NUDGE_CONFIG.minimumAgeMonths;
}

/**
 * Get all eligible acquainted cousins from a list
 */
export function getEligibleAcquaintedCousins(friends: Friend[], now: Date = new Date()): Friend[] {
  return friends.filter(f => isEligibleForAcquaintedNudge(f, now));
}

// ============================================================================
// Monthly Timing
// ============================================================================

/**
 * Check if today is a nudge day (1st of the month)
 */
export function isAcquaintedNudgeDay(date: Date = new Date()): boolean {
  return date.getDate() === ACQUAINTED_NUDGE_CONFIG.nudgeDayOfMonth;
}

/**
 * Get the next nudge day from a given date
 */
export function getNextAcquaintedNudgeDay(fromDate: Date = new Date()): Date {
  const next = new Date(fromDate);
  // Set to day 1 first to avoid month overflow issues
  next.setDate(1);
  next.setMonth(next.getMonth() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * Get the current cycle year (calendar year)
 */
export function getCycleYear(date: Date = new Date()): number {
  return date.getFullYear();
}

// ============================================================================
// Batch Size Calculation
// ============================================================================

/**
 * Calculate the monthly batch size (approximately 1/12 of eligible)
 */
export function getMonthlyBatchSize(totalEligible: number): number {
  if (totalEligible === 0) return 0;
  return Math.max(1, Math.ceil(totalEligible / ACQUAINTED_NUDGE_CONFIG.monthlyBatchFraction));
}

// ============================================================================
// Deterministic Month Assignment (using hash)
// ============================================================================

/**
 * Generate a deterministic hash from a string
 * This ensures the same friend always gets the same month assignment
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get the assigned month (1-12) for a friend based on their ID
 * This is deterministic - same ID always gets same month
 */
export function getAssignedMonth(friendId: string): number {
  const hash = hashString(friendId);
  return (hash % 12) + 1; // 1-12
}

/**
 * Get friends assigned to a specific month
 */
export function getFriendsForMonth(friends: Friend[], month: number): Friend[] {
  return friends.filter(friend => getAssignedMonth(friend.id) === month);
}

// ============================================================================
// Monthly Batch Assignment
// ============================================================================

/**
 * Assign all eligible friends to monthly batches using deterministic hash
 * Returns a Map of month (1-12) to friend IDs
 */
export function assignToMonthlyBatches(friends: Friend[]): Map<number, string[]> {
  const batches = new Map<number, string[]>();

  // Initialize all months
  for (let month = 1; month <= 12; month++) {
    batches.set(month, []);
  }

  // Assign each friend to their month
  friends.forEach(friend => {
    const month = getAssignedMonth(friend.id);
    batches.get(month)!.push(friend.id);
  });

  return batches;
}

/**
 * Get the monthly batch for the current month
 */
export function getMonthlyBatch(
  eligibleFriends: Friend[],
  now: Date = new Date()
): AcquaintedNudgeBatch {
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();
  const isNudgeDay = isAcquaintedNudgeDay(now);

  // Get friends assigned to this month
  const monthlyFriends = getFriendsForMonth(eligibleFriends, currentMonth);

  return {
    friends: monthlyFriends.map(f => ({
      id: f.id,
      name: f.name,
      addedAt: f.addedAt,
      lastContacted: f.lastContacted,
    })),
    currentMonth,
    currentYear,
    totalEligible: eligibleFriends.length,
    isNudgeDay,
  };
}

// ============================================================================
// Nudge History Tracking
// ============================================================================

export interface AcquaintedNudgeHistoryEntry {
  friendId: string;
  nudgedAt: Date;
  cycleYear: number;
  action?: AcquaintedNudgeAction;
  actionTakenAt?: Date;
}

/**
 * Check if a friend has been nudged in the current cycle year
 */
export function hasBeenNudgedThisCycle(
  friendId: string,
  cycleYear: number,
  history: AcquaintedNudgeHistoryEntry[]
): boolean {
  return history.some(h => h.friendId === friendId && h.cycleYear === cycleYear);
}

/**
 * Record a nudge in the history
 */
export function createNudgeHistoryEntry(
  friendId: string,
  cycleYear: number
): AcquaintedNudgeHistoryEntry {
  return {
    friendId,
    nudgedAt: new Date(),
    cycleYear,
  };
}

/**
 * Update nudge history with the action taken
 */
export function recordNudgeAction(
  entry: AcquaintedNudgeHistoryEntry,
  action: AcquaintedNudgeAction
): AcquaintedNudgeHistoryEntry {
  return {
    ...entry,
    action,
    actionTakenAt: new Date(),
  };
}

// ============================================================================
// Nudge Messages & Actions
// ============================================================================

/**
 * Generate the nudge message for an acquainted cousin
 */
export function generateAcquaintedNudgeMessage(friendName: string): string {
  return `Annual check-in: Is ${friendName} still someone you want in your circles?`;
}

/**
 * Get available actions for an acquainted nudge
 */
export function getAcquaintedNudgeActions(): AcquaintedNudgeAction[] {
  return [
    'keep_in_circles',
    'promote_to_outer',
    'remove_from_circles',
    'snooze_6_months',
  ];
}

/**
 * Get human-readable label for an action
 */
export function getActionLabel(action: AcquaintedNudgeAction): string {
  switch (action) {
    case 'keep_in_circles':
      return 'Keep in circles';
    case 'promote_to_outer':
      return 'Promote to Outer circle';
    case 'remove_from_circles':
      return 'Remove from circles';
    case 'snooze_6_months':
      return 'Ask me again in 6 months';
  }
}

// ============================================================================
// Complete Batch Generation
// ============================================================================

/**
 * Generate the complete acquainted nudge batch for display
 * This is the main function to call when showing nudges
 */
export function generateAcquaintedNudgeBatch(
  allFriends: Friend[],
  nudgeHistory: AcquaintedNudgeHistoryEntry[],
  now: Date = new Date()
): AcquaintedNudgeBatch & { shouldShow: boolean } {
  // Only show on nudge day
  if (!isAcquaintedNudgeDay(now)) {
    return {
      friends: [],
      currentMonth: now.getMonth() + 1,
      currentYear: now.getFullYear(),
      totalEligible: 0,
      isNudgeDay: false,
      shouldShow: false,
    };
  }

  const cycleYear = getCycleYear(now);

  // Get eligible friends
  const eligible = getEligibleAcquaintedCousins(allFriends, now);

  // Get this month's batch
  const batch = getMonthlyBatch(eligible, now);

  // Filter out friends already nudged this cycle
  const notYetNudged = batch.friends.filter(
    f => !hasBeenNudgedThisCycle(f.id, cycleYear, nudgeHistory)
  );

  return {
    ...batch,
    friends: notYetNudged,
    shouldShow: notYetNudged.length > 0,
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate import data - check that tiers are valid
 */
export function validateAcquaintedFriends(
  friends: Array<{ tier: string }>
): { valid: boolean; invalidCount: number } {
  const validTiers = ['core', 'inner', 'outer', 'naybor', 'parasocial', 'rolemodel', 'acquainted'];
  const invalidFriends = friends.filter(f => !validTiers.includes(f.tier));

  return {
    valid: invalidFriends.length === 0,
    invalidCount: invalidFriends.length,
  };
}

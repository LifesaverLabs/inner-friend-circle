import { ContactMethod } from '@/types/friend';

const STORAGE_KEY = 'contact-method-warning-suppressions';

interface WarningSuppression {
  method: ContactMethod;
  suppressedUntil: number; // Unix timestamp in milliseconds
}

interface SuppressionStorage {
  suppressions: WarningSuppression[];
}

/**
 * Get the start of the next month as a timestamp.
 * Warnings are suppressed until the 1st of the next month.
 */
function getNextMonthStart(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  return nextMonth.getTime();
}

/**
 * Load suppression data from localStorage
 */
function loadSuppressions(): SuppressionStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { suppressions: [] };
    }
    return JSON.parse(stored) as SuppressionStorage;
  } catch {
    return { suppressions: [] };
  }
}

/**
 * Save suppression data to localStorage
 */
function saveSuppressions(data: SuppressionStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors (e.g., quota exceeded, private browsing)
  }
}

/**
 * Clean up expired suppressions
 */
function cleanupExpiredSuppressions(data: SuppressionStorage): SuppressionStorage {
  const now = Date.now();
  return {
    suppressions: data.suppressions.filter(s => s.suppressedUntil > now),
  };
}

/**
 * Check if a warning for a contact method is currently suppressed.
 * Returns true if the warning should NOT be shown.
 */
export function isWarningSuppressed(method: ContactMethod): boolean {
  const data = cleanupExpiredSuppressions(loadSuppressions());
  const now = Date.now();

  const suppression = data.suppressions.find(s => s.method === method);
  return suppression !== undefined && suppression.suppressedUntil > now;
}

/**
 * Suppress warnings for a contact method until the start of next month.
 * Users can only silence warnings for up to a month at a time.
 */
export function suppressWarningUntilNextMonth(method: ContactMethod): void {
  const data = cleanupExpiredSuppressions(loadSuppressions());

  // Remove any existing suppression for this method
  const filtered = data.suppressions.filter(s => s.method !== method);

  // Add new suppression until next month
  filtered.push({
    method,
    suppressedUntil: getNextMonthStart(),
  });

  saveSuppressions({ suppressions: filtered });
}

/**
 * Get the date when a suppression will expire for a given method.
 * Returns null if no suppression is active.
 */
export function getSuppressionExpiry(method: ContactMethod): Date | null {
  const data = loadSuppressions();
  const suppression = data.suppressions.find(s => s.method === method);

  if (!suppression || suppression.suppressedUntil <= Date.now()) {
    return null;
  }

  return new Date(suppression.suppressedUntil);
}

/**
 * Clear suppression for a specific method (show warnings again immediately)
 */
export function clearSuppression(method: ContactMethod): void {
  const data = loadSuppressions();
  saveSuppressions({
    suppressions: data.suppressions.filter(s => s.method !== method),
  });
}

/**
 * Clear all suppressions (show all warnings again)
 */
export function clearAllSuppressions(): void {
  saveSuppressions({ suppressions: [] });
}

/**
 * Get methods that have warnings and are subject to suppression.
 * Useful for settings UI.
 */
export const SUPPRESSIBLE_METHODS: ContactMethod[] = ['wechat', 'vk', 'max'];

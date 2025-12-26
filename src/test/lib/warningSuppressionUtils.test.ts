import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  isWarningSuppressed,
  suppressWarningUntilNextMonth,
  getSuppressionExpiry,
  clearSuppression,
  clearAllSuppressions,
  SUPPRESSIBLE_METHODS,
} from '@/lib/warningSuppressionUtils';

describe('warningSuppressionUtils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset any date mocks
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isWarningSuppressed', () => {
    it('should return false when no suppression exists', () => {
      expect(isWarningSuppressed('wechat')).toBe(false);
      expect(isWarningSuppressed('vk')).toBe(false);
      expect(isWarningSuppressed('max')).toBe(false);
    });

    it('should return true when suppression is active', () => {
      suppressWarningUntilNextMonth('wechat');
      expect(isWarningSuppressed('wechat')).toBe(true);
    });

    it('should return false for other methods when only one is suppressed', () => {
      suppressWarningUntilNextMonth('wechat');
      expect(isWarningSuppressed('wechat')).toBe(true);
      expect(isWarningSuppressed('vk')).toBe(false);
      expect(isWarningSuppressed('max')).toBe(false);
    });

    it('should return false when suppression has expired', () => {
      // Set time to mid-month
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 5, 15)); // June 15, 2025

      suppressWarningUntilNextMonth('wechat');
      expect(isWarningSuppressed('wechat')).toBe(true);

      // Move to next month
      vi.setSystemTime(new Date(2025, 6, 2)); // July 2, 2025
      expect(isWarningSuppressed('wechat')).toBe(false);
    });

    it('should handle multiple suppressions', () => {
      suppressWarningUntilNextMonth('wechat');
      suppressWarningUntilNextMonth('vk');

      expect(isWarningSuppressed('wechat')).toBe(true);
      expect(isWarningSuppressed('vk')).toBe(true);
      expect(isWarningSuppressed('max')).toBe(false);
    });
  });

  describe('suppressWarningUntilNextMonth', () => {
    it('should suppress warning until the 1st of next month', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 5, 15)); // June 15, 2025

      suppressWarningUntilNextMonth('wechat');
      const expiry = getSuppressionExpiry('wechat');

      expect(expiry).not.toBeNull();
      expect(expiry!.getFullYear()).toBe(2025);
      expect(expiry!.getMonth()).toBe(6); // July (0-indexed)
      expect(expiry!.getDate()).toBe(1);
    });

    it('should handle end of year correctly', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 11, 15)); // December 15, 2025

      suppressWarningUntilNextMonth('vk');
      const expiry = getSuppressionExpiry('vk');

      expect(expiry).not.toBeNull();
      expect(expiry!.getFullYear()).toBe(2026);
      expect(expiry!.getMonth()).toBe(0); // January
      expect(expiry!.getDate()).toBe(1);
    });

    it('should update existing suppression', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 5, 15)); // June 15, 2025

      suppressWarningUntilNextMonth('wechat');
      const firstExpiry = getSuppressionExpiry('wechat');

      // Move forward and suppress again
      vi.setSystemTime(new Date(2025, 6, 15)); // July 15, 2025
      suppressWarningUntilNextMonth('wechat');
      const secondExpiry = getSuppressionExpiry('wechat');

      expect(secondExpiry).not.toBeNull();
      expect(secondExpiry!.getMonth()).toBe(7); // August
      expect(secondExpiry!.getTime()).toBeGreaterThan(firstExpiry!.getTime());
    });
  });

  describe('getSuppressionExpiry', () => {
    it('should return null when no suppression exists', () => {
      expect(getSuppressionExpiry('wechat')).toBeNull();
    });

    it('should return null when suppression has expired', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 5, 15));

      suppressWarningUntilNextMonth('wechat');

      // Move past expiry
      vi.setSystemTime(new Date(2025, 6, 2));
      expect(getSuppressionExpiry('wechat')).toBeNull();
    });

    it('should return the expiry date when suppression is active', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 5, 15));

      suppressWarningUntilNextMonth('max');
      const expiry = getSuppressionExpiry('max');

      expect(expiry).not.toBeNull();
      expect(expiry).toBeInstanceOf(Date);
    });
  });

  describe('clearSuppression', () => {
    it('should clear suppression for a specific method', () => {
      suppressWarningUntilNextMonth('wechat');
      suppressWarningUntilNextMonth('vk');

      expect(isWarningSuppressed('wechat')).toBe(true);
      expect(isWarningSuppressed('vk')).toBe(true);

      clearSuppression('wechat');

      expect(isWarningSuppressed('wechat')).toBe(false);
      expect(isWarningSuppressed('vk')).toBe(true);
    });

    it('should handle clearing non-existent suppression', () => {
      expect(() => clearSuppression('wechat')).not.toThrow();
    });
  });

  describe('clearAllSuppressions', () => {
    it('should clear all suppressions', () => {
      suppressWarningUntilNextMonth('wechat');
      suppressWarningUntilNextMonth('vk');
      suppressWarningUntilNextMonth('max');

      expect(isWarningSuppressed('wechat')).toBe(true);
      expect(isWarningSuppressed('vk')).toBe(true);
      expect(isWarningSuppressed('max')).toBe(true);

      clearAllSuppressions();

      expect(isWarningSuppressed('wechat')).toBe(false);
      expect(isWarningSuppressed('vk')).toBe(false);
      expect(isWarningSuppressed('max')).toBe(false);
    });
  });

  describe('SUPPRESSIBLE_METHODS', () => {
    it('should include wechat, vk, and max', () => {
      expect(SUPPRESSIBLE_METHODS).toContain('wechat');
      expect(SUPPRESSIBLE_METHODS).toContain('vk');
      expect(SUPPRESSIBLE_METHODS).toContain('max');
    });

    it('should not include non-censored methods', () => {
      expect(SUPPRESSIBLE_METHODS).not.toContain('tel');
      expect(SUPPRESSIBLE_METHODS).not.toContain('facetime');
      expect(SUPPRESSIBLE_METHODS).not.toContain('whatsapp');
      expect(SUPPRESSIBLE_METHODS).not.toContain('signal');
      expect(SUPPRESSIBLE_METHODS).not.toContain('telegram');
    });
  });

  describe('localStorage error handling', () => {
    it('should handle localStorage being unavailable', () => {
      const originalGetItem = localStorage.getItem;
      const originalSetItem = localStorage.setItem;

      // Mock localStorage to throw errors
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      // Should not throw and return sensible defaults
      expect(() => isWarningSuppressed('wechat')).not.toThrow();
      expect(isWarningSuppressed('wechat')).toBe(false);
      expect(() => suppressWarningUntilNextMonth('wechat')).not.toThrow();

      // Restore
      vi.restoreAllMocks();
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('contact-method-warning-suppressions', 'not-valid-json');

      expect(() => isWarningSuppressed('wechat')).not.toThrow();
      expect(isWarningSuppressed('wechat')).toBe(false);
    });
  });
});

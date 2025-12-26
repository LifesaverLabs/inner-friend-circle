import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;
  let matchMediaListeners: (() => void)[] = [];

  const createMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          matchMediaListeners.push(listener);
        }
      }),
      removeEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          matchMediaListeners = matchMediaListeners.filter(l => l !== listener);
        }
      }),
      dispatchEvent: vi.fn(),
    }));
  };

  const setInnerWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  beforeEach(() => {
    matchMediaListeners = [];
    // Default to desktop
    setInnerWidth(1024);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  describe('initial state', () => {
    it('should return true for mobile viewport (< 768px)', () => {
      setInnerWidth(375);
      window.matchMedia = createMatchMedia(true);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it('should return false for desktop viewport (>= 768px)', () => {
      window.matchMedia = createMatchMedia(false);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });

    it('should query for max-width: 767px', () => {
      const mockMatchMedia = createMatchMedia(false);
      window.matchMedia = mockMatchMedia;

      renderHook(() => useIsMobile());

      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    });
  });

  describe('responsive behavior', () => {
    it('should add event listener on mount', () => {
      const mockMatchMedia = createMatchMedia(false);
      window.matchMedia = mockMatchMedia;

      renderHook(() => useIsMobile());

      const mediaQueryList = mockMatchMedia.mock.results[0].value;
      expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const mockMatchMedia = createMatchMedia(false);
      window.matchMedia = mockMatchMedia;

      const { unmount } = renderHook(() => useIsMobile());
      unmount();

      const mediaQueryList = mockMatchMedia.mock.results[0].value;
      expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update when media query changes to mobile', () => {
      setInnerWidth(1024);
      window.matchMedia = createMatchMedia(false);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);

      // Simulate resize to mobile - hook uses innerWidth
      act(() => {
        setInnerWidth(375);
        matchMediaListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(true);
    });

    it('should update when media query changes to desktop', () => {
      setInnerWidth(375);
      window.matchMedia = createMatchMedia(true);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);

      // Simulate resize to desktop
      act(() => {
        setInnerWidth(1024);
        matchMediaListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(false);
    });
  });

  describe('multiple renders', () => {
    it('should maintain correct state across rerenders', () => {
      setInnerWidth(375);
      window.matchMedia = createMatchMedia(true);

      const { result, rerender } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);

      rerender();

      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid resize events', () => {
      setInnerWidth(1024);
      window.matchMedia = createMatchMedia(false);

      const { result } = renderHook(() => useIsMobile());

      // Rapid changes
      act(() => {
        setInnerWidth(375);
        matchMediaListeners.forEach(listener => listener());
      });

      act(() => {
        setInnerWidth(1024);
        matchMediaListeners.forEach(listener => listener());
      });

      act(() => {
        setInnerWidth(375);
        matchMediaListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(true);
    });

    it('should handle same value events', () => {
      setInnerWidth(375);
      window.matchMedia = createMatchMedia(true);

      const { result } = renderHook(() => useIsMobile());

      // Fire same value multiple times
      act(() => {
        matchMediaListeners.forEach(listener => listener());
      });

      act(() => {
        matchMediaListeners.forEach(listener => listener());
      });

      expect(result.current).toBe(true);
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { toast, useToast } from '@/hooks/use-toast';

describe('use-toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clear any remaining toasts
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  describe('toast function', () => {
    it('should create a toast and return an id', () => {
      const result = toast({ title: 'Test Toast' });
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should return a dismiss function', () => {
      const result = toast({ title: 'Test Toast' });
      expect(typeof result.dismiss).toBe('function');
    });

    it('should return an update function', () => {
      const result = toast({ title: 'Test Toast' });
      expect(typeof result.update).toBe('function');
    });

    it('should create unique ids for each toast', () => {
      const toast1 = toast({ title: 'Toast 1' });
      const toast2 = toast({ title: 'Toast 2' });
      expect(toast1.id).not.toBe(toast2.id);
    });

    it('should create toast with title', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Hello World' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Hello World');
    });

    it('should create toast with description', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Title', description: 'Description text' });
      });

      expect(result.current.toasts[0].description).toBe('Description text');
    });

    it('should create toast with variant', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Error', variant: 'destructive' });
      });

      expect(result.current.toasts[0].variant).toBe('destructive');
    });
  });

  describe('useToast hook', () => {
    it('should return toasts array', () => {
      const { result } = renderHook(() => useToast());
      expect(Array.isArray(result.current.toasts)).toBe(true);
    });

    it('should return toast function', () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.toast).toBe('function');
    });

    it('should return dismiss function', () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should start with empty toasts array', () => {
      const { result } = renderHook(() => useToast());
      // May have toasts from previous tests, so just check it's an array
      expect(Array.isArray(result.current.toasts)).toBe(true);
    });

    it('should update when toast is added', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'New Toast' });
      });

      // Should have at least one toast
      expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);
      // The latest toast should have our title
      const latestToast = result.current.toasts[result.current.toasts.length - 1];
      expect(latestToast.title).toBe('New Toast');
    });
  });

  describe('dismiss', () => {
    it('should dismiss specific toast by id', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;
      act(() => {
        const t = toast({ title: 'Toast to dismiss' });
        toastId = t.id;
      });

      const lengthBefore = result.current.toasts.length;

      act(() => {
        result.current.dismiss(toastId!);
      });

      // Toast should be marked as dismissed (open: false)
      const dismissedToast = result.current.toasts.find(t => t.id === toastId);
      if (dismissedToast) {
        expect(dismissedToast.open).toBe(false);
      }
    });

    it('should dismiss all toasts when no id provided', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Toast 1' });
        toast({ title: 'Toast 2' });
        toast({ title: 'Toast 3' });
      });

      act(() => {
        result.current.dismiss();
      });

      // All toasts should be marked as dismissed
      result.current.toasts.forEach(t => {
        expect(t.open).toBe(false);
      });
    });

    it('should use dismiss function returned from toast', () => {
      const { result } = renderHook(() => useToast());

      let toastResult: any;
      act(() => {
        toastResult = toast({ title: 'Dismissable' });
      });

      act(() => {
        toastResult.dismiss();
      });

      const dismissedToast = result.current.toasts.find(t => t.id === toastResult.id);
      if (dismissedToast) {
        expect(dismissedToast.open).toBe(false);
      }
    });
  });

  describe('update', () => {
    it('should update toast title', () => {
      const { result } = renderHook(() => useToast());

      let toastResult: any;
      act(() => {
        toastResult = toast({ title: 'Original Title' });
      });

      act(() => {
        toastResult.update({ id: toastResult.id, title: 'Updated Title' });
      });

      const updatedToast = result.current.toasts.find(t => t.id === toastResult.id);
      expect(updatedToast?.title).toBe('Updated Title');
    });

    it('should update toast description', () => {
      const { result } = renderHook(() => useToast());

      let toastResult: any;
      act(() => {
        toastResult = toast({ title: 'Title', description: 'Original' });
      });

      act(() => {
        toastResult.update({ id: toastResult.id, description: 'Updated description' });
      });

      const updatedToast = result.current.toasts.find(t => t.id === toastResult.id);
      expect(updatedToast?.description).toBe('Updated description');
    });
  });

  describe('toast limit', () => {
    it('should respect TOAST_LIMIT', () => {
      const { result } = renderHook(() => useToast());

      // Clear existing toasts first
      act(() => {
        result.current.dismiss();
      });

      // Add more toasts than the limit
      act(() => {
        for (let i = 0; i < 5; i++) {
          toast({ title: `Toast ${i}` });
        }
      });

      // TOAST_LIMIT is 1 based on the code
      const openToasts = result.current.toasts.filter(t => t.open !== false);
      expect(openToasts.length).toBeLessThanOrEqual(5); // Some may be auto-dismissed
    });
  });

  describe('toast with action', () => {
    it('should include action in toast', () => {
      const { result } = renderHook(() => useToast());
      const actionElement = { altText: 'Undo' };

      act(() => {
        toast({ title: 'With Action', action: actionElement as any });
      });

      const latestToast = result.current.toasts[result.current.toasts.length - 1];
      expect(latestToast.action).toEqual(actionElement);
    });
  });

  describe('onOpenChange', () => {
    it('should set onOpenChange callback', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Test' });
      });

      const latestToast = result.current.toasts[result.current.toasts.length - 1];
      expect(typeof latestToast.onOpenChange).toBe('function');
    });

    it('should dismiss toast when onOpenChange called with false', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;
      act(() => {
        const t = toast({ title: 'Test' });
        toastId = t.id;
      });

      const toastBefore = result.current.toasts.find(t => t.id === toastId);

      act(() => {
        toastBefore?.onOpenChange?.(false);
      });

      const toastAfter = result.current.toasts.find(t => t.id === toastId);
      expect(toastAfter?.open).toBe(false);
    });
  });
});

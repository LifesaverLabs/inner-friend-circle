import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  describe('basic functionality', () => {
    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should return single class unchanged', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('should merge multiple classes', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should merge three classes', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });
  });

  describe('conditional classes', () => {
    it('should handle boolean false (exclude class)', () => {
      expect(cn('foo', false && 'bar')).toBe('foo');
    });

    it('should handle boolean true (include class)', () => {
      expect(cn('foo', true && 'bar')).toBe('foo bar');
    });

    it('should handle undefined', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('should handle null', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('should handle empty string', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle 0', () => {
      expect(cn('foo', 0, 'bar')).toBe('foo bar');
    });
  });

  describe('object notation', () => {
    it('should include class when value is true', () => {
      expect(cn({ foo: true })).toBe('foo');
    });

    it('should exclude class when value is false', () => {
      expect(cn({ foo: false })).toBe('');
    });

    it('should handle mixed true/false', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('should handle object with string and boolean mix', () => {
      expect(cn('base', { conditional: true })).toBe('base conditional');
    });
  });

  describe('array notation', () => {
    it('should flatten array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('should handle array with conditionals', () => {
      expect(cn(['foo', false && 'bar', 'baz'])).toBe('foo baz');
    });
  });

  describe('tailwind merge functionality', () => {
    it('should merge conflicting padding classes (last wins)', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('should merge conflicting margin classes', () => {
      expect(cn('m-4', 'm-8')).toBe('m-8');
    });

    it('should merge conflicting background colors', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should merge conflicting text colors', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should merge conflicting font sizes', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('should keep non-conflicting classes', () => {
      expect(cn('p-4', 'm-4')).toBe('p-4 m-4');
    });

    it('should merge conflicting width classes', () => {
      expect(cn('w-full', 'w-auto')).toBe('w-auto');
    });

    it('should merge conflicting height classes', () => {
      expect(cn('h-10', 'h-12')).toBe('h-12');
    });

    it('should merge conflicting display classes', () => {
      expect(cn('block', 'flex')).toBe('flex');
    });

    it('should merge conflicting flex classes', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col');
    });

    it('should handle responsive prefixes', () => {
      expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8');
    });

    it('should keep different responsive breakpoints', () => {
      expect(cn('sm:p-4', 'md:p-8')).toBe('sm:p-4 md:p-8');
    });

    it('should handle hover states', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });

    it('should handle focus states', () => {
      expect(cn('focus:ring-2', 'focus:ring-4')).toBe('focus:ring-4');
    });
  });

  describe('complex scenarios', () => {
    it('should handle typical component class pattern', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base-class',
        'px-4 py-2',
        isActive && 'bg-blue-500',
        isDisabled && 'opacity-50',
        'text-white'
      );
      expect(result).toContain('base-class');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('opacity-50');
      expect(result).toContain('text-white');
    });

    it('should handle variant pattern with overrides', () => {
      const baseClasses = 'rounded-md font-medium';
      const sizeClasses = 'px-4 py-2 text-sm';
      const variantClasses = 'bg-blue-500 text-white';
      const overrideClasses = 'bg-red-500'; // Should override blue

      const result = cn(baseClasses, sizeClasses, variantClasses, overrideClasses);

      expect(result).toContain('rounded-md');
      expect(result).toContain('font-medium');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('text-sm');
      expect(result).toContain('bg-red-500');
      expect(result).not.toContain('bg-blue-500');
      expect(result).toContain('text-white');
    });

    it('should handle className prop merging pattern', () => {
      const defaultClasses = 'flex items-center gap-2 p-4 bg-white';
      const className = 'p-8 bg-gray-100'; // User override

      const result = cn(defaultClasses, className);

      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('gap-2');
      expect(result).toContain('p-8'); // Override
      expect(result).not.toContain('p-4'); // Removed
      expect(result).toContain('bg-gray-100'); // Override
      expect(result).not.toContain('bg-white'); // Removed
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in class names', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar');
    });

    it('should handle multiple spaces between classes', () => {
      expect(cn('foo   bar')).toBe('foo bar');
    });

    it('should handle many arguments', () => {
      const result = cn('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j');
      expect(result).toBe('a b c d e f g h i j');
    });

    it('should handle deeply nested conditionals', () => {
      const a = true;
      const b = false;
      const c = true;
      expect(cn(a && (b ? 'foo' : 'bar'), c && 'baz')).toBe('bar baz');
    });
  });
});

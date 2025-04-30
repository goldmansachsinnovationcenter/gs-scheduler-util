import { cn } from '../utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', false && 'class2', null, undefined, 0, 'class3')).toBe('class1 class3');
    });

    it('should handle conditional classes', () => {
      const condition = true;
      expect(cn('base', condition && 'conditional')).toBe('base conditional');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle tailwind class merging', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    it('should handle object input from clsx/twMerge', () => {
      const result = cn({ 'bg-red-500': true, 'text-white': false });
      expect(result).toContain('bg-red-500');
      expect(result).not.toContain('text-white');
    });

    it('should handle array input', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle mixed inputs', () => {
      const result = cn('class1', ['class2', 'class3'], { 'class4': true, 'class5': false });
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
      expect(result).toContain('class4');
      expect(result).not.toContain('class5');
    });
  });
});

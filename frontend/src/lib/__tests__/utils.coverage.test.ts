import { cn } from '../utils';

describe('Utility Functions', () => {
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

    it('should handle object notation', () => {
      expect(cn('base', { 'conditional1': true, 'conditional2': false })).toBe('base conditional1');
    });

    it('should handle array notation', () => {
      expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2');
    });
  });
});

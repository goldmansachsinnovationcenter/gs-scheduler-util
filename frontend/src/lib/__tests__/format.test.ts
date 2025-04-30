import { formatDate, formatDateTime } from '../format';

describe('Format Functions', () => {
  describe('formatDate function', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-15T12:00:00Z');
      expect(formatDate(date)).toMatch(/Jan 15, 2023/);
    });

    it('should handle null date', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should handle undefined date', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('should handle string date', () => {
      expect(formatDate('2023-01-15T12:00:00Z')).toMatch(/Jan 15, 2023/);
    });
  });

  describe('formatDateTime function', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-01-15T12:00:00Z');
      expect(formatDateTime(date)).toMatch(/Jan 15, 2023, \d+:\d+ (AM|PM)/i);
    });

    it('should handle null date', () => {
      expect(formatDateTime(null)).toBe('');
    });

    it('should handle undefined date', () => {
      expect(formatDateTime(undefined)).toBe('');
    });

    it('should handle string date', () => {
      expect(formatDateTime('2023-01-15T12:00:00Z')).toMatch(/Jan 15, 2023, \d+:\d+ (AM|PM)/i);
    });
  });
});

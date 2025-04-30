import { getSuccessRateBadgeVariant } from '../badge-utils';

describe('Badge Utility Functions', () => {
  describe('getSuccessRateBadgeVariant function', () => {
    it('should return "success" for high success rate', () => {
      expect(getSuccessRateBadgeVariant(0.9)).toBe('success');
      expect(getSuccessRateBadgeVariant(0.8)).toBe('success');
    });

    it('should return "warning" for medium success rate', () => {
      expect(getSuccessRateBadgeVariant(0.7)).toBe('warning');
      expect(getSuccessRateBadgeVariant(0.5)).toBe('warning');
    });

    it('should return "destructive" for low success rate', () => {
      expect(getSuccessRateBadgeVariant(0.4)).toBe('destructive');
      expect(getSuccessRateBadgeVariant(0)).toBe('destructive');
    });

    it('should handle edge cases', () => {
      expect(getSuccessRateBadgeVariant(1)).toBe('success');
      expect(getSuccessRateBadgeVariant(0)).toBe('destructive');
    });

    it('should handle invalid inputs', () => {
      expect(getSuccessRateBadgeVariant(null)).toBe('destructive');
      expect(getSuccessRateBadgeVariant(undefined)).toBe('destructive');
      expect(getSuccessRateBadgeVariant(NaN)).toBe('destructive');
    });
  });
});

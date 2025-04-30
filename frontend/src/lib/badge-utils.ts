export function getSuccessRateBadgeVariant(successRate: number | null | undefined): string {
  if (successRate === null || successRate === undefined || isNaN(successRate)) {
    return 'destructive';
  }
  
  if (successRate >= 0.8) {
    return 'success';
  } else if (successRate >= 0.5) {
    return 'warning';
  } else {
    return 'destructive';
  }
}

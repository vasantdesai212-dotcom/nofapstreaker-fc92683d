/** Compute bounded progress percentage (0–100). */
export const getPercentage = (unlockedDays: number | null | undefined, goalDays = 30): number => {
  if (!unlockedDays || unlockedDays <= 0) return 0;
  return Math.min(100, Math.round((unlockedDays / goalDays) * 100));
};

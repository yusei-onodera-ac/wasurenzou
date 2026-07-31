export const FREE_BUBBLE_LIMIT = 30;

export function canAddBubble(currentCount: number, isPremium: boolean): boolean {
  if (isPremium) return true;
  return currentCount < FREE_BUBBLE_LIMIT;
}

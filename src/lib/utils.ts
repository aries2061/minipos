import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export function getDateRange(period: string): { from: Date; to: Date } {
  const now = new Date();
  switch (period) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) };
    case 'weekly':
      return { from: startOfWeek(now), to: endOfWeek(now) };
    case 'monthly':
      return { from: startOfMonth(now), to: endOfMonth(now) };
    case 'yearly':
      return { from: startOfYear(now), to: endOfYear(now) };
    default:
      return { from: startOfDay(now), to: endOfDay(now) };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateSKU(): string {
  return `SKU-${Date.now().toString(36).toUpperCase()}`;
}

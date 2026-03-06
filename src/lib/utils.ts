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

const currencyLocaleMap: Record<string, { locale: string; currency: string }> = {
  USD: { locale: 'en-US', currency: 'USD' },
  MMK: { locale: 'my-MM', currency: 'MMK' },
  THB: { locale: 'th-TH', currency: 'THB' },
};

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const config = currencyLocaleMap[currency] || currencyLocaleMap.USD;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
}

export function generateSKU(): string {
  return `SKU-${Date.now().toString(36).toUpperCase()}`;
}

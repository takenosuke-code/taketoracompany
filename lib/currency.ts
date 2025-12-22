// Currency conversion rates (in production, fetch from an API)
const exchangeRates: Record<string, number> = {
  USD: 0.0067, // 1 JPY = 0.0067 USD
  EUR: 0.0062,
  GBP: 0.0053,
  JPY: 1,
};

export function convertCurrency(amountJPY: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  return Math.round(amountJPY * rate * 100) / 100;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  return symbols[currency] || currency;
}

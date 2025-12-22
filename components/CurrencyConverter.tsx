'use client';

import { useState, useEffect } from 'react';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '@/lib/currency';

interface CurrencyConverterProps {
  amountJPY: number;
}

export default function CurrencyConverter({ amountJPY }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [userCurrency, setUserCurrency] = useState<string | null>(null);

  // Detect user's currency based on location (simplified)
  useEffect(() => {
    // In production, use IP geolocation API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('America')) {
      setUserCurrency('USD');
    } else if (timezone.includes('Europe')) {
      setUserCurrency('EUR');
    } else if (timezone.includes('London')) {
      setUserCurrency('GBP');
    }
  }, []);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  const convertedAmount = convertCurrency(amountJPY, selectedCurrency);

  return (
    <div className="mb-4 p-3 sm:p-4 bg-gray-900/40 border border-amber-900/30 rounded-lg backdrop-blur-sm">
      <p className="text-xs sm:text-sm text-[#F2E8DC]/70 mb-2">Price in other currencies:</p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {currencies.map((currency) => (
          <button
            key={currency}
            onClick={() => setSelectedCurrency(currency)}
            className={`px-2 sm:px-3 py-1 rounded-sm text-xs sm:text-sm font-medium transition-all duration-300 ${
              selectedCurrency === currency
                ? 'bg-[#D4AF37] text-gray-900 shadow-lg shadow-amber-500/30'
                : 'bg-gray-800/60 text-[#F2E8DC]/80 border border-amber-900/30 hover:bg-gray-800/80 hover:border-amber-700/50'
            }`}
          >
            {getCurrencySymbol(currency)}
            {convertCurrency(amountJPY, currency).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </button>
        ))}
      </div>
      {userCurrency && userCurrency !== 'JPY' && (
        <p className="text-[10px] sm:text-xs text-[#F2E8DC]/50 mt-2">
          Your location suggests {userCurrency}. Price shown in {selectedCurrency}.
        </p>
      )}
    </div>
  );
}

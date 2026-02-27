'use client';

import { useState, useEffect } from 'react';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';

interface CurrencyConverterProps {
  amountJPY: number;
}

export default function CurrencyConverter({ amountJPY }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [userCurrency, setUserCurrency] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#F2E8DC]/40 font-light tracking-wider">
        Price in other currencies:
      </p>
      <div className="flex flex-wrap gap-2">
        {currencies.map((currency) => (
          <button
            key={currency}
            onClick={() => setSelectedCurrency(currency)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
              selectedCurrency === currency
                ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-stone-950 shadow-gold'
                : 'bg-stone-800/60 text-[#F2E8DC]/60 border border-amber-900/15 hover:border-amber-700/30 hover:text-[#F2E8DC]/80'
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
        <p className="text-[10px] text-[#F2E8DC]/30 font-light">
          Your location suggests {userCurrency}. Price shown in {selectedCurrency}.
        </p>
      )}
    </div>
  );
}

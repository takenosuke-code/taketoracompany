'use client';

import { useState } from 'react';
import { calculateShipping, getFreeShippingThreshold } from '@/lib/shipping';

interface ShippingCalculatorProps {
  weight: number;
}

export default function ShippingCalculator({ weight }: ShippingCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const shippingOptions = calculateShipping(weight, selectedCountry);
  const freeShippingThreshold = getFreeShippingThreshold();

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];

  return (
    <div className="glass-card p-5 sm:p-6 space-y-4">
      <h3 className="font-serif text-[#D4AF37] tracking-wide text-base sm:text-lg">
        Shipping Calculator
      </h3>

      <div>
        <label htmlFor="country" className="block text-xs text-[#F2E8DC]/50 font-light mb-2 tracking-wider">
          Select Country:
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full px-3 py-2.5 bg-stone-800/60 border border-amber-900/20 rounded-lg text-sm text-[#F2E8DC]/80 focus:outline-none focus:border-[#D4AF37]/40 transition-colors duration-300 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
          }}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code} className="bg-stone-900 text-[#F2E8DC]">
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {shippingOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-stone-800/30 rounded-lg border border-amber-900/10 hover:border-amber-900/25 transition-colors duration-300"
          >
            <div>
              <p className="text-sm font-medium text-[#F2E8DC]/80">{option.name}</p>
              <p className="text-xs text-[#F2E8DC]/40 font-light">{option.description}</p>
            </div>
            <p className="text-sm font-serif text-[#D4AF37]">
              ¥{option.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="gold-line" />

      <div className="space-y-1">
        <p className="text-xs text-[#D4AF37]/60 font-light">
          Free shipping on orders over ¥{freeShippingThreshold.toLocaleString()}
        </p>
        <p className="text-[10px] text-[#F2E8DC]/30 font-light">
          All prices in JPY. Customs fees may apply based on your country&apos;s regulations.
        </p>
      </div>
    </div>
  );
}

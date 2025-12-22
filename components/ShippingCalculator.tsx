'use client';

import { useState } from 'react';
import { calculateShipping, getFreeShippingThreshold } from '@/lib/shipping';

interface ShippingCalculatorProps {
  weight: number; // in grams
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
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Shipping Calculator</h3>
      <div className="mb-3">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Select Country:
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        {shippingOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium text-sm">{option.name}</p>
              <p className="text-xs text-gray-600">{option.description}</p>
            </div>
            <p className="font-semibold">¥{option.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-3">
        Free shipping on orders over ¥{freeShippingThreshold.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        All prices in JPY. Customs fees may apply based on your country's regulations.
      </p>
    </div>
  );
}

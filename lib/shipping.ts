// Shipping calculation logic
export interface ShippingOption {
  name: string;
  description: string;
  price: number; // in JPY
  estimatedDays: number;
}

export function calculateShipping(
  weight: number, // in grams
  country: string
): ShippingOption[] {
  // Simplified shipping calculation
  const basePrice = 1500; // Base shipping in JPY
  
  if (weight <= 500) {
    return [
      {
        name: 'Standard Shipping',
        description: '7-14 business days',
        price: basePrice,
        estimatedDays: 10,
      },
      {
        name: 'Express Shipping',
        description: '3-5 business days',
        price: basePrice * 3,
        estimatedDays: 4,
      },
    ];
  } else if (weight <= 2000) {
    return [
      {
        name: 'Standard Shipping',
        description: '7-14 business days',
        price: basePrice * 1.5,
        estimatedDays: 10,
      },
      {
        name: 'Express Shipping',
        description: '3-5 business days',
        price: basePrice * 4,
        estimatedDays: 4,
      },
    ];
  } else {
    return [
      {
        name: 'Standard Shipping',
        description: '7-14 business days',
        price: basePrice * 2,
        estimatedDays: 10,
      },
      {
        name: 'Express Shipping',
        description: '3-5 business days',
        price: basePrice * 5,
        estimatedDays: 4,
      },
    ];
  }
}

export function getFreeShippingThreshold(): number {
  return 10000; // Free shipping over 10,000 JPY
}

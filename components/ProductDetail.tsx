'use client';

import { useState } from 'react';
import { Product } from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // In production, this would add to cart state/context
    alert(`Added ${quantity} × ${product.name} to cart!`);
  };

  return (
    <>
      {/* Desktop Add to Cart */}
      <div className="hidden md:block">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <label htmlFor="quantity" className="font-semibold text-[#F2E8DC] text-sm sm:text-base">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock || 99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value) || 1)))}
            className="w-18 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/60 border border-amber-900/30 text-[#F2E8DC] rounded-sm text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
          <button
          onClick={handleAddToCart}
          disabled={!((product as any).instock === true || (product as any).in_stock === true || (product as any).is_in_stock === true || (product as any).available === true || (product as any).is_available === true)}
          className="w-full bg-gradient-to-b from-amber-600 to-amber-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-sm font-semibold text-base sm:text-lg hover:from-amber-700 hover:to-amber-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {((product as any).instock === true || (product as any).in_stock === true || (product as any).is_in_stock === true || (product as any).available === true || (product as any).is_available === true) ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-2 text-center">
          Free shipping on orders over ¥10,000
        </p>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-gradient-to-b from-gray-950/95 to-gray-900/95 backdrop-blur-md border-t border-amber-900/30 py-3 sm:py-4 px-4 mt-8 shadow-2xl z-50">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <label htmlFor="quantity-mobile" className="font-semibold text-xs sm:text-sm text-[#F2E8DC]">
            Qty:
          </label>
          <input
            id="quantity-mobile"
            type="number"
            min="1"
            max={product.stock || 99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value) || 1)))}
            className="w-14 sm:w-16 px-2 py-1 bg-gray-800/60 border border-amber-900/30 text-[#F2E8DC] rounded-sm text-center text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!((product as any).instock === true || (product as any).in_stock === true || (product as any).is_in_stock === true || (product as any).available === true || (product as any).is_available === true)}
          className="w-full bg-gradient-to-b from-amber-600 to-amber-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-sm font-semibold text-sm sm:text-base hover:from-amber-700 hover:to-amber-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
        >
          {((product as any).instock === true || (product as any).in_stock === true || (product as any).is_in_stock === true || (product as any).available === true || (product as any).is_available === true) ? `Add to Cart - ¥${(product.price * quantity).toLocaleString()}` : 'Out of Stock'}
        </button>
      </div>
    </>
  );
}

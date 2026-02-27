'use client';

import { useState } from 'react';
import { Product } from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const isAvailable =
    (product as any).instock === true ||
    (product as any).in_stock === true ||
    (product as any).is_in_stock === true ||
    (product as any).available === true ||
    (product as any).is_available === true;

  const handleAddToCart = () => {
    alert(`Added ${quantity} × ${product.name} to cart!`);
  };

  return (
    <>
      {/* Desktop Add to Cart */}
      <div className="hidden md:block space-y-4">
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="text-sm text-[#F2E8DC]/60 font-light tracking-wider">
            Quantity:
          </label>
          <div className="flex items-center border border-amber-900/30 rounded-lg overflow-hidden bg-stone-900/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-[#D4AF37] hover:bg-amber-500/10 transition-colors duration-200 text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock || 99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value) || 1)))}
              className="w-14 px-1 py-2 bg-transparent border-x border-amber-900/20 text-[#F2E8DC] text-center text-sm focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
              className="px-3 py-2 text-[#D4AF37] hover:bg-amber-500/10 transition-colors duration-200 text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`w-full py-4 px-6 rounded-lg font-bold text-base tracking-wider uppercase transition-all duration-500 ${
            isAvailable
              ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-stone-950 hover:from-[#e0c050] hover:to-amber-500 hover:shadow-gold-lg hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {isAvailable ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Add to Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </span>
        </button>

        <p className="text-xs text-[#F2E8DC]/40 text-center font-light tracking-wider">
          Free shipping on orders over ¥10,000
        </p>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur-xl border-t border-amber-900/20 py-3 px-4 z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-[#F2E8DC]/50 font-light">Qty:</span>
          <div className="flex items-center border border-amber-900/30 rounded-lg overflow-hidden bg-stone-900/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-1.5 text-[#D4AF37] hover:bg-amber-500/10 transition-colors text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity-mobile"
              type="number"
              min="1"
              max={product.stock || 99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value) || 1)))}
              className="w-10 px-1 py-1.5 bg-transparent border-x border-amber-900/20 text-[#F2E8DC] text-center text-xs focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
              className="px-2.5 py-1.5 text-[#D4AF37] hover:bg-amber-500/10 transition-colors text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="ml-auto text-sm font-serif text-[#D4AF37]">
            ¥{(product.price * quantity).toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`w-full py-3 px-6 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 ${
            isAvailable
              ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-stone-950 active:from-amber-700 active:to-amber-800'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Add to Cart
            </span>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </>
  );
}

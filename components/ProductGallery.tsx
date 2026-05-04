"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isJa: boolean;
}

export default function ProductGallery({
  images,
  productName,
  isJa,
}: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full glass-card overflow-hidden flex items-center justify-center">
        <span className="text-[#F2E8DC]/30 text-sm">
          {isJa ? "画像がありません" : "No image available"}
        </span>
      </div>
    );
  }

  const activeImage = images[activeIdx] ?? images[0];
  const altMain = isJa
    ? `京都たけとら - ${productName}`
    : `${productName} at Taketora Kyoto`;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full glass-card overflow-hidden group">
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-lg z-10" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-lg z-10" />

        <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
          <Image
            key={activeImage}
            src={activeImage}
            alt={altMain}
            width={1000}
            height={1000}
            className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-700"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div
          role="tablist"
          aria-label={isJa ? "商品画像" : "Product images"}
          className="grid grid-cols-4 gap-2 sm:gap-3"
        >
          {images.slice(0, 8).map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={
                  isJa
                    ? `画像 ${idx + 1} を表示`
                    : `Show image ${idx + 1}`
                }
                onClick={() => setActiveIdx(idx)}
                className={`relative aspect-square glass-card overflow-hidden cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/40"
                    : "hover:border-amber-600/40"
                }`}
              >
                <Image
                  src={img}
                  alt={
                    isJa
                      ? `${productName} - 画像 ${idx + 1}`
                      : `${productName} - View ${idx + 1}`
                  }
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 640px) 25vw, 12.5vw"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

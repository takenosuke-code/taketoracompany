"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isJa: boolean;
}

/** 商品写真。棚の上に置いて見せる */
export default function ProductGallery({ images, productName, isJa }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div>
        <div className="flex aspect-square items-end justify-center pb-6 text-[14px] text-ink-soft">
          {isJa ? "写真はまだありません" : "No photo yet"}
        </div>
        <div className="shelf" />
      </div>
    );
  }

  const activeImage = images[activeIdx] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square">
        <div className="absolute inset-x-6 bottom-0 top-4">
          <Image
            key={activeImage}
            src={activeImage}
            alt={productName}
            fill
            priority
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="shelf" />

      {images.length > 1 && (
        <div role="tablist" aria-label={isJa ? "商品写真" : "Product photos"} className="mt-4 grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              aria-label={isJa ? `写真${idx + 1}を表示` : `Show photo ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square border-2 ${
                idx === activeIdx ? "border-ink" : "border-line hover:border-ink-soft"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

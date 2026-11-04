"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isJa: boolean;
}

/** 商品写真。白地に置いて、複数あれば下の小さな写真で切り替える */
export default function ProductGallery({ images, productName, isJa }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-white text-[13px] text-ink-soft">
        {isJa ? "写真はまだありません" : "No photo yet"}
      </div>
    );
  }

  const activeImage = images[activeIdx] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square bg-white">
        <Image
          key={activeImage}
          src={activeImage}
          alt={productName}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>
      {images.length > 1 && (
        <div role="tablist" aria-label={isJa ? "商品写真" : "Product photos"} className="mt-2 grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              aria-label={isJa ? `写真${idx + 1}を表示` : `Show photo ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square border bg-white ${idx === activeIdx ? "border-ink" : "border-transparent"}`}
            >
              <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

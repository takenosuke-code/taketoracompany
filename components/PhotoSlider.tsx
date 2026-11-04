"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PhotoSliderProps {
  photos: { src: string; alt: string }[];
  /** 写真の切り替え間隔（ミリ秒） */
  interval?: number;
  /** 丸ボタンの読み上げ用ラベル。{n} が写真の番号に置き換わる */
  pickLabel: string;
}

/**
 * 店内写真のスライド。下の丸で切り替えられる。
 * 動きを減らす設定の端末では自動では切り替えない。
 */
export default function PhotoSlider({ photos, interval = 5000, pickLabel }: PhotoSliderProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % photos.length), interval);
    return () => window.clearInterval(id);
  }, [photos.length, interval]);

  return (
    <div>
      <div className="relative aspect-[16/10] bg-[#ddd6ca]">
        {photos.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 920px) 100vw, 872px"
            className={`object-cover ${i === idx ? "" : "invisible"}`}
            aria-hidden={i === idx ? undefined : true}
          />
        ))}
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={pickLabel.replace("{n}", String(i + 1))}
              aria-current={i === idx ? "true" : undefined}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`block h-2 w-2 rounded-full ${i === idx ? "bg-ink" : "bg-[#b0a698]"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

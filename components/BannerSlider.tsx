"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export interface Banner {
  src: string;
  alt: string;
  title: string;
  sub: string;
  href: "/pokemon" | "/anime-figures" | "/antique" | "/visit" | "/collection";
}

interface BannerSliderProps {
  banners: Banner[];
  /** 下の小さな写真の読み上げ用ラベル。{n} が番号に置き換わる */
  pickLabel: string;
  interval?: number;
}

/**
 * 店内写真に売り場の名前を載せたバナー。下の小さな写真で切り替えられる。
 * 動きを減らす設定の端末では自動では切り替えない。
 */
export default function BannerSlider({ banners, pickLabel, interval = 5000 }: BannerSliderProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (banners.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % banners.length), interval);
    return () => window.clearInterval(id);
  }, [banners.length, interval, paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-mist sm:aspect-[1080/440]">
        {banners.map((b, i) => (
          <Link
            key={b.src}
            href={b.href}
            tabIndex={i === idx ? 0 : -1}
            aria-hidden={i === idx ? undefined : true}
            className={`absolute inset-0 ${i === idx ? "" : "invisible"}`}
          >
            <Image
              src={b.src}
              alt={b.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1080px) 100vw, 1080px"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 flex flex-col items-start gap-1.5 sm:bottom-8 sm:left-8">
              <span className="bg-white px-3 py-1 text-[24px] font-black leading-tight text-ink sm:px-4 sm:py-1.5 sm:text-[36px]">
                {b.title}
              </span>
              <span className="bg-hilite px-2.5 py-0.5 text-[13px] font-bold text-ink sm:text-[16px]">{b.sub}</span>
            </span>
          </Link>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {banners.map((b, i) => (
            <button
              key={b.src}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={pickLabel.replace("{n}", String(i + 1))}
              aria-current={i === idx ? "true" : undefined}
              className={`relative aspect-[16/7] overflow-hidden border-2 ${
                i === idx ? "border-tag" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={b.src} alt="" fill sizes="270px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 hidden truncate bg-white/90 px-1 text-[12px] font-bold leading-[1.7] text-ink sm:block">
                {b.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

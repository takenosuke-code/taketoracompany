"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import taketoraLogo from "@/public/assets/taketora_logo.png";

const LOCALES = ["ja", "en"] as const;

function getLocale(pathname: string): "ja" | "en" {
  const first = pathname.split("/")[1];
  return LOCALES.includes(first as "ja" | "en") ? (first as "ja" | "en") : "ja";
}

function localizePath(pathname: string, locale: "ja" | "en"): string {
  const parts = pathname.split("/");
  if (LOCALES.includes(parts[1] as "ja" | "en")) {
    parts[1] = locale;
    return parts.join("/");
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const locale = getLocale(pathname);
  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      locale === "ja"
        ? {
            collection: "全商品",
            antique: "骨董品",
            anime: "アニメフィギュア",
            pokemon: "ポケモンカード",
            visit: "アクセス",
            blog: "ブログ",
            switch: "EN",
          }
        : {
            collection: "All Items",
            antique: "Antiques",
            anime: "Anime Figures",
            pokemon: "Pokemon Cards",
            visit: "Visit Us",
            blog: "Blog",
            switch: "日本語",
          },
    [locale]
  );

  const base = `/${locale}`;
  const switchTo = locale === "ja" ? "en" : "ja";
  const switchHref = localizePath(pathname, switchTo);

  return (
    <header className="border-b border-stone-200 bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href={base} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
              <Image src={taketoraLogo} alt="Taketora logo Kyoto" width={32} height={32} />
            </div>
            <div>
              <p className="font-serif text-2xl tracking-wide text-amber-100 leading-none">TAKETORA</p>
              <p className="text-[11px] text-stone-300">{locale === "ja" ? "京都・東山 五条坂" : "Kyoto Higashiyama"}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm tracking-wide">
            <Link href={`${base}/antique`} className="hover:text-amber-300">{labels.antique}</Link>
            <Link href={`${base}/anime-figures`} className="hover:text-amber-300">{labels.anime}</Link>
            <Link href={`${base}/pokemon`} className="hover:text-amber-300">{labels.pokemon}</Link>
            <Link href={`${base}/collection`} className="hover:text-amber-300">{labels.collection}</Link>
            <Link href={`${base}/visit`} className="hover:text-amber-300">{labels.visit}</Link>
            <Link href={`${base}/blog`} className="hover:text-amber-300">{labels.blog}</Link>
            <Link href={switchHref} className="border border-amber-300 px-3 py-2 min-h-11 inline-flex items-center">
              {labels.switch}
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-amber-200 hover:text-amber-300 p-2 min-h-11 min-w-11"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 text-sm">
            <Link href={`${base}/antique`} className="py-2">{labels.antique}</Link>
            <Link href={`${base}/anime-figures`} className="py-2">{labels.anime}</Link>
            <Link href={`${base}/pokemon`} className="py-2">{labels.pokemon}</Link>
            <Link href={`${base}/collection`} className="py-2">{labels.collection}</Link>
            <Link href={`${base}/visit`} className="py-2">{labels.visit}</Link>
            <Link href={`${base}/blog`} className="py-2">{labels.blog}</Link>
            <Link href={switchHref} className="py-2 text-amber-300">{labels.switch}</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

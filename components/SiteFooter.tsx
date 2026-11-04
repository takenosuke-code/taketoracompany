"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SHOPS, INSTAGRAM_URL, directionsUrl } from "@/lib/shops";

interface SiteFooterProps {
  locale: string;
}

export default function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const isJa = locale === "ja";

  const links = [
    { href: "/collection" as const, label: nav("collection") },
    { href: "/pokemon" as const, label: nav("pokemon") },
    { href: "/anime-figures" as const, label: nav("animeFigures") },
    { href: "/antique" as const, label: nav("antiques") },
    { href: "/visit" as const, label: nav("visit") },
    { href: "/blog" as const, label: nav("blog") },
  ];

  return (
    <footer className="bg-board text-white">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[17px] font-black">{isJa ? "アンティークショップ猛虎（たけとら）" : "Taketora Antiques"}</p>
          <p className="mt-1 text-[12px] text-white/80">{nav("tagline")}</p>
          <ul className="mt-4 space-y-2 text-[13px] leading-relaxed">
            {SHOPS.map((shop) => (
              <li key={shop.id}>
                <a
                  href={directionsUrl(shop, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline-offset-2 hover:underline"
                >
                  {isJa ? shop.nameJa : shop.nameEn}
                </a>
                <span className="block text-white/80">{isJa ? shop.addressJa : shop.addressEn}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px]">{t("hours")}</p>
        </div>
        <div>
          <ul className="grid grid-cols-2 gap-x-4 text-[13px]">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1.5 underline-offset-2 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center rounded border border-white/70 px-4 text-[13px] font-bold hover:bg-white/10"
          >
            Instagram @taketora_antiques
          </a>
        </div>
      </div>
      <p className="border-t border-white/20 py-3 text-center text-[12px] text-white/80">
        {t("copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}

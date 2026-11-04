"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { SHOPS, directionsUrl, INSTAGRAM_URL } from "@/lib/shops";

interface SiteFooterProps {
  locale: string;
}

export default function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const isJa = locale === "ja";
  const pathname = usePathname();

  const links = [
    { href: "/collection" as const, label: nav("collection") },
    { href: "/anime-figures" as const, label: nav("animeFigures") },
    { href: "/pokemon" as const, label: nav("pokemon") },
    { href: "/antique" as const, label: nav("antiques") },
    { href: "/visit" as const, label: nav("visit") },
    { href: "/blog" as const, label: nav("blog") },
  ];

  return (
    <footer className="bg-board text-board-text">
      <div className="mx-auto max-w-shop px-4 pb-10 pt-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.1fr_2fr]">
          <div>
            <p className="text-[26px] font-black leading-none tracking-[0.08em]">
              {isJa ? "猛虎" : "Taketora"}
            </p>
            <p className="mt-2 text-[14px] font-bold text-board-soft">
              {isJa ? "たけとら　京都・東山のアンティークショップ" : "Antique shop in Higashiyama, Kyoto"}
            </p>
            <p className="mt-5 text-[14px] leading-relaxed text-board-soft">
              {t("hours")}
              <br />
              {t("english")}
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-[15px] font-bold text-sky-200 underline underline-offset-4 hover:decoration-2"
            >
              Instagram @taketora_antiques
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-[15px] font-bold text-board-text">{t("shopsTitle")}</h2>
              <ul className="mt-3 space-y-4">
                {SHOPS.map((shop) => (
                  <li key={shop.id} className="text-[14px] leading-relaxed text-board-soft">
                    <a
                      href={directionsUrl(shop, locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-board-text underline-offset-4 hover:underline"
                    >
                      {isJa ? shop.nameJa : shop.nameEn}
                    </a>
                    <br />
                    {isJa ? shop.addressJa : shop.addressEn}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-board-text">{t("pagesTitle")}</h2>
              <ul className="mt-3 space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-[14px] text-board-soft underline-offset-4 hover:text-board-text hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-board-soft/30 pt-5 text-[13px] text-board-soft sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <Link
            href={pathname}
            locale={isJa ? "en" : "ja"}
            lang={isJa ? "en" : "ja"}
            className="font-bold text-board-text underline-offset-4 hover:underline"
          >
            {nav("switchLang")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

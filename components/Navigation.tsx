"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { INSTAGRAM_URL } from "@/lib/shops";
import taketoraLogo from "@/public/assets/taketora_logo.png";

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isJa = locale === "ja";
  const otherLocale = isJa ? "en" : "ja";

  const navLinks = [
    { href: "/collection" as const, label: t("collection") },
    { href: "/pokemon" as const, label: t("pokemon") },
    { href: "/anime-figures" as const, label: t("animeFigures") },
    { href: "/antique" as const, label: t("antiques") },
    { href: "/visit" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-white focus:px-3 focus:py-1"
      >
        {t("skip")}
      </a>

      {/* 営業時間の帯 */}
      <div className="bg-board text-white">
        <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-4 py-1.5 text-[12px] sm:px-6">
          <p>
            {t("hoursBar")}
            <span className="ml-3 hidden sm:inline">{t("englishOk")}</span>
          </p>
          <Link href={pathname || "/"} locale={otherLocale} lang={otherLocale} className="font-bold underline">
            {t("switchLang")}
          </Link>
        </div>
      </div>

      {/* 看板 */}
      <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src={taketoraLogo} alt="" width={60} height={60} priority className="h-12 w-12 sm:h-[60px] sm:w-[60px]" />
          <span className="leading-tight">
            <span className="block text-[18px] font-black tracking-[0.06em] sm:text-[22px]">
              {isJa ? "アンティークショップ猛虎" : "Taketora"}
            </span>
            <span className="mt-1 block text-[11px] font-bold text-ink-soft sm:text-[12px]">{t("tagline")}</span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-sub min-h-[40px] px-4 text-[13px]">
            Instagram
          </a>
          <Link href="/visit" className="btn min-h-[40px] px-4 text-[13px]">
            {t("visit")}
          </Link>
        </div>
      </div>

      {/* メニュー（スマホは3列×2段） */}
      <nav aria-label={t("menuLabel")} className="bg-sky">
        <ul className="mx-auto grid max-w-site grid-cols-3 md:flex md:justify-center md:px-6">
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-r border-white/70 md:border-b-0 md:border-l md:border-r-0 md:last:border-r">
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex min-h-[44px] items-center justify-center px-2 text-center text-[13px] font-bold leading-tight md:px-5 md:text-[14px] ${
                  isActive(link.href) ? "bg-white text-ink" : "text-ink hover:bg-white/50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import taketoraLogo from "@/public/assets/taketora_logo.png";

interface NavigationProps {
  locale: string;
}

/** 看板（ロゴ）を中央に置き、その下に小さな文字のメニューを1行で並べる */
export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isJa = locale === "ja";
  const otherLocale = isJa ? "en" : "ja";

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/collection" as const, label: t("collection") },
    { href: "/anime-figures" as const, label: t("animeFigures") },
    { href: "/pokemon" as const, label: t("pokemon") },
    { href: "/antique" as const, label: t("antiques") },
    { href: "/visit" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="mx-auto max-w-site px-4 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-white focus:px-3 focus:py-1"
      >
        {t("skip")}
      </a>

      <div className="flex justify-end pt-3 text-[12px]">
        <Link href={pathname || "/"} locale={otherLocale} lang={otherLocale} className="text-link">
          {t("switchLang")}
        </Link>
      </div>

      <Link href="/" className="mx-auto mt-1 flex w-fit flex-col items-center pb-4">
        <Image
          src={taketoraLogo}
          alt=""
          width={88}
          height={88}
          priority
          className="h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]"
        />
        <span className="mt-2 text-[18px] font-bold tracking-[0.2em]">
          {isJa ? "アンティークショップ猛虎" : "Taketora Antiques"}
        </span>
        <span className="text-[11px] tracking-[0.2em] text-ink-soft">
          {isJa ? "たけとら　京都・東山" : "Higashiyama, Kyoto"}
        </span>
      </Link>

      <nav
        aria-label={t("menuLabel")}
        className="border-y border-dotted border-rule"
      >
        <ul className="flex flex-wrap justify-center gap-x-1 px-1 py-1 text-[13px]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block whitespace-nowrap px-2 py-1.5 sm:px-2.5 sm:py-2 ${
                  isActive(link.href) ? "font-bold text-ink" : "text-ink-soft hover:text-ink"
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

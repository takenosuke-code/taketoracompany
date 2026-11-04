"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import taketoraLogo from "@/public/assets/taketora_logo.png";

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isJa = locale === "ja";
  const otherLocale = isJa ? "en" : "ja";

  const navLinks = [
    { href: "/collection" as const, label: t("collection") },
    { href: "/anime-figures" as const, label: t("animeFigures") },
    { href: "/pokemon" as const, label: t("pokemon") },
    { href: "/antique" as const, label: t("antiques") },
    { href: "/visit" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-wall/95 supports-[backdrop-filter]:bg-wall/90">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        {t("skip")}
      </a>
      <div className="mx-auto flex max-w-shop items-center justify-between gap-6 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src={taketoraLogo}
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[22px] font-black tracking-[0.08em]">
              {isJa ? "猛虎" : "Taketora"}
            </span>
            <span className="mt-1 text-[11px] font-bold text-ink-soft">
              {isJa ? "たけとら　京都・東山" : "Antiques in Kyoto"}
            </span>
          </span>
        </Link>

        <nav aria-label={t("menuLabel")} className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded px-3 py-2 text-[14px] font-bold ${
                isActive(link.href)
                  ? "text-ink underline decoration-pine decoration-[3px] underline-offset-[10px]"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={pathname || "/"}
            locale={otherLocale}
            className="ml-3 rounded border border-line px-3 py-1.5 text-[13px] font-bold text-ink hover:border-ink"
            lang={otherLocale}
          >
            {t("switchLang")}
          </Link>
        </nav>

        <button
          type="button"
          className="flex min-h-[44px] items-center gap-2 rounded border border-line px-3 text-[14px] font-bold lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]">
            <span className="h-[2px] bg-ink" />
            <span className="h-[2px] bg-ink" />
            <span className="h-[2px] bg-ink" />
          </span>
          {open ? t("close") : t("menu")}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t("menuLabel")}
          className="border-t border-line bg-wall lg:hidden"
        >
          <ul className="mx-auto max-w-shop px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-line last:border-b-0">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[52px] items-center text-[16px] font-bold ${
                    isActive(link.href) ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={pathname || "/"}
                locale={otherLocale}
                lang={otherLocale}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center text-[16px] font-bold text-sky-700"
              >
                {t("switchLang")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

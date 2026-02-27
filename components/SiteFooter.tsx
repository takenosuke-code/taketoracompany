"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface SiteFooterProps {
  locale: string;
}

export default function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const isJa = locale === "ja";

  return (
    <footer className="relative z-20 bg-stone-950 text-stone-300 overflow-hidden">
      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      {/* Decorative orbs */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl text-gradient-gold mb-4 tracking-wider">
              {t("brand")}
            </h3>
            <p className="text-sm font-light leading-relaxed text-stone-500 mb-6">
              {t("brandDesc")}
            </p>
            {/* Social */}
            <a
              href="https://www.instagram.com/taketora_antiques/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-stone-500 hover:text-[#D4AF37] transition-all duration-300 text-sm group"
            >
              <span className="p-2 rounded-lg bg-amber-500/5 border border-amber-900/10 group-hover:border-amber-700/30 group-hover:bg-amber-500/10 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
              Instagram
            </a>
          </div>

          {/* Collection Links */}
          <div>
            <h4 className="font-medium text-stone-200 mb-5 tracking-wider text-sm uppercase">
              {t("collectionTitle")}
            </h4>
            <ul className="space-y-3 text-sm font-light">
              {[
                { href: "/antique" as const, label: nav("antiques") },
                { href: "/anime-figures" as const, label: nav("animeFigures") },
                { href: "/pokemon" as const, label: nav("pokemon") },
                { href: "/collection" as const, label: nav("collection") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-500 hover:text-[#D4AF37] transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#D4AF37] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-medium text-stone-200 mb-5 tracking-wider text-sm uppercase">
              {t("infoTitle")}
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link
                  href="/visit"
                  className="text-stone-500 hover:text-[#D4AF37] transition-colors duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-[#D4AF37] transition-all duration-300" />
                  {nav("visit")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-stone-500 hover:text-[#D4AF37] transition-colors duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-[#D4AF37] transition-all duration-300" />
                  {nav("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Info */}
          <div>
            <h4 className="font-medium text-stone-200 mb-5 tracking-wider text-sm uppercase">
              {t("shopInfoTitle")}
            </h4>
            <address className="text-sm font-light not-italic leading-relaxed text-stone-500 whitespace-pre-line mb-3">
              {t("address")}
            </address>
            <p className="text-sm font-light text-stone-500 mb-1">
              {t("hoursLabel")}
            </p>
            <p className="text-sm font-light text-[#D4AF37]/60">
              {t("englishAvailable")}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-600 font-light">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <Link
              href="/"
              locale={isJa ? "en" : "ja"}
              className="text-xs text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors duration-300 tracking-wider font-light"
            >
              {t("switchLang")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

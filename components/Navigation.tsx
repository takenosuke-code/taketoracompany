"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import taketoraLogo from "@/public/assets/taketora_logo.png";

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("nav");
  const ft = useTranslations("footer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const otherLocale = locale === "ja" ? "en" : "ja";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/collection" as const, label: t("collection") },
    { href: "/anime-figures" as const, label: t("animeFigures") },
    { href: "/pokemon" as const, label: t("pokemon") },
    { href: "/antique" as const, label: t("antiques") },
    { href: "/visit" as const, label: t("visit") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-stone-950/90 backdrop-blur-xl border-b border-amber-900/20 shadow-lg shadow-black/20"
          : "bg-gradient-to-b from-stone-950/80 to-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 sm:space-x-3"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-white/95 rounded-lg flex items-center justify-center overflow-hidden group-hover:shadow-gold transition-all duration-500">
              <Image
                src={taketoraLogo}
                alt={locale === "ja" ? "たけとら ロゴ" : "Taketora Logo"}
                width={36}
                height={36}
                className="group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl lg:text-[1.7rem] tracking-[0.15em] text-gradient-gold leading-none font-bold">
                TAKETORA
              </span>
              <span className="text-[10px] sm:text-[11px] text-amber-400/60 tracking-[0.25em] uppercase font-light">
                {locale === "ja" ? "京都・東山" : "Kyoto · Higashiyama"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 xl:px-4 py-2 text-[13px] tracking-wider font-light transition-all duration-300 rounded-lg group ${
                    isActive
                      ? "text-[#D4AF37]"
                      : "text-stone-300 hover:text-[#F2E8DC]"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Hover background */}
                  <span className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 rounded-lg transition-all duration-300" />
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                  {/* Hover indicator */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-[#D4AF37]/50 rounded-full transition-all duration-300" />
                </Link>
              );
            })}

            {/* Language Switcher */}
            <Link
              href={pathname || "/"}
              locale={otherLocale}
              className="ml-3 px-4 py-2 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60 transition-all duration-300 text-xs font-medium tracking-widest uppercase"
            >
              {ft("switchLang")}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-amber-200 hover:text-amber-300 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-amber-500/5 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pb-6 pt-2 border-t border-stone-700/50 space-y-1">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3.5 text-sm rounded-xl transition-all duration-300 min-h-[44px] flex items-center ${
                    isActive
                      ? "text-[#D4AF37] bg-amber-500/5"
                      : "text-stone-300 hover:text-[#F2E8DC] hover:bg-stone-800/40"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-3" />
                  )}
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Language Switcher */}
            <div className="pt-3 mt-3 border-t border-stone-700/30">
              <Link
                href={pathname || "/"}
                locale={otherLocale}
                className="flex items-center gap-3 px-4 py-3.5 text-sm text-amber-300 hover:text-amber-200 hover:bg-stone-800/40 rounded-xl transition-all duration-300 min-h-[44px] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-base">🌐</span>
                {ft("switchLang")}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

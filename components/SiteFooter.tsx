"use client";

import { useTranslations } from "next-intl";
import { SHOPS, INSTAGRAM_URL } from "@/lib/shops";

interface SiteFooterProps {
  locale: string;
}

export default function SiteFooter({ locale }: SiteFooterProps) {
  const t = useTranslations("footer");
  const isJa = locale === "ja";

  return (
    <footer className="mx-auto max-w-site px-4 pb-10 sm:px-6">
      <div className="border-t border-dotted border-rule pt-6 text-center text-[12px] leading-[1.9] text-ink-soft">
        <p className="font-bold text-ink">{isJa ? "アンティークショップ猛虎（たけとら）" : "Taketora Antiques"}</p>
        <ul className="mt-1">
          {SHOPS.map((shop) => (
            <li key={shop.id} className="mt-1 sm:mt-0">
              <span className="block sm:inline">{isJa ? shop.nameJa : shop.nameEn}</span>
              <span className="hidden sm:inline">　</span>
              <span className="block sm:inline">{isJa ? shop.addressJa : shop.addressEn}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1">{t("hours")}</p>
        <p className="mt-1">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-link">
            Instagram @taketora_antiques
          </a>
        </p>
        <p className="mt-4">{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}

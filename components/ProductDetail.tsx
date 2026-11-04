import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { INSTAGRAM_URL } from "@/lib/shops";

interface ProductDetailProps {
  locale: string;
}

/** 商品ページの行動ボタン。店頭販売なので「行き方」と「問い合わせ」の2つだけ */
export default async function ProductDetail({ locale }: ProductDetailProps) {
  const t = await getTranslations({ locale, namespace: "product" });

  return (
    <>
      <div className="hidden flex-wrap gap-3 md:flex">
        <Link href="/visit" className="btn">
          {t("visitStore")}
        </Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-line">
          {t("ask")}
        </a>
      </div>
      <p className="text-[14px] leading-[1.9] text-ink-soft">{t("note")}</p>

      {/* スマホ: 画面下に固定（iOSのホームインジケータと重ならないよう safe-area 分を足す） */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-wall px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:hidden">
        <Link href="/visit" className="btn px-2 text-[14px]">
          {t("visitStore")}
        </Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-line px-2 text-[14px]">
          {t("askShort")}
        </a>
      </div>
    </>
  );
}

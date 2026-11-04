import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { INSTAGRAM_URL } from "@/lib/shops";

interface ProductDetailProps {
  locale: string;
}

/** 店頭販売なので、行き方と問い合わせの2つだけ */
export default async function ProductDetail({ locale }: ProductDetailProps) {
  const t = await getTranslations({ locale, namespace: "product" });

  return (
    <div>
      <p className="text-[13px]">{t("note")}</p>
      <p className="mt-3 flex flex-wrap gap-2">
        <Link href="/visit" className="s-btn">
          {t("visitStore")}
        </Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
          {t("ask")}
        </a>
      </p>
    </div>
  );
}

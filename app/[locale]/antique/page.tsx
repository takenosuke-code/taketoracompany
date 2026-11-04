import { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ProductGrid from "@/components/ProductGrid";
import { localeUrl, localePath, hreflang, ogMeta } from "@/lib/urls";
import { getCatalogProducts } from "@/lib/catalog";
import { INSTAGRAM_URL } from "@/lib/shops";
import { PHOTOS, photoAlt } from "@/lib/photos";

// 商品・在庫（スマレジ）を60秒ごとに再取得
export const revalidate = 60;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.antique" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/antique"),
      languages: hreflang("/antique"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/antique" }),
  };
}

const KINDS = ["ceramics", "tea", "folk", "art"] as const;

export default async function AntiquePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // taketora_app の商品マスタから取得（現状 antique カテゴリは未使用のため空になる）
  const products = await getCatalogProducts("antique");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.antique"), href: localePath(locale, "/antique") },
        ]}
        title={t("antiquePage.title")}
        intro={<p className="text-center text-[13px]">{t("antiquePage.intro")}</p>}
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[PHOTOS.potteryShelves, PHOTOS.windowShelf].map((ph, i) => (
          <div key={ph.src} className="relative aspect-[4/3]">
            <Image
              src={ph.src}
              alt={photoAlt(ph, locale)}
              fill
              priority={i === 0}
              sizes="(max-width: 920px) 50vw, 436px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="kinds">
        <h2 id="kinds" className="sec-title">
          {t("antiquePage.kindsTitle")}
        </h2>
        <table className="mt-4 w-full border-collapse text-[13px]">
          <tbody>
            {KINDS.map((k) => (
              <tr key={k} className="border-b border-dotted border-rule">
                <th scope="row" className="w-[9rem] py-3 pr-4 text-left align-top font-bold sm:w-[12rem]">
                  {t(`antiquePage.kinds.${k}.name`)}
                </th>
                <td className="py-3">{t(`antiquePage.kinds.${k}.examples`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {products.length > 0 && (
        <div className="mt-10">
          <ProductGrid products={products} locale={locale} category="antique" />
        </div>
      )}

      <p className="mt-8 flex flex-wrap justify-center gap-2">
        <Link href="/visit" className="s-btn">
          {t("common.shops")}
        </Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
          {t("common.instagram")}
        </a>
      </p>
    </>
  );
}

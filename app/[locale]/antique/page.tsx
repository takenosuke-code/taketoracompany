import { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ProductShelf from "@/components/ProductShelf";
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
        intro={<p>{t("antiquePage.intro")}</p>}
      />

      <div className="mx-auto max-w-shop px-4 pb-20 pt-10 sm:px-6">
        {/* 店内の写真を棚に置く */}
        <div className="grid items-end gap-8 md:grid-cols-[1.6fr_1fr] md:gap-0">
          <div>
            <div className="relative aspect-[4/3] md:mx-3 md:aspect-auto md:h-[420px]">
              <Image
                src={PHOTOS.potteryShelves.src}
                alt={photoAlt(PHOTOS.potteryShelves, locale)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="shelf" />
          </div>
          <div>
            <div className="relative aspect-[3/4] md:mx-3 md:aspect-auto md:h-[420px]">
              <Image
                src={PHOTOS.windowShelf.src}
                alt={photoAlt(PHOTOS.windowShelf, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
            <div className="shelf" />
          </div>
        </div>

        <section className="mt-16" aria-labelledby="kinds">
          <h2 id="kinds" className="text-[26px] font-black sm:text-[30px]">
            {t("antiquePage.kindsTitle")}
          </h2>
          <dl className="mt-6 grid border-t border-line sm:grid-cols-2">
            {KINDS.map((k) => (
              <div key={k} className="border-b border-line py-5 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                <dt className="text-[18px] font-black">{t(`antiquePage.kinds.${k}.name`)}</dt>
                <dd className="mt-1 text-[15px] text-ink-soft">{t(`antiquePage.kinds.${k}.examples`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16">
          {products.length > 0 ? (
            <ProductShelf products={products} locale={locale} category="antique" />
          ) : (
            <div className="max-w-[40rem]">
              <p className="text-[19px] font-black">{t("antiquePage.emptyTitle")}</p>
              <p className="mt-2 text-[15px] leading-[1.9] text-ink-soft">{t("antiquePage.emptyBody")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/visit" className="btn">
                  {t("common.shops")}
                </Link>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-line">
                  {t("common.instagram")}
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

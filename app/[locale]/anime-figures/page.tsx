import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ProductShelf, { EmptyShelf, groupBySeries } from "@/components/ProductShelf";
import { localeUrl, localePath, hreflang, ogMeta } from "@/lib/urls";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";
import { INSTAGRAM_URL } from "@/lib/shops";
import { PHOTOS, photoAlt } from "@/lib/photos";

// 商品・在庫（スマレジ）を60秒ごとに再取得
export const revalidate = 60;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.animeFigures" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/anime-figures"),
      languages: hreflang("/anime-figures"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/anime-figures" }),
  };
}

export default async function AnimeFiguresPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // taketora_app（在庫管理アプリ）の商品マスタから取得し、シリーズごとに棚を分ける
  const products = await getCatalogProducts(CATALOG_CATEGORY);
  const groups = groupBySeries(products, t("collection.other"));

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.animeFigures"), href: localePath(locale, "/anime-figures") },
        ]}
        title={t("animeFigures.title")}
        intro={<p>{t("animeFigures.intro")}</p>}
      >
        {groups.length > 1 && (
          <nav aria-label={t("animeFigures.title")} className="mt-6 flex flex-wrap gap-2">
            {groups.map((g, i) => (
              <a
                key={g.series}
                href={`#series-${i}`}
                className="rounded border border-line px-3 py-1.5 text-[14px] font-bold hover:border-ink"
              >
                {g.series}
                <span className="ml-1.5 font-medium text-ink-soft">{g.items.length}</span>
              </a>
            ))}
          </nav>
        )}
      </PageHeader>

      <div className="mx-auto max-w-shop px-4 pb-20 pt-10 sm:px-6">
        {groups.length > 0 ? (
          <div className="space-y-16">
            {groups.map((g, i) => (
              <section key={g.series} id={`series-${i}`} className="scroll-mt-24" aria-label={g.series}>
                <h2 className="flex items-baseline gap-3 text-[20px] font-black">
                  {g.series}
                  <span className="text-[14px] font-bold text-ink-soft">
                    {t("collection.count", { count: g.items.length })}
                  </span>
                </h2>
                <div className="mt-4">
                  <ProductShelf products={g.items} locale={locale} category={CATALOG_CATEGORY} />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyShelf
            title={t("animeFigures.emptyTitle")}
            body={t("animeFigures.emptyBody")}
            photo={{ src: PHOTOS.figureWall.src, alt: photoAlt(PHOTOS.figureWall, locale) }}
          >
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn">
              {t("common.instagram")}
            </a>
            <Link href="/visit" className="btn-line">
              {t("common.shops")}
            </Link>
          </EmptyShelf>
        )}
      </div>
    </>
  );
}

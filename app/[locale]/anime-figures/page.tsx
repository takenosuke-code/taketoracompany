import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ProductGrid, { EmptyNote, groupBySeries } from "@/components/ProductGrid";
import { localeUrl, localePath, hreflang, ogMeta } from "@/lib/urls";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";
import { INSTAGRAM_URL } from "@/lib/shops";

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

  // taketora_app（在庫管理アプリ）の商品マスタから取得し、シリーズごとに分ける
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
        intro={<p className="text-center text-[13px]">{t("animeFigures.intro")}</p>}
      >
        {groups.length > 1 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px]">
            {groups.map((g, i) => (
              <li key={g.series}>
                <a href={`#series-${i}`} className="text-link">
                  {g.series}（{g.items.length}）
                </a>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>

      <div className="mt-10">
        {groups.length > 0 ? (
          <div className="space-y-12">
            {groups.map((g, i) => (
              <section key={g.series} id={`series-${i}`} className="scroll-mt-4" aria-label={g.series}>
                <h2 className="border-l-4 border-wood pl-2 text-[14px] font-bold">
                  {g.series}
                  <span className="ml-2 text-[12px] font-normal text-ink-soft">
                    {t("collection.count", { count: g.items.length })}
                  </span>
                </h2>
                <div className="mt-4">
                  <ProductGrid products={g.items} locale={locale} category={CATALOG_CATEGORY} />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyNote title={t("animeFigures.emptyTitle")} body={t("animeFigures.emptyBody")}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
              {t("common.instagram")}
            </a>
            <Link href="/visit" className="s-btn">
              {t("common.shops")}
            </Link>
          </EmptyNote>
        )}
      </div>
    </>
  );
}

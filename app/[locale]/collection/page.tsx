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
  const t = await getTranslations({ locale, namespace: "metadata.collection" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/collection"),
      languages: hreflang("/collection"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/collection" }),
  };
}

export default async function CollectionPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // taketora_app（在庫管理アプリ）の商品マスタ。現状は全商品フィギュア扱いで、シリーズごとに並べる
  const products = await getCatalogProducts();
  const groups = groupBySeries(products, t("collection.other"));

  const categories = [
    { href: "/anime-figures" as const, label: t("nav.animeFigures") },
    { href: "/pokemon" as const, label: t("nav.pokemon") },
    { href: "/antique" as const, label: t("nav.antiques") },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.collection"), href: localePath(locale, "/collection") },
        ]}
        title={t("collection.title")}
        intro={<p>{t("collection.intro")}</p>}
      >
        <nav aria-label={t("collection.categories")} className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c.href} href={c.href} className="btn-sub">
              {c.label}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="mt-8">
        {groups.length > 0 ? (
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.series} aria-label={g.series}>
                <h2 className="flex items-baseline gap-2 border-b-2 border-ink pb-1 text-[17px] font-black">
                  {g.series}
                  <span className="text-[13px] font-bold text-ink-soft">
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
          <EmptyNote title={t("collection.emptyTitle")} body={t("collection.emptyBody")}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-sub">
              {t("common.instagram")}
            </a>
            <Link href="/visit" className="btn-sub">
              {t("common.shops")}
            </Link>
          </EmptyNote>
        )}
      </div>
      </div>
    </>
  );
}

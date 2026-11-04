import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ProductShelf, { EmptyShelf } from "@/components/ProductShelf";
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
  const t = await getTranslations({ locale, namespace: "metadata.pokemon" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/pokemon"),
      languages: hreflang("/pokemon"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/pokemon" }),
  };
}

export default async function PokemonPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // taketora_app の商品マスタから取得（現状 pokemon カテゴリは未使用のため空になる）
  const products = await getCatalogProducts("pokemon");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.pokemon"), href: localePath(locale, "/pokemon") },
        ]}
        title={t("pokemonPage.title")}
        intro={<p>{t("pokemonPage.intro")}</p>}
      />

      <div className="mx-auto max-w-shop px-4 pb-20 pt-10 sm:px-6">
        {products.length > 0 ? (
          <ProductShelf products={products} locale={locale} category="pokemon" />
        ) : (
          <EmptyShelf
            title={t("pokemonPage.emptyTitle")}
            body={t("pokemonPage.emptyBody")}
            photo={{ src: PHOTOS.pokemonShelf.src, alt: photoAlt(PHOTOS.pokemonShelf, locale) }}
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

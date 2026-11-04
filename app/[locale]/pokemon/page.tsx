import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import ProductGrid, { EmptyNote } from "@/components/ProductGrid";
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

      <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="mt-6 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3]">
          <Image
            src={PHOTOS.pokemonShelf.src}
            alt={photoAlt(PHOTOS.pokemonShelf, locale)}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] bg-[#0b0b0b] sm:aspect-auto">
          <Image
            src={PHOTOS.pokemonBox.src}
            alt={photoAlt(PHOTOS.pokemonBox, locale)}
            fill
            sizes="(max-width: 640px) 100vw, 420px"
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} locale={locale} category="pokemon" />
        ) : (
          <EmptyNote title={t("pokemonPage.emptyTitle")} body={t("pokemonPage.emptyBody")}>
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

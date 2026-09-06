import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/ProductDetail";
import ProductGallery from "@/components/ProductGallery";
import CurrencyConverter from "@/components/CurrencyConverter";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import JsonLd from "@/components/JsonLd";
import { BreadcrumbItem } from "@/types/product";
import { localeUrl, localePath, hreflang } from "@/lib/urls";
import {
  getCatalogProduct,
  getCatalogProducts,
  isInStock,
  CATALOG_CATEGORY,
} from "@/lib/catalog";

interface ProductPageProps {
  params: { category: string; product: string; locale: string };
}

// 商品・在庫（スマレジ）を60秒ごとに再取得
export const revalidate = 60;
// ビルド後に登録された商品もアクセス時に生成する
export const dynamicParams = true;

export async function generateStaticParams() {
  // 環境変数が無いビルドでは空を返す（dynamicParams で実行時に生成される）
  const products = await getCatalogProducts();
  return products.map((p) => ({ category: CATALOG_CATEGORY, product: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { category, product: productSlug, locale } = params;
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  const product =
    category === CATALOG_CATEGORY ? await getCatalogProduct(productSlug) : null;

  if (!product) {
    return { title: `${t("product.notFound")} | Taketora` };
  }

  const title = isJa
    ? `${product.name} | 京都 たけとら`
    : `${product.name} | Taketora Kyoto`;
  const description = isJa
    ? `京都・東山のたけとらで${product.name}をお買い求めいただけます。${[
        product.character,
        product.series,
        product.maker,
      ]
        .filter(Boolean)
        .join(" / ")}`
    : `Authentic ${product.name} available at Taketora in Kyoto. ${[
        product.character,
        product.series,
        product.maker,
      ]
        .filter(Boolean)
        .join(" / ")}`;

  return {
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, `/${category}/${productSlug}`),
      languages: hreflang(`/${category}/${productSlug}`),
    },
    openGraph: {
      title: product.name,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
      type: "website",
      locale: isJa ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, product: productSlug, locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  if (category !== CATALOG_CATEGORY) notFound();

  const product = await getCatalogProduct(productSlug);
  if (!product) notFound();

  const allProducts = await getCatalogProducts();
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const available = isInStock(product);
  const conditionLabel = product.conditionRank
    ? isJa
      ? `ランク${product.conditionRank}`
      : `Rank ${product.conditionRank}`
    : null;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: localePath(locale) },
    {
      label: t("breadcrumbs.animeFigures"),
      href: localePath(locale, `/${category}`),
    },
    {
      label: product.name,
      href: localePath(locale, `/${category}/${productSlug}`),
    },
  ];

  // 商品スペック（taketora_app の商品マスタの属性）
  const specs: Array<{ label: string; value: string }> = [];
  if (product.character)
    specs.push({
      label: isJa ? "キャラクター" : "Character",
      value: product.character,
    });
  if (product.series)
    specs.push({ label: isJa ? "シリーズ" : "Series", value: product.series });
  if (product.maker)
    specs.push({ label: isJa ? "メーカー" : "Maker", value: product.maker });
  if (conditionLabel)
    specs.push({
      label: t("product.condition"),
      value: conditionLabel,
    });

  const tags = [product.character, product.series, product.maker].filter(
    (v): v is string => Boolean(v)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: tags.join(" / "),
    image: product.imageUrl || "",
    sku: product.slug,
    brand: product.maker ? { "@type": "Brand", name: product.maker } : undefined,
    offers: {
      "@type": "Offer",
      url: localeUrl(locale, `/${category}/${productSlug}`),
      price: product.price ?? 0,
      priceCurrency: "JPY",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      // 中古販売（状態はランク表示）
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="min-h-screen bg-stone-950 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-56 h-56 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24 pb-40 md:pb-12">
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mt-4 sm:mt-8">
          {/* Product Images */}
          <ScrollRevealSection variant="fade-right">
            <ProductGallery
              images={product.imageUrl ? [product.imageUrl] : []}
              productName={product.name}
              isJa={isJa}
            />
          </ScrollRevealSection>

          {/* Product Details */}
          <ScrollRevealSection variant="fade-left" delay={200}>
            <div className="space-y-5 sm:space-y-6">
              {/* Category badge */}
              <span className="badge-gold">
                {isJa ? "アニメフィギュア" : "Anime Figures"}
              </span>

              {/* Product name */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F2E8DC] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Brand */}
              {product.maker && (
                <p className="text-base sm:text-lg text-[#F2E8DC]/60 font-light">
                  {t("product.brand")}:{" "}
                  <span className="text-[#F2E8DC]/90 font-medium">
                    {product.maker}
                  </span>
                </p>
              )}

              {/* Price section */}
              <div className="glass-card p-5 sm:p-6 space-y-3">
                <p className="text-3xl sm:text-4xl font-serif text-[#D4AF37] tracking-wide">
                  ¥{product.price?.toLocaleString("ja-JP") || "0"}
                </p>
                <CurrencyConverter amountJPY={product.price || 0} />
              </div>

              {/* Feature badges */}
              {conditionLabel && (
                <div className="flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                    <span className="text-xs sm:text-sm font-medium text-amber-300">
                      {t("product.condition")}: {conditionLabel}
                    </span>
                  </div>
                </div>
              )}

              {/* Stock status（スマレジの現在在庫と連動） */}
              <div className="gold-line" />
              <div>
                {available ? (
                  <p className="text-sm sm:text-base text-emerald-400 font-medium flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    {t("product.inStock")}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-red-400/80 font-medium flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-red-400/60 rounded-full flex-shrink-0" />
                    {t("product.outOfStock")}
                  </p>
                )}
              </div>

              {/* CTAs */}
              <ProductDetail locale={locale} />

              {/* Specifications */}
              {specs.length > 0 && (
                <div className="glass-card p-5 sm:p-6 space-y-3">
                  <h2 className="text-lg sm:text-xl font-serif text-[#D4AF37] tracking-wide">
                    {t("product.specifications")}
                  </h2>
                  <dl className="grid grid-cols-2 gap-4">
                    {specs.map((spec) => (
                      <div key={spec.label} className="contents">
                        <dt className="text-xs sm:text-sm font-medium text-[#F2E8DC]/50">
                          {spec.label}
                        </dt>
                        <dd className="text-xs sm:text-sm text-[#F2E8DC]/80">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-[10px] sm:text-xs font-light text-[#F2E8DC]/50 bg-stone-800/40 border border-stone-700/30 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollRevealSection>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ScrollRevealSection variant="fade-up">
            <section
              className="mt-16 sm:mt-20 lg:mt-24"
              aria-labelledby="related-products-heading"
            >
              <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                <h2
                  id="related-products-heading"
                  className="font-serif text-2xl sm:text-3xl text-[#D4AF37] tracking-wide whitespace-nowrap"
                >
                  {isJa ? "関連商品" : "Related Products"}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${category}/${p.slug}`}
                    className="product-card group glass-card block overflow-hidden"
                  >
                    <div className="aspect-square w-full relative bg-gradient-to-br from-stone-800/30 to-stone-900/30 overflow-hidden">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={
                            isJa
                              ? `京都たけとら - ${p.name}`
                              : `${p.name} at Taketora Kyoto`
                          }
                          fill
                          className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/20 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 space-y-1.5">
                      <h3 className="font-serif text-sm sm:text-base text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-base sm:text-lg text-[#D4AF37] font-serif tracking-wide">
                        ¥{p.price?.toLocaleString("ja-JP") || "0"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </ScrollRevealSection>
        )}
      </div>

      <JsonLd data={jsonLd} />
    </div>
  );
}

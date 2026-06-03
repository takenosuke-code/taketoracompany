import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { createStaticClient } from "@/utils/supabase/static";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/ProductDetail";
import ProductGallery from "@/components/ProductGallery";
import CurrencyConverter from "@/components/CurrencyConverter";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import JsonLd from "@/components/JsonLd";
import { BreadcrumbItem } from "@/types/product";
import { localeUrl, localePath, hreflang } from "@/lib/urls";

interface ProductPageProps {
  params: { category: string; product: string; locale: string };
}

const CATEGORIES: Array<{ table: "animefigure" | "pokemon" | "antique"; slug: string }> = [
  { table: "animefigure", slug: "anime-figures" },
  { table: "pokemon", slug: "pokemon" },
  { table: "antique", slug: "antique" },
];

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const results = await Promise.all(
    CATEGORIES.map(({ table }) => supabase.from(table).select("slug"))
  );

  const params: Array<{ category: string; product: string }> = [];
  results.forEach((result, idx) => {
    const category = CATEGORIES[idx].slug;
    (result.data || []).forEach((row: { slug: string | null }) => {
      if (row.slug) params.push({ category, product: row.slug });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { category, product: productSlug, locale } = params;
  const t = await getTranslations({ locale });
  const supabase = createClient();
  const isJa = locale === "ja";

  let tableName = "animefigure";
  if (category === "anime-figures") tableName = "animefigure";
  else if (category.toLowerCase() === "pokemon") tableName = "pokemon";
  else if (category === "antique") tableName = "antique";

  const { data: product } = await supabase
    .from(tableName)
    .select("*")
    .eq("slug", productSlug)
    .single();

  if (!product) {
    return { title: `${t("product.notFound")} | Taketora` };
  }

  const title = isJa
    ? `${product.name} | 京都 たけとら`
    : `${product.name} | Taketora Kyoto`;
  const description = isJa
    ? `${product.description || `京都・東山のたけとらで${product.name}をお買い求めいただけます。`}`
    : `${product.description || `Authentic ${product.name} available at Taketora in Kyoto.`}`;

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
      images: product.image_url ? [product.image_url] : [],
      type: "website",
      locale: isJa ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, product: productSlug, locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";
  const supabase = createClient();

  let tableName = "animefigure";
  if (category === "anime-figures") tableName = "animefigure";
  else if (category.toLowerCase() === "pokemon") tableName = "pokemon";
  else if (category === "antique") tableName = "antique";

  const [productResult, relatedResult] = await Promise.all([
    supabase.from(tableName).select("*").eq("slug", productSlug).single(),
    supabase
      .from(tableName)
      .select("id, slug, name, price, image_url, image")
      .neq("slug", productSlug)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const { data: product, error } = productResult;
  if (error || !product) notFound();

  const relatedProducts = (relatedResult.data || []).filter((p: any) => p.slug);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: localePath(locale) },
    {
      label:
        category === "anime-figures"
          ? t("breadcrumbs.animeFigures")
          : category === "pokemon"
          ? t("breadcrumbs.pokemon")
          : t("breadcrumbs.antique"),
      href: localePath(locale, `/${category}`),
    },
    {
      label: product.name,
      href: localePath(locale, `/${category}/${productSlug}`),
    },
  ];

  const productData = {
    id: product.id,
    slug: product.slug || productSlug,
    name: product.name,
    description: product.description || "",
    category: product.category || category,
    subcategory: product.subcategory || undefined,
    price: product.price || 0,
    currency: "JPY" as const,
    image: product.image_url || product.image || "",
    images: product.images || (product.image_url ? [product.image_url] : []),
    brand: product.brand || undefined,
    stock: product.stock || 0,
    condition: (product.condition || "New") as "New" | "Used" | "Mint",
    copyrightSticker: product.copyright_sticker || false,
    originalBox: product.original_box || false,
    dimensions:
      typeof product.dimensions === "string"
        ? JSON.parse(product.dimensions)
        : product.dimensions || undefined,
    weight: product.weight || undefined,
    tags: product.tags || [],
    instock: product.instock === true,
    in_stock:
      product.in_stock === true ||
      product.is_in_stock === true ||
      product.available === true ||
      product.is_available === true,
    is_in_stock: product.is_in_stock === true,
    available: product.available === true,
    is_available: product.is_available === true,
  };

  const isAvailable =
    product.instock === true ||
    product.in_stock === true ||
    product.is_in_stock === true ||
    product.available === true ||
    product.is_available === true;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: product.image_url || product.image || "",
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: localeUrl(locale, `/${category}/${productSlug}`),
      price: product.price || 0,
      priceCurrency: "JPY",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: product.condition
        ? `https://schema.org/${product.condition}Condition`
        : "https://schema.org/NewCondition",
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
              images={Array.from(
                new Set(
                  [
                    product.image_url,
                    product.image,
                    ...(Array.isArray(product.images) ? product.images : []),
                  ].filter((u): u is string => typeof u === "string" && u.length > 0)
                )
              )}
              productName={product.name}
              isJa={isJa}
            />
          </ScrollRevealSection>

          {/* Product Details */}
          <ScrollRevealSection variant="fade-left" delay={200}>
            <div className="space-y-5 sm:space-y-6">
              {/* Category badge */}
              {product.category && (
                <span className="badge-gold">
                  {product.category
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              )}

              {/* Product name */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F2E8DC] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <p className="text-base sm:text-lg text-[#F2E8DC]/60 font-light">
                  {t("product.brand")}:{" "}
                  <span className="text-[#F2E8DC]/90 font-medium">{product.brand}</span>
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
              <div className="flex flex-wrap gap-2.5">
                {product.original_box && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-emerald-300">
                      {t("product.originalBox")}
                    </span>
                  </div>
                )}
                {product.copyright_sticker && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-blue-300">
                      {t("product.copyrightSticker")}
                    </span>
                  </div>
                )}
                {product.condition && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                    <span className="text-xs sm:text-sm font-medium text-amber-300">
                      {t("product.condition")}: {product.condition}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock status */}
              <div className="gold-line" />
              <div>
                {isAvailable ? (
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
              <ProductDetail product={productData} locale={locale} />

              {/* Description */}
              {product.description && (
                <div className="glass-card p-5 sm:p-6 space-y-3">
                  <h2 className="text-lg sm:text-xl font-serif text-[#D4AF37] tracking-wide">
                    {t("product.description")}
                  </h2>
                  <p className="text-sm sm:text-base text-[#F2E8DC]/75 leading-relaxed whitespace-pre-line font-light">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {(product.dimensions || product.weight) && (
                <div className="glass-card p-5 sm:p-6 space-y-3">
                  <h2 className="text-lg sm:text-xl font-serif text-[#D4AF37] tracking-wide">
                    {t("product.specifications")}
                  </h2>
                  <dl className="grid grid-cols-2 gap-4">
                    {product.dimensions &&
                      (() => {
                        const dims =
                          typeof product.dimensions === "string"
                            ? JSON.parse(product.dimensions)
                            : product.dimensions;
                        return dims ? (
                          <>
                            <dt className="text-xs sm:text-sm font-medium text-[#F2E8DC]/50">
                              {t("product.dimensions")}
                            </dt>
                            <dd className="text-xs sm:text-sm text-[#F2E8DC]/80">
                              {dims.height} × {dims.width} × {dims.depth}{" "}
                              {dims.unit || "cm"}
                            </dd>
                          </>
                        ) : null;
                      })()}
                    {product.weight && (
                      <>
                        <dt className="text-xs sm:text-sm font-medium text-[#F2E8DC]/50">
                          {t("product.weight")}
                        </dt>
                        <dd className="text-xs sm:text-sm text-[#F2E8DC]/80">
                          {product.weight}g
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, idx: number) => (
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
            <section className="mt-16 sm:mt-20 lg:mt-24" aria-labelledby="related-products-heading">
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
                {relatedProducts.map((p: any) => {
                  const img = p.image_url || p.image;
                  return (
                    <Link
                      key={p.id}
                      href={`/${category}/${p.slug}`}
                      className="product-card group glass-card block overflow-hidden"
                    >
                      <div className="aspect-square w-full relative bg-gradient-to-br from-stone-800/30 to-stone-900/30 overflow-hidden">
                        {img ? (
                          <Image
                            src={img}
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
                  );
                })}
              </div>
            </section>
          </ScrollRevealSection>
        )}
      </div>

      <JsonLd data={jsonLd} />
    </div>
  );
}

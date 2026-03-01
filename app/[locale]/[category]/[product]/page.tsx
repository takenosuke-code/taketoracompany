import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/ProductDetail";
import CurrencyConverter from "@/components/CurrencyConverter";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import { BreadcrumbItem } from "@/types/product";

const BASE_URL = "https://taketora-antique.com";

interface ProductPageProps {
  params: { category: string; product: string; locale: string };
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
      canonical: `${BASE_URL}/${locale}/${category}/${productSlug}`,
      languages: {
        ja: `${BASE_URL}/ja/${category}/${productSlug}`,
        en: `${BASE_URL}/en/${category}/${productSlug}`,
      },
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

  const { data: product, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("slug", productSlug)
    .single();

  if (error || !product) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: `/${locale}` },
    {
      label:
        category === "anime-figures"
          ? t("breadcrumbs.animeFigures")
          : category === "pokemon"
          ? t("breadcrumbs.pokemon")
          : t("breadcrumbs.antique"),
      href: `/${locale}/${category}`,
    },
    {
      label: product.name,
      href: `/${locale}/${category}/${productSlug}`,
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mt-4 sm:mt-8">
          {/* Product Images */}
          <ScrollRevealSection variant="fade-right">
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square w-full glass-card overflow-hidden group">
                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-lg z-10" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-lg z-10" />

                {product.image_url || product.image ? (
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
                    <Image
                      src={product.image_url || product.image}
                      alt={
                        isJa
                          ? `京都たけとら - ${product.name}`
                          : `${product.name} at Taketora Kyoto`
                      }
                      width={1000}
                      height={1000}
                      className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#F2E8DC]/30 text-sm">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail grid */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {product.images.slice(0, 4).map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-square glass-card overflow-hidden group/thumb cursor-pointer hover:border-amber-600/40 transition-all duration-300"
                    >
                      <Image
                        src={img}
                        alt={
                          isJa
                            ? `${product.name} - 画像 ${idx + 1}`
                            : `${product.name} - View ${idx + 1}`
                        }
                        fill
                        className="object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                        sizes="12.5vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
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

              {/* Add to cart */}
              <ProductDetail product={productData} />

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
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

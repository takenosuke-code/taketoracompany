import { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import { BreadcrumbItem } from "@/types/product";

const BASE_URL = "https://taketora-antique.com";

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
      canonical: `${BASE_URL}/${locale}/antique`,
      languages: {
        ja: `${BASE_URL}/ja/antique`,
        en: `${BASE_URL}/en/antique`,
        "x-default": `${BASE_URL}/ja/antique`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/antique`,
      siteName: locale === "ja" ? "たけとら Taketora" : "Taketora",
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function AntiquePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("antique")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching antique products:", error);
  }

  const groupedProducts: Record<string, typeof products> = {};
  const productsWithoutSubcategory: typeof products = [];

  if (products) {
    products.forEach((product: any) => {
      const category =
        product.category || product.sub_category || product.subcategory;
      if (category) {
        if (!groupedProducts[category]) {
          groupedProducts[category] = [];
        }
        groupedProducts[category].push(product);
      } else {
        productsWithoutSubcategory.push(product);
      }
    });
  }

  const formatSubcategoryName = (slug: string): string => {
    return slug
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: `/${locale}` },
    { label: t("breadcrumbs.antique"), href: `/${locale}/antique` },
  ];

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbs.home"),
        item: `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbs.antique"),
        item: `${BASE_URL}/${locale}/antique`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-stone-950 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Background with image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/wafustyle.png"
          alt={
            isJa
              ? "和風スタイル背景 - 京都たけとら"
              : "Japanese style background - Taketora Kyoto"
          }
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/60 to-stone-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <ScrollRevealSection variant="fade-up">
          <div className="mb-10 sm:mb-14 text-center relative">
            {/* Decorative dividers */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="mx-4 text-amber-400/30 text-xl">◆</div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient-gold mb-4 sm:mb-6 tracking-wide">
              {isJa ? t("antiques.pageTitle") : t("antiques.pageSubtitle")}
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F2E8DC]/80 mb-4 sm:mb-6 tracking-wide">
              {isJa ? t("antiques.pageSubtitle") : t("antiques.pageTitle")}
            </h2>
            <p className="text-[#F2E8DC]/65 text-sm sm:text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed italic">
              {t("antiques.pageDescription")}
            </p>

            <div className="flex items-center justify-center mt-6">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="mx-4 text-amber-400/30 text-xl">◆</div>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            </div>
          </div>
        </ScrollRevealSection>

        {products && products.length > 0 ? (
          <div className="space-y-12 sm:space-y-16">
            {Object.entries(groupedProducts)
              .sort(([a], [b]) => {
                if (a.toLowerCase() === "popular") return -1;
                if (b.toLowerCase() === "popular") return 1;
                return a.localeCompare(b);
              })
              .map(([subCategorySlug, subCategoryProducts]) => {
                if (!subCategoryProducts || subCategoryProducts.length === 0)
                  return null;
                const subCategoryName =
                  formatSubcategoryName(subCategorySlug);

                return (
                  <ScrollRevealSection key={subCategorySlug} variant="fade-up">
                    <div className="space-y-5 sm:space-y-6">
                      <div className="border-b border-amber-800/30 pb-3 sm:pb-4">
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide pl-4 sm:pl-6">
                          {subCategoryName}
                        </h2>
                        <div className="text-[#F2E8DC]/50 text-sm font-light mt-1 pl-4 sm:pl-6 italic">
                          <span>{subCategoryProducts.length}</span>{" "}
                          <span>
                            {isJa
                              ? t("product.pieces")
                              : subCategoryProducts.length === 1
                              ? "piece"
                              : "pieces"}{" "}
                            {t("product.available")}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                        {subCategoryProducts.map((product: any) => {
                          const productUrl = product.slug
                            ? `/antique/${product.slug}`
                            : "#";
                          return (
                            <Link
                              key={product.id}
                              href={productUrl}
                              className="product-card group block overflow-hidden bg-stone-900/40 backdrop-blur-sm border border-amber-800/20 rounded-xl hover:border-amber-600/40 transition-all duration-500"
                            >
                              <div className="aspect-[4/3] w-full relative overflow-hidden">
                                {product.image_url || product.image ? (
                                  <Image
                                    src={product.image_url || product.image}
                                    alt={
                                      isJa
                                        ? `京都たけとら - ${product.name}`
                                        : `${product.name} - Taketora Kyoto`
                                    }
                                    fill
                                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/20">
                                    <span className="text-xs italic">
                                      No Image
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 sm:p-5 lg:p-6 space-y-2.5">
                                <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                                  {product.name}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-[#F2E8DC]/55 font-light line-clamp-2 leading-relaxed italic">
                                  {product.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  {product.instock === true ||
                                  product.in_stock === true ||
                                  product.stock > 0 ? (
                                    <span className="text-[10px] sm:text-xs text-amber-300 font-light px-2 py-0.5 bg-amber-400/5 rounded border border-amber-400/15">
                                      {t("product.inStock")}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] sm:text-xs text-red-400/60 font-light px-2 py-0.5 bg-red-400/5 rounded border border-red-400/15">
                                      {t("product.outOfStock")}
                                    </span>
                                  )}
                                </div>
                                <div className="pt-2 border-t border-amber-800/15 flex items-center justify-between">
                                  <p className="text-xl sm:text-2xl text-[#D4AF37] font-serif tracking-wide">
                                    ¥
                                    {typeof product.price === "number"
                                      ? product.price.toLocaleString("ja-JP")
                                      : "0"}
                                  </p>
                                  <svg className="w-4 h-4 text-[#D4AF37]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollRevealSection>
                );
              })}

            {productsWithoutSubcategory &&
              productsWithoutSubcategory.length > 0 && (
                <ScrollRevealSection variant="fade-up">
                  <div className="space-y-5 sm:space-y-6">
                    <div className="border-b border-amber-800/30 pb-3 sm:pb-4">
                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide pl-4 sm:pl-6">
                        {isJa ? "その他の骨董品" : "Other Antiques"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                      {productsWithoutSubcategory.map((product: any) => {
                        const productUrl = product.slug
                          ? `/antique/${product.slug}`
                          : "#";
                        return (
                          <Link
                            key={product.id}
                            href={productUrl}
                            className="product-card group block overflow-hidden bg-stone-900/40 backdrop-blur-sm border border-amber-800/20 rounded-xl hover:border-amber-600/40 transition-all duration-500"
                          >
                            <div className="aspect-[4/3] w-full relative overflow-hidden">
                              {product.image_url || product.image ? (
                                <Image
                                  src={product.image_url || product.image}
                                  alt={
                                    isJa
                                      ? `京都たけとら - ${product.name}`
                                      : `${product.name} - Taketora Kyoto`
                                  }
                                  fill
                                  className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/20">
                                  <span className="text-xs italic">
                                    No Image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-4 sm:p-5 lg:p-6 space-y-2.5">
                              <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                                {product.name}
                              </h3>
                              <p className="text-[11px] sm:text-xs text-[#F2E8DC]/55 font-light line-clamp-2 leading-relaxed italic">
                                {product.description}
                              </p>
                              <div className="pt-2 border-t border-amber-800/15 flex items-center justify-between">
                                <p className="text-xl sm:text-2xl text-[#D4AF37] font-serif tracking-wide">
                                  ¥
                                  {typeof product.price === "number"
                                    ? product.price.toLocaleString("ja-JP")
                                    : "0"}
                                </p>
                                <svg className="w-4 h-4 text-[#D4AF37]/40 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </ScrollRevealSection>
              )}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <p className="text-[#F2E8DC]/50 text-lg sm:text-xl font-light">
              {isJa
                ? "現在、骨董品の在庫はございません。"
                : "No antique items available at this time."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

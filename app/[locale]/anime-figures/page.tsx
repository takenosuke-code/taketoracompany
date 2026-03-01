import { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ScrollRevealSection from "@/components/ScrollRevealSection";

const BASE_URL = "https://taketora-antique.com";

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
      canonical: `${BASE_URL}/${locale}/anime-figures`,
      languages: {
        ja: `${BASE_URL}/ja/anime-figures`,
        en: `${BASE_URL}/en/anime-figures`,
        "x-default": `${BASE_URL}/ja/anime-figures`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/anime-figures`,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function AnimeFiguresPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("animefigure")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching anime figures:", error);
  }

  const groupedProducts: Record<string, typeof products> = {};
  const productsWithoutCategory: typeof products = [];

  if (products) {
    products.forEach((product: any) => {
      const category = product.category || product.sub_category || product.subcategory;
      if (category) {
        if (!groupedProducts[category]) groupedProducts[category] = [];
        groupedProducts[category].push(product);
      } else {
        productsWithoutCategory.push(product);
      }
    });
  }

  const formatCategoryName = (name: string): string => {
    if (!name || name === "other") return isJa ? "その他" : "Other";
    return name
      .split(/[-_\s]/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
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
        {/* Page Header */}
        <ScrollRevealSection variant="fade-up">
          <div className="mb-10 sm:mb-14 text-center">
            <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
              {isJa ? "Anime Figures" : "Anime Figures"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient-gold mb-4 tracking-wide">
              {t("animeFigures.pageTitle")}
            </h1>
            <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          </div>
        </ScrollRevealSection>

        {products && products.length > 0 ? (
          <div className="space-y-10 sm:space-y-14">
            {Object.entries(groupedProducts)
              .sort(([a], [b]) => {
                if (a.toLowerCase() === "popular") return -1;
                if (b.toLowerCase() === "popular") return 1;
                return a.localeCompare(b);
              })
              .map(([categorySlug, categoryProducts]) => {
                if (!categoryProducts || categoryProducts.length === 0) return null;
                return (
                  <ScrollRevealSection key={categorySlug} variant="fade-up">
                    <div className="space-y-5 sm:space-y-6">
                      <div className="border-b border-amber-900/30 pb-3">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                          {formatCategoryName(categorySlug)}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#F2E8DC]/50 mt-1 font-light">
                          {categoryProducts.length}{" "}
                          {isJa
                            ? t("product.pieces")
                            : categoryProducts.length === 1
                            ? "product"
                            : "products"}{" "}
                          {t("product.available")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                        {categoryProducts.map((product: any) => {
                          const productUrl = product.slug ? `/anime-figures/${product.slug}` : "#";
                          return (
                            <Link
                              key={product.id}
                              href={productUrl}
                              className="product-card group glass-card block overflow-hidden"
                            >
                              <div className="aspect-[4/3] w-full relative bg-gradient-to-br from-stone-800/30 to-stone-900/30 overflow-hidden">
                                {product.image_url || product.image ? (
                                  <Image
                                    src={product.image_url || product.image}
                                    alt={
                                      isJa
                                        ? `京都たけとら - ${product.name} アニメフィギュア`
                                        : `${product.name} - Anime figure at Taketora Kyoto`
                                    }
                                    fill
                                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/20">
                                    <span className="text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 sm:p-5 space-y-2.5">
                                <h3 className="font-serif text-base sm:text-lg text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                                  {product.name}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-[#F2E8DC]/55 font-light line-clamp-2 leading-relaxed">
                                  {product.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  {product.instock === true || product.in_stock === true || product.stock > 0 ? (
                                    <span className="text-[10px] sm:text-xs text-amber-400 font-light px-2 py-0.5 bg-amber-400/5 rounded border border-amber-400/15">
                                      {t("product.inStock")}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] sm:text-xs text-red-400/60 font-light px-2 py-0.5 bg-red-400/5 rounded border border-red-400/15">
                                      {t("product.outOfStock")}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <p className="text-lg sm:text-xl text-[#D4AF37] font-serif tracking-wide">
                                    ¥{product.price?.toLocaleString("ja-JP") || "0"}
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

            {productsWithoutCategory.length > 0 && (
              <ScrollRevealSection variant="fade-up">
                <div className="space-y-5 sm:space-y-6">
                  <div className="border-b border-amber-900/30 pb-3">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                      {isJa ? "その他" : "Other Products"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {productsWithoutCategory.map((product: any) => {
                      const productUrl = product.slug ? `/anime-figures/${product.slug}` : "#";
                      return (
                        <Link
                          key={product.id}
                          href={productUrl}
                          className="product-card group glass-card block overflow-hidden"
                        >
                          <div className="aspect-[4/3] w-full relative bg-gradient-to-br from-stone-800/30 to-stone-900/30 overflow-hidden">
                            {product.image_url || product.image ? (
                              <Image
                                src={product.image_url || product.image}
                                alt={
                                  isJa
                                    ? `京都たけとら - ${product.name}`
                                    : `${product.name} at Taketora Kyoto`
                                }
                                fill
                                className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/20">
                                <span className="text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 sm:p-5 space-y-2.5">
                            <h3 className="font-serif text-base sm:text-lg text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between pt-1">
                              <p className="text-lg sm:text-xl text-[#D4AF37] font-serif tracking-wide">
                                ¥{product.price?.toLocaleString("ja-JP") || "0"}
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
              {t("animeFigures.noProducts")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

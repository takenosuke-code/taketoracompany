import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/ProductDetail";
import ProductGallery from "@/components/ProductGallery";
import CurrencyConverter from "@/components/CurrencyConverter";
import ProductShelf, { formatYen } from "@/components/ProductShelf";
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

  // 商品の情報（taketora_app の商品マスタの属性）
  const specs: Array<{ label: string; value: string }> = [];
  if (product.series) specs.push({ label: t("product.series"), value: product.series });
  if (product.character) specs.push({ label: t("product.character"), value: product.character });
  if (product.maker) specs.push({ label: t("product.maker"), value: product.maker });
  if (product.conditionRank)
    specs.push({ label: t("product.condition"), value: product.conditionRank });
  specs.push({ label: t("product.code"), value: product.slug });

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
    <div className="mx-auto max-w-shop px-4 pb-36 pt-5 sm:px-6 md:pb-20">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <ProductGallery
          images={product.imageUrl ? [product.imageUrl] : []}
          productName={product.name}
          isJa={isJa}
        />

        <div className="space-y-6">
          <div>
            <p className="text-[14px] font-bold text-ink-soft">
              {product.series || t("product.categoryName")}
            </p>
            <h1 className="mt-1 text-[26px] font-black leading-[1.4] sm:text-[32px]">{product.name}</h1>
          </div>

          <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
            <p className="text-[40px] font-black leading-none">{formatYen(product.price)}</p>
            <p className="pb-1 text-[15px] font-bold">
              {available ? (
                <span>{t("product.inStock")}</span>
              ) : (
                <span className="rounded-sm bg-ink px-2 py-0.5 text-white">{t("product.soldOut")}</span>
              )}
              {product.conditionRank && (
                <span className="ml-4 text-ink-soft">
                  {t("product.condition")} {product.conditionRank}
                </span>
              )}
            </p>
          </div>

          <CurrencyConverter
            amountJPY={product.price ?? 0}
            label={t("product.approx")}
            note={t("product.approxNote")}
          />

          <ProductDetail locale={locale} />

          <section aria-labelledby="specs">
            <h2 id="specs" className="text-[18px] font-black">
              {t("product.specs")}
            </h2>
            <dl className="mt-3 border-t border-line text-[15px]">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-2.5">
                  <dt className="font-bold text-ink-soft">{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20" aria-labelledby="related">
          <h2 id="related" className="text-[24px] font-black">
            {t("product.related")}
          </h2>
          <div className="mt-6">
            <ProductShelf products={relatedProducts} locale={locale} category={category} wide={false} />
          </div>
        </section>
      )}

      <JsonLd data={jsonLd} />
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetail from "@/components/ProductDetail";
import ProductGallery from "@/components/ProductGallery";
import CurrencyConverter from "@/components/CurrencyConverter";
import ProductGrid, { formatYen } from "@/components/ProductGrid";
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

  // 商品情報（taketora_app の商品マスタの属性）
  const specs: Array<{ label: string; value: React.ReactNode }> = [];
  specs.push({
    label: t("product.price"),
    value: (
      <>
        <span className="text-[26px] font-black leading-none text-tag">{formatYen(product.price)}</span>
        <CurrencyConverter amountJPY={product.price ?? 0} note={t("product.approxNote")} />
      </>
    ),
  });
  if (product.conditionRank) specs.push({ label: t("product.condition"), value: product.conditionRank });
  specs.push({
    label: t("product.stock"),
    value: available ? t("product.inStock") : t("product.soldOut"),
  });
  if (product.series) specs.push({ label: t("product.series"), value: product.series });
  if (product.character) specs.push({ label: t("product.character"), value: product.character });
  if (product.maker) specs.push({ label: t("product.maker"), value: product.maker });
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
    <div className="mx-auto max-w-site px-4 pt-4 sm:px-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 grid gap-8 md:grid-cols-[440px_1fr]">
        <ProductGallery
          images={product.imageUrl ? [product.imageUrl] : []}
          productName={product.name}
          isJa={isJa}
        />

        <div>
          <h1 className="text-[20px] font-black leading-snug sm:text-[24px]">{product.name}</h1>
          <table className="mt-4 w-full border-collapse border border-line bg-white text-[14px]">
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="w-[7.5rem] bg-mist px-3 py-2.5 text-left align-top font-bold">
                    {spec.label}
                  </th>
                  <td className="px-3 py-2.5">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5">
            <ProductDetail locale={locale} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-14" aria-labelledby="related">
          <h2 id="related" className="bar-title">
            {t("product.related")}
          </h2>
          <div className="mt-5">
            <ProductGrid products={relatedProducts} locale={locale} category={category} cols={4} />
          </div>
        </section>
      )}

      <JsonLd data={jsonLd} />
    </div>
  );
}

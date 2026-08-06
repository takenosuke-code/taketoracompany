import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cinzel_Decorative, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import { locales } from "@/i18n/request";
import { localeUrl, hreflang } from "@/lib/urls";
import { SHOPS, OPENING_HOURS } from "@/lib/shops";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import LoadingScreen from "@/components/LoadingScreen";
import JsonLd from "@/components/JsonLd";
import "../globals.css";

const cinzel = Cinzel_Decorative({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const notoSans = Noto_Sans_JP({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto",
});

const notoSerif = Noto_Serif_JP({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const BASE_URL = "https://taketora-antique.com";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  const isJa = locale === "ja";
  const ogLocale = isJa ? "ja_JP" : "en_US";
  const altLocale = isJa ? "en_US" : "ja_JP";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: localeUrl(locale),
      languages: hreflang(),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: localeUrl(locale),
      siteName: isJa ? "たけとら Taketora" : "Taketora",
      locale: ogLocale,
      alternateLocale: altLocale,
      // Note: og:image / twitter:image are provided automatically by the
      // app/[locale]/opengraph-image.tsx file convention (1200x630, per-locale).
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    verification: {
      google: "8zntccVng7Q4n68XbjNCn5jlx5jAubcc34fw60OrJnc",
    },
    other: {
      "google-site-verification":
        "8zntccVng7Q4n68XbjNCn5jlx5jAubcc34fw60OrJnc",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// JSON-LD Structured Data: Organization + 各店舗の AntiqueStore ノード（@graph）
// 店舗情報は lib/shops.ts の店舗マスタから生成する。
function getStructuredData(locale: string) {
  const isJa = locale === "ja";
  const orgId = `${BASE_URL}/#organization`;

  const shopNodes = SHOPS.map((shop) => ({
    "@type": "AntiqueStore",
    "@id": `${BASE_URL}/#shop-${shop.id}`,
    name: isJa ? shop.nameJa : shop.nameEn,
    parentOrganization: { "@id": orgId },
    branchOf: { "@id": orgId },
    url: localeUrl(locale, "/visit"),
    image: localeUrl(locale, "/opengraph-image"),
    hasMap: shop.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: isJa ? shop.streetAddressJa : shop.streetAddressEn,
      addressLocality: isJa ? shop.addressLocalityJa : shop.addressLocalityEn,
      addressRegion: isJa ? "京都府" : "Kyoto",
      postalCode: shop.postalCode,
      addressCountry: "JP",
    },
    ...(shop.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: shop.geo.latitude,
        longitude: shop.geo.longitude,
      },
    }),
    // TODO(店舗確認): telephone は各店舗の電話番号が確認でき次第、店舗マスタ経由で追加する
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: OPENING_HOURS.opens,
      closes: OPENING_HOURS.closes,
    },
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    paymentAccepted: "Cash, Credit Card",
    knowsLanguage: ["ja", "en"],
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "たけとら (Taketora)",
        alternateName: [
          "Taketora",
          "Taketora Antiques",
          "たけとら",
          "たけとら アンティークショップ",
          "Taketora Antique Shop Kyoto",
        ],
        url: BASE_URL,
        logo: `${BASE_URL}/assets/taketora_logo.png`,
        image: localeUrl(locale, "/opengraph-image"),
        description: isJa
          ? "京都に3店舗（高台寺・清水寺・亀屋町）を構えるアンティークショップ。骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選コレクションを販売。"
          : "Antique shop with three locations in Kyoto — Kodaiji, Kiyomizu and Kameyacho. Japanese antiques, traditional crafts, anime figures & Pokémon cards.",
        subOrganization: SHOPS.map((shop) => ({
          "@id": `${BASE_URL}/#shop-${shop.id}`,
        })),
        areaServed: {
          "@type": "City",
          name: "Kyoto",
        },
        sameAs: ["https://www.instagram.com/taketora_antiques/"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isJa ? "たけとらコレクション" : "Taketora Collection",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: isJa ? "骨董品・アンティーク" : "Japanese Antiques",
            },
            {
              "@type": "OfferCatalog",
              name: isJa ? "アニメフィギュア" : "Anime Figures",
            },
            {
              "@type": "OfferCatalog",
              name: isJa ? "ポケモンカード" : "Pokémon Cards",
            },
            {
              "@type": "OfferCatalog",
              name: isJa ? "古道具・古民具" : "Folk Crafts & Vintage Items",
            },
          ],
        },
      },
      ...shopNodes,
    ],
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const structuredData = getStructuredData(locale);

  return (
    <html lang={locale}>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>

      <body
        className={`${cinzel.variable} ${notoSans.variable} ${notoSerif.variable} font-sans antialiased bg-stone-950`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Structured Data */}
          <JsonLd data={structuredData} />

          {/* Loading Screen (first visit only) */}
          <LoadingScreen />

          {/* Navigation */}
          <Navigation locale={locale} />

          {/* Main Content */}
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

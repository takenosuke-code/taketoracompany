import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cinzel_Decorative, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import { locales } from "@/i18n/request";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import LoadingScreen from "@/components/LoadingScreen";
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
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ja: `${BASE_URL}/ja`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/ja`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `${BASE_URL}/${locale}`,
      siteName: isJa ? "たけとら Taketora" : "Taketora",
      locale: ogLocale,
      alternateLocale: altLocale,
      images: [
        {
          url: `${BASE_URL}/og-image-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: isJa
            ? "京都・東山のアンティークショップ たけとら"
            : "Taketora Antique Shop in Kyoto Higashiyama",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${BASE_URL}/og-image-${locale}.jpg`],
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

// JSON-LD Structured Data for AntiqueStore
function getStructuredData(locale: string) {
  const isJa = locale === "ja";
  return {
    "@context": "https://schema.org",
    "@type": "AntiqueStore",
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
    image: `${BASE_URL}/og-image-ja.jpg`,
    description: isJa
      ? "京都・東山のアンティークショップ。骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選コレクションを販売。"
      : "Authentic antique shop in Kyoto's Higashiyama district. Japanese antiques, traditional crafts, anime figures & Pokémon cards.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "五条橋東6丁目539-49",
      addressLocality: "京都市東山区",
      addressRegion: "京都府",
      postalCode: "605-0848",
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.9948,
      longitude: 135.7738,
    },
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
      opens: "10:00",
      closes: "20:00",
    },
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    paymentAccepted: "Cash, Credit Card",
    knowsLanguage: ["ja", "en"],
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />

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

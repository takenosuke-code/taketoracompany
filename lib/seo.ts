import type { Metadata } from "next";

const BASE_URL = "https://taketora-antique.com";

export const PAGE_META = {
  home: {
    ja: {
      title: "たけとら（Taketora）｜京都・東山のアンティークショップ - 骨董品・古道具・コレクティブル",
      description:
        "京都・東山区五条坂のアンティークショップ「たけとら」。骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選コレクションを販売。清水寺エリア。営業時間10:00〜20:00、英語対応可。",
    },
    en: {
      title: "Taketora｜Antique Shop in Kyoto Higashiyama - Japanese Antiques & Collectibles",
      description:
        "Authentic antique shop in Kyoto's Higashiyama district near Kiyomizu-dera. Japanese antiques, traditional crafts, anime figures & Pokemon cards. Open daily 10AM-8PM. English spoken.",
    },
  },
  antique: {
    ja: {
      title: "京都の骨董品・古美術コレクション｜たけとら アンティークショップ 東山",
      description:
        "京都・東山で本物の骨董品・古美術品をお探しなら「たけとら」。陶磁器、茶道具、掛け軸、古民具など、日本の伝統工芸品を五条坂の店舗で販売。",
    },
    en: {
      title: "Japanese Antiques & Traditional Crafts｜Taketora Kyoto Higashiyama",
      description:
        "Discover authentic Japanese antiques in Kyoto. Ceramics, tea ceremony tools, scrolls, and folk crafts. Each piece hand-selected from Kyoto and surrounding regions. Visit us on Gojo-zaka.",
    },
  },
  anime: {
    ja: {
      title: "アニメフィギュア販売｜京都 たけとら - 正規品・限定品取り扱い",
      description:
        "京都・東山のたけとらで本物のアニメフィギュアを。日本国内正規品、限定版、プレミアムコレクティブルを店舗販売。元箱付き・品質保証。",
    },
    en: {
      title: "Anime Figures in Kyoto｜Taketora - Authentic Japanese Collectibles",
      description:
        "Buy authentic anime figures in Kyoto's Higashiyama. Premium collectibles from popular series, limited editions, original packaging. Direct from Japan.",
    },
  },
  pokemon: {
    ja: {
      title: "ポケモンカード販売｜京都 たけとら - シールド品・レアカード取り扱い",
      description:
        "京都・東山のたけとらでポケモンカードを購入。シールド済みブースターボックス、レアカード、日本限定商品を取り揃え。",
    },
    en: {
      title: "Pokemon Cards in Kyoto｜Taketora - Sealed Boxes & Rare Cards",
      description:
        "Buy Japanese Pokemon cards in Kyoto. Sealed booster boxes, rare cards, Japan-exclusive products. Visit Taketora in Higashiyama, near Kiyomizu-dera.",
    },
  },
  collection: {
    ja: {
      title: "全商品一覧｜京都 たけとら - 骨董品・フィギュア・ポケモンカード",
      description:
        "京都・東山のアンティークショップたけとらの全商品。骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選アイテム。",
    },
    en: {
      title: "All Items｜Taketora Kyoto - Antiques, Figures & Pokemon Cards",
      description:
        "Browse Taketora's full collection. Japanese antiques, anime figures, Pokemon cards and more at our Kyoto Higashiyama shop.",
    },
  },
  visit: {
    ja: {
      title: "アクセス・営業時間｜京都・東山 たけとら アンティークショップ 五条坂",
      description:
        "京都・東山区五条坂のアンティークショップたけとらへのアクセス。清水五条駅から徒歩圏内。営業時間10:00-20:00、年中無休。英語対応可。",
    },
    en: {
      title: "Visit Us｜Taketora Antique Shop - Kyoto Higashiyama, Gojo-zaka",
      description:
        "Find Taketora antique shop in Kyoto's Higashiyama, near Kiyomizu-dera temple on Gojo-zaka slope. Open daily 10AM-8PM. English & Japanese spoken. Map & directions.",
    },
  },
  blog: {
    ja: {
      title: "ブログ｜京都 たけとら - 骨董品・アンティーク・コレクティブル情報",
      description:
        "京都のアンティークショップたけとらのブログ。骨董品の知識、新入荷情報、京都のアンティーク文化について。",
    },
    en: {
      title: "Blog｜Taketora Kyoto - Antiques, Collectibles & Japanese Culture",
      description:
        "Stories from Taketora antique shop in Kyoto. Discover Japanese antique culture, new arrivals, and collecting tips.",
    },
  },
} as const;

export function buildLocaleMetadata(args: {
  locale: "ja" | "en";
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, path, title, description } = args;
  const cleanPath = path ? `/${path}` : "";
  const jaPath = `/ja${cleanPath}`;
  const enPath = `/en${cleanPath}`;
  const canonical = `${BASE_URL}/${locale}${cleanPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ja: `${BASE_URL}${jaPath}`,
        en: `${BASE_URL}${enPath}`,
        "x-default": `${BASE_URL}/ja${cleanPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "たけとら Taketora",
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? "en_US" : "ja_JP",
      images: [
        {
          url: locale === "ja" ? `${BASE_URL}/og-image-ja.jpg` : `${BASE_URL}/og-image-en.jpg`,
          width: 1200,
          height: 630,
          alt:
            locale === "ja"
              ? "京都・東山のアンティークショップ たけとら"
              : "Taketora antique shop in Kyoto Higashiyama",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [locale === "ja" ? `${BASE_URL}/og-image-ja.jpg` : `${BASE_URL}/og-image-en.jpg`],
    },
  };
}

export function buildBreadcrumbJsonLd(locale: "ja" | "en", items: Array<{ nameJa: string; nameEn: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: locale === "ja" ? item.nameJa : item.nameEn,
      item: `${BASE_URL}/${locale}${item.path}`,
    })),
  };
}

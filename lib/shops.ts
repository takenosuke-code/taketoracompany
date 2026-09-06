// 店舗マスタ — 店舗名・住所・マップリンクはサイト全体でこのファイルだけを参照する。
// 他のファイル（JSON-LD・messages・manifest など）に住所をベタ書きしないこと。
//
// TODO(店舗確認): 住所・徒歩時間は既存サイトの visit ページ定義から移設したもの。
// 正式な表記・徒歩時間は店舗側に確認すること。

export type ShopId = "kodaiji" | "kiyomizu" | "shichijo";

export interface Shop {
  id: ShopId;
  nameJa: string;
  nameEn: string;
  /** 表示用の1行住所 */
  addressJa: string;
  addressEn: string;
  /** JSON-LD の PostalAddress 用に分解した住所 */
  postalCode: string;
  streetAddressJa: string;
  streetAddressEn: string;
  addressLocalityJa: string;
  addressLocalityEn: string;
  /**
   * Googleマップへのリンク。空文字にしないこと（リンク切れ防止）。
   * 高台寺店のみ公式の共有リンク。
   * TODO(店舗確認): 清水寺店・七条店は Google ビジネスプロフィールの
   * 共有リンクが取得でき次第、検索URLから差し替える。
   */
  mapsUrl: string;
  /**
   * 検証できた座標のみ設定する（高台寺店は公式共有リンクの解決先から取得）。
   * TODO(店舗確認): 清水寺店・七条店の座標は未検証のため未設定。
   */
  geo?: { latitude: number; longitude: number };
  walkMinsFromKiyomizu: number;
  // TODO(店舗確認): 電話番号が確認でき次第 telephone フィールドを追加し、
  // JSON-LD（app/[locale]/layout.tsx）にも反映する。
}

/**
 * 営業時間。JSON-LD と表示文言の両方でこの値を前提にしている。
 * TODO(店舗確認): 10:00〜20:00・年中無休は要確認（店舗ごとに異なる可能性あり）。
 */
export const OPENING_HOURS = { opens: "10:00", closes: "20:00" } as const;

/** 住所からGoogleマップの検索URLを組み立てる（公式リンクが無い店舗のフォールバック） */
export function mapsSearchUrl(shop: Shop, locale = "en"): string {
  const isJa = locale === "ja";
  const query = `${isJa ? shop.nameJa : shop.nameEn} ${isJa ? shop.addressJa : shop.addressEn}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** mapsUrl が万一空でもリンク切れにならないためのフォールバック付きゲッター */
export function directionsUrl(shop: Shop, locale = "en"): string {
  return shop.mapsUrl || mapsSearchUrl(shop, locale);
}

/** 清水寺からの徒歩時間順（近い順） */
export const SHOPS: Shop[] = [
  {
    id: "kodaiji",
    nameJa: "たけとら 高台寺店",
    nameEn: "Taketora Kodaiji",
    addressJa: "〒605-0824 京都府京都市東山区南町421-2",
    addressEn: "421-2 Minamimachi, Higashiyama Ward, Kyoto, 605-0824, Japan",
    postalCode: "605-0824",
    streetAddressJa: "南町421-2",
    streetAddressEn: "421-2 Minamimachi",
    addressLocalityJa: "京都市東山区",
    addressLocalityEn: "Higashiyama Ward, Kyoto",
    mapsUrl: "https://maps.app.goo.gl/uffSvD9BWBj35SmB6",
    // 上記共有リンクの解決先（Googleマップ掲載名「アンティークショップ猛虎 高台寺店」）から取得
    geo: { latitude: 34.9995044, longitude: 135.7786915 },
    walkMinsFromKiyomizu: 6,
  },
  {
    id: "kiyomizu",
    nameJa: "たけとら 清水寺店",
    nameEn: "Taketora Kiyomizu",
    addressJa: "〒605-0848 京都府京都市東山区五条橋東6丁目539-49",
    addressEn: "6 Chome-539-49 Gojobashihigashi, Higashiyama Ward, Kyoto, 605-0848, Japan",
    postalCode: "605-0848",
    streetAddressJa: "五条橋東6丁目539-49",
    streetAddressEn: "6 Chome-539-49 Gojobashihigashi",
    addressLocalityJa: "京都市東山区",
    addressLocalityEn: "Higashiyama Ward, Kyoto",
    // TODO(店舗確認): 公式の共有リンク取得後に差し替え（現状は住所検索URL）
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Taketora%20Kiyomizu%206%20Chome-539-49%20Gojobashihigashi%2C%20Higashiyama%20Ward%2C%20Kyoto%2C%20605-0848%2C%20Japan",
    walkMinsFromKiyomizu: 12,
  },
  {
    id: "shichijo",
    nameJa: "たけとら 七条店",
    nameEn: "Taketora Shichijo",
    addressJa: "〒605-0981 京都府京都市東山区本町6丁目2-3",
    addressEn: "6 Chome-2-3 Honmachi, Higashiyama Ward, Kyoto, 605-0981, Japan",
    postalCode: "605-0981",
    streetAddressJa: "本町6丁目2-3",
    streetAddressEn: "6 Chome-2-3 Honmachi",
    addressLocalityJa: "京都市東山区",
    addressLocalityEn: "Higashiyama Ward, Kyoto",
    // TODO(店舗確認): 公式の共有リンク取得後に差し替え（現状は住所検索URL）
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Taketora%20Shichijo%206%20Chome-2-3%20Honmachi%2C%20Higashiyama%20Ward%2C%20Kyoto%2C%20605-0981%2C%20Japan",
    // TODO(店舗確認): 七条店（本町6丁目）までの清水寺からの徒歩時間は要確認
    walkMinsFromKiyomizu: 20,
  },
];

/** id 指定で1店舗取得（存在しない id はコンパイル時に弾かれる） */
export function getShop(id: ShopId): Shop {
  return SHOPS.find((s) => s.id === id)!;
}

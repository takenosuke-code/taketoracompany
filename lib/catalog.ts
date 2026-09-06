/**
 * 商品カタログのデータ層 — taketora_app（在庫管理アプリ）の Supabase を参照する。
 *
 * 商品マスタ: taketora_app の website_products ビュー（migration 0009_website_read.sql）。
 *             登録済み(status='registered')の商品だけが公開列のみで見える。
 * 在庫:       スマレジ（lib/smaregi.ts）。60秒キャッシュ。
 * 画像:       taketora_app の photos バケット（公開設定、同 migration）。
 *
 * 必要な環境変数:
 *   TAKETORA_SUPABASE_URL / TAKETORA_SUPABASE_ANON_KEY
 * 未設定の間は空のカタログを返す（サイトはビルド可能なまま）。
 */
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { getStockMap } from "@/lib/smaregi";

export interface CatalogProduct {
  id: string;
  /** URLスラッグ = スマレジ商品コード(EAN-13, ユニーク) */
  slug: string;
  name: string;
  character: string | null;
  series: string | null;
  maker: string | null;
  /** 状態ランク S/A/B/C（中古品） */
  conditionRank: string | null;
  price: number | null;
  imageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  /** スマレジの現在在庫。null = 在庫不明（スマレジ資格情報が未設定など） */
  stock: number | null;
}

/** アプリ登録商品はすべてこのカテゴリで表示する（店舗運用がフィギュア主体のため） */
export const CATALOG_CATEGORY = "anime-figures";

function db() {
  const url = process.env.TAKETORA_SUPABASE_URL;
  const key = process.env.TAKETORA_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function photoPublicUrl(imagePath: string | null | undefined): string | null {
  const url = process.env.TAKETORA_SUPABASE_URL;
  if (!url || !imagePath) return null;
  return `${url}/storage/v1/object/public/photos/${imagePath}`;
}

const fetchCatalog = unstable_cache(
  async (): Promise<CatalogProduct[]> => {
    const client = db();
    if (!client) return [];

    const { data, error } = await client
      .from("website_products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("taketora_app 商品取得失敗:", error.message);
      return [];
    }
    const rows = data ?? [];

    // 在庫はベストエフォート: スマレジ側の失敗でカタログ全体を落とさない
    let stockMap: Record<string, number> | null = null;
    try {
      stockMap = await getStockMap();
    } catch (e) {
      console.error("スマレジ在庫取得失敗（在庫不明として表示）:", (e as Error).message);
    }

    return rows
      .filter((r: any) => r.smaregi_product_code)
      .map((r: any): CatalogProduct => ({
        id: r.id,
        slug: r.smaregi_product_code,
        name: r.product_name,
        character: r.character ?? null,
        series: r.series ?? null,
        maker: r.maker ?? null,
        conditionRank: r.condition_rank ?? null,
        price: r.price != null ? Number(r.price) : null,
        imageUrl: photoPublicUrl(r.image_path),
        createdAt: r.created_at ?? null,
        updatedAt: r.updated_at ?? null,
        stock:
          stockMap && r.smaregi_product_id != null
            ? stockMap[String(r.smaregi_product_id)] ?? 0
            : null,
      }));
  },
  ["taketora-catalog"],
  { revalidate: 60 }
);

/** カテゴリ指定つき取得。現状 anime-figures 以外は常に空。 */
export async function getCatalogProducts(category?: string): Promise<CatalogProduct[]> {
  if (category && category !== CATALOG_CATEGORY) return [];
  return fetchCatalog();
}

export async function getCatalogProduct(slug: string): Promise<CatalogProduct | null> {
  const all = await fetchCatalog();
  return all.find((p) => p.slug === slug) ?? null;
}

/** 在庫不明(null)は「在庫あり」として扱う（アプリ登録商品は原則店頭にあるため） */
export function isInStock(p: CatalogProduct): boolean {
  return p.stock === null || p.stock > 0;
}

/**
 * 一覧ページの既存レンダリングコード（旧サイトDBの行の形を前提）に合わせた変換。
 * category にシリーズ名を入れることで、一覧のグループ見出しがシリーズ別になる。
 */
export function catalogToCard(p: CatalogProduct) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price ?? 0,
    image_url: p.imageUrl,
    category: p.series || null,
    description: [p.character, p.maker].filter(Boolean).join(" / "),
    instock: isInStock(p),
    stock: p.stock,
    created_at: p.createdAt,
  };
}

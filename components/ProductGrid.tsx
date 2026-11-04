import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CatalogProduct, isInStock } from "@/lib/catalog";

export function formatYen(price: number | null): string {
  return price == null ? "—" : `¥${price.toLocaleString("ja-JP")}`;
}

interface ProductGridProps {
  products: CatalogProduct[];
  locale: string;
  /** 商品ページのカテゴリ部分（/anime-figures/<slug> の anime-figures） */
  category: string;
  /** 1列あたりの最大数（広い画面） */
  cols?: 4 | 5;
}

/** 商品一覧。トレカ店の通販ページのように、写真・商品名・赤い価格を枠で並べる */
export default function ProductGrid({ products, locale, category, cols = 5 }: ProductGridProps) {
  const isJa = locale === "ja";
  const wide = cols === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <ul className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 ${wide}`}>
      {products.map((p) => {
        const inStock = isInStock(p);
        return (
          <li key={p.id}>
            <Link href={`/${category}/${p.slug}`} className="group flex h-full flex-col border border-line bg-white p-2 hover:border-ink">
              <div className="relative aspect-square bg-white">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className={`object-contain ${inStock ? "" : "opacity-40"}`}
                    sizes="(max-width: 640px) 50vw, 220px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center bg-mist text-[12px] text-ink-soft">
                    {isJa ? "写真なし" : "No photo"}
                  </span>
                )}
                {!inStock && (
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ink/85 py-1 text-center text-[13px] font-bold text-white">
                    {isJa ? "売り切れ" : "SOLD OUT"}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug group-hover:underline">{p.name}</p>
              <div className="mt-auto flex items-end justify-between gap-2 pt-1.5">
                <p className="text-[17px] font-black leading-none text-tag">{formatYen(p.price)}</p>
                {p.conditionRank && (
                  <span className="shrink-0 rounded-sm border border-ink-soft px-1 text-[11px] font-bold leading-[1.6] text-ink-soft">
                    {isJa ? `ランク${p.conditionRank}` : `Rank ${p.conditionRank}`}
                  </span>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** 商品が載っていないときの案内 */
export function EmptyNote({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="border border-line bg-mist px-5 py-7 text-center">
      <p className="text-[16px] font-bold">{title}</p>
      <p className="mt-2 text-[14px] text-ink-soft">{body}</p>
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

/** シリーズ名ごとにまとめる（シリーズ未登録は最後にまとめる） */
export function groupBySeries(products: CatalogProduct[], otherLabel: string) {
  const groups = new Map<string, CatalogProduct[]>();
  for (const p of products) {
    const key = p.series || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      if (!a) return 1;
      if (!b) return -1;
      return a.localeCompare(b, "ja");
    })
    .map(([series, items]) => ({ series: series || otherLabel, items }));
}

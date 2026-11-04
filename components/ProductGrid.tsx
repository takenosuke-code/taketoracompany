import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CatalogProduct, isInStock } from "@/lib/catalog";

export function formatYen(price: number | null): string {
  return price == null ? "—" : `${price.toLocaleString("ja-JP")}円`;
}

interface ProductGridProps {
  products: CatalogProduct[];
  locale: string;
  /** 商品ページのカテゴリ部分（/anime-figures/<slug> の anime-figures） */
  category: string;
}

/** 商品の一覧。白地の写真・商品名・価格だけの、店のサイトによくある並べ方 */
export default function ProductGrid({ products, locale, category }: ProductGridProps) {
  const isJa = locale === "ja";
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      {products.map((p) => {
        const inStock = isInStock(p);
        return (
          <li key={p.id}>
            <Link href={`/${category}/${p.slug}`} className="group block">
              <div className="relative aspect-square bg-white">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[12px] text-ink-soft">
                    {isJa ? "写真なし" : "No photo"}
                  </span>
                )}
                {!inStock && (
                  <span className="absolute left-0 top-0 bg-ink px-1.5 text-[11px] leading-[1.8] text-white">
                    {isJa ? "売り切れ" : "Sold out"}
                  </span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.6] group-hover:underline">{p.name}</p>
              <p className="text-[13px] font-bold">
                {formatYen(p.price)}
                {p.conditionRank && (
                  <span className="ml-2 text-[11px] font-normal text-ink-soft">
                    {isJa ? `ランク${p.conditionRank}` : `Rank ${p.conditionRank}`}
                  </span>
                )}
              </p>
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
    <div className="mx-auto max-w-[40rem] bg-white px-5 py-6 text-center">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-[13px] text-ink-soft">{body}</p>
      {children && <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>}
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

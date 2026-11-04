import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CatalogProduct, isInStock } from "@/lib/catalog";

interface ProductShelfProps {
  products: CatalogProduct[];
  locale: string;
  /** 商品ページのカテゴリ部分（/anime-figures/<slug> の anime-figures） */
  category: string;
  /** 4列で十分な場所（関連商品など）では false */
  wide?: boolean;
}

export function formatYen(price: number | null): string {
  return price == null ? "—" : `¥${price.toLocaleString("ja-JP")}`;
}

/**
 * 商品を棚に並べる。列の間にすき間を作らないので、同じ段の棚板が横につながる。
 * 商品名と値段は棚の縁に貼る「棚札」として下に出す。
 */
export default function ProductShelf({ products, locale, category, wide = true }: ProductShelfProps) {
  const isJa = locale === "ja";
  const cols = wide
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    : "grid-cols-2 lg:grid-cols-4";

  // 最後の段が埋まらないときは、空きスペースにも棚板だけを出して段を端までつなげる。
  // 列数は画面幅で変わるので、ブレークポイントごとに必要な数だけ表示する。
  const n = products.length;
  const gap = (c: number) => (c - (n % c)) % c;
  const steps = wide
    ? [
        { cols: 2, show: "block", hide: "hidden" },
        { cols: 3, show: "sm:block", hide: "sm:hidden" },
        { cols: 4, show: "lg:block", hide: "lg:hidden" },
        { cols: 5, show: "xl:block", hide: "xl:hidden" },
      ]
    : [
        { cols: 2, show: "block", hide: "hidden" },
        { cols: 4, show: "lg:block", hide: "lg:hidden" },
      ];
  const fillerCount = Math.max(...steps.map((st) => gap(st.cols)));
  const fillers = Array.from({ length: fillerCount }, (_, i) =>
    steps.map((st) => (i < gap(st.cols) ? st.show : st.hide)).join(" ")
  );

  return (
    <ul className={`grid ${cols} gap-y-10`}>
      {products.map((p) => {
        const inStock = isInStock(p);
        return (
          <li key={p.id}>
            <Link href={`/${category}/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5]">
                {p.imageUrl ? (
                  <div className="absolute inset-x-3 bottom-0 top-3">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className={`object-contain object-bottom ${inStock ? "" : "opacity-50"}`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-x-3 bottom-0 top-3 flex items-end justify-center pb-4 text-[13px] text-ink-soft">
                    {isJa ? "写真なし" : "No photo"}
                  </div>
                )}
              </div>
              <div className="shelf" />
              <div className="shelf-tag">
                <p className="line-clamp-2 text-[14px] font-bold leading-snug group-hover:underline">
                  {p.name}
                </p>
                <p className="mt-1 text-[18px] font-black leading-none">{formatYen(p.price)}</p>
                <p className="mt-2 flex flex-wrap gap-x-3 text-[12px] font-bold text-ink-soft">
                  {p.conditionRank && (
                    <span>{isJa ? `状態 ${p.conditionRank}` : `Condition ${p.conditionRank}`}</span>
                  )}
                  {!inStock && (
                    <span className="rounded-sm bg-ink px-1.5 text-white">
                      {isJa ? "売り切れ" : "Sold out"}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
      {fillers.map((cls, i) => (
        <li key={`filler-${i}`} aria-hidden="true" className={cls}>
          <div className="aspect-[4/5]" />
          <div className="shelf" />
        </li>
      ))}
    </ul>
  );
}

/** 商品がまだ載っていないときの棚。店内の写真があれば、文の横に置く */
export function EmptyShelf({
  title,
  body,
  photo,
  children,
}: {
  title: string;
  body: string;
  photo?: { src: string; alt: string };
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="grid items-end gap-6 md:grid-cols-[1fr_1fr]">
        <div className="px-1 pb-5">
          <p className="text-[19px] font-black leading-snug">{title}</p>
          <p className="mt-2 max-w-[32rem] text-[15px] leading-[1.9] text-ink-soft">{body}</p>
          {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
        </div>
        {photo && (
          <div className="relative aspect-[4/3] md:mx-3">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        )}
      </div>
      <div className="shelf" />
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

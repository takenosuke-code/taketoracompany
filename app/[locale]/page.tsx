import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SHOPS, directionsUrl, INSTAGRAM_URL } from "@/lib/shops";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";
import { PHOTOS, photoAlt } from "@/lib/photos";
import ProductGrid from "@/components/ProductGrid";
import PhotoSlider from "@/components/PhotoSlider";

// 商品・在庫（スマレジ）を60秒ごとに再取得
export const revalidate = 60;

export default async function Homepage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const s = await getTranslations({ locale, namespace: "shops" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const messages = (await getMessages({ locale })) as unknown as { home: { items: string[] } };
  const isJa = locale === "ja";

  // 新入荷: taketora_app（在庫管理アプリ）の商品マスタから最新8件
  const latest = (await getCatalogProducts()).slice(0, 8);

  const slides = [
    PHOTOS.potteryAndFigures,
    PHOTOS.aisle,
    PHOTOS.potteryShelves,
    PHOTOS.figureWall,
    PHOTOS.windowShelf,
  ].map((p) => ({ src: p.src, alt: photoAlt(p, locale) }));

  // サイドの写真つきバナー
  const banners = [
    { href: "/anime-figures" as const, label: nav("animeFigures"), photo: PHOTOS.figureRows },
    { href: "/pokemon" as const, label: nav("pokemon"), photo: PHOTOS.pokemonShelf },
    { href: "/antique" as const, label: nav("antiques"), photo: PHOTOS.potteryShelves },
  ];

  return (
    <>
      <div className="pt-5">
        <PhotoSlider photos={slides} pickLabel={t("slidePick", { n: "{n}" })} />
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr] md:gap-12">
        {/* ---------- 本文 ---------- */}
        <div className="md:order-2">
          <h1 className="sec-title">
            {t("h1")
              .split("　")
              .map((part) => (
                <span key={part} className="inline-block px-1">
                  {part}
                </span>
              ))}
          </h1>
          <div className="mt-4 space-y-1 text-[13px] sm:text-center">
            <p>{t("intro1")}</p>
            <p>{t("intro2")}</p>
          </div>
          <div className="mt-5 text-center text-[13px] leading-[2.1]">
            <p>{t("hours")}</p>
            <p>{t("english")}</p>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/visit" className="s-btn">
              {t("mapBtn")}
            </Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
              Instagram
            </a>
          </div>

          <section className="mt-12" aria-labelledby="shops">
            <h2 id="shops" className="sec-title">
              {t("shopsTitle")}
            </h2>
            <ul>
              {SHOPS.map((shop) => (
                <li
                  key={shop.id}
                  className="flex flex-col gap-2 border-b border-dotted border-rule py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-[13px] leading-[1.9]">
                    <p className="text-[14px] font-bold">{isJa ? shop.nameJa : shop.nameEn}</p>
                    <p>{isJa ? shop.addressJa : shop.addressEn}</p>
                    <p className="text-ink-soft">{s("walk", { mins: shop.walkMinsFromKiyomizu })}</p>
                  </div>
                  <a
                    href={directionsUrl(shop, locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s-btn shrink-0 self-start sm:self-center"
                  >
                    {s("mapBtn")}
                  </a>
                </li>
              ))}
            </ul>
          </section>

            <section className="mt-12" aria-labelledby="items">
              <h2 id="items" className="sec-title">
                {t("itemsTitle")}
              </h2>
              <ul className="mt-3 grid gap-x-6 text-[13px] leading-[2.1] sm:grid-cols-2">
                {messages.home.items.map((item) => (
                  <li key={item} className="pl-[1em] -indent-[1em]">
                    ・{item}
                  </li>
                ))}
              </ul>
            </section>

          {latest.length > 0 && (
            <section className="mt-12" aria-labelledby="latest">
              <h2 id="latest" className="sec-title">
                {t("newTitle")}
              </h2>
              <div className="mt-5">
                <ProductGrid products={latest} locale={locale} category={CATALOG_CATEGORY} />
              </div>
              <p className="mt-5 text-center">
                <Link href="/collection" className="s-btn">
                  {t("newAll")}
                </Link>
              </p>
            </section>
          )}
        </div>

        {/* ---------- サイド ---------- */}
        <aside className="space-y-10 md:order-1">
          <section aria-labelledby="cats">
            <h2 id="cats" className="sec-title">
              {t("categoriesTitle")}
            </h2>
            <ul className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4">
              {banners.map((b) => (
                <li key={b.href}>
                  <Link href={b.href} className="group block bg-white">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={b.photo.src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 33vw, 240px"
                        className="object-cover"
                      />
                    </div>
                    <p className="px-2 py-1.5 text-center text-[12px] group-hover:underline md:text-[13px]">
                      {b.label}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="sec-title">
              {t("contactTitle")}
            </h2>
            <p className="mt-3 text-[13px]">{t("contact")}</p>
            <p className="mt-3 text-center">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
                {t("instagramBtn")}
              </a>
            </p>
          </section>

          {isJa && (
            <section aria-labelledby="english" lang="en">
              <h2 id="english" className="sec-title">
                {t("englishTitle")}
              </h2>
              <p className="mt-3 text-[13px]">{t("englishBody")}</p>
              <p className="mt-3 text-center">
                <Link href="/" locale="en" className="s-btn">
                  English page
                </Link>
              </p>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

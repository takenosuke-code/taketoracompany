import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SHOPS, directionsUrl, INSTAGRAM_URL } from "@/lib/shops";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";
import { PHOTOS, photoAlt } from "@/lib/photos";
import ProductGrid from "@/components/ProductGrid";
import BannerSlider, { Banner } from "@/components/BannerSlider";

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
  const messages = (await getMessages({ locale })) as unknown as { home: { first: string[] } };
  const isJa = locale === "ja";

  // 新着: taketora_app（在庫管理アプリ）の商品マスタから最新10件
  const latest = (await getCatalogProducts()).slice(0, 10);

  const banners: Banner[] = [
    { key: "pokemon", href: "/pokemon" as const, photo: PHOTOS.pokemonShelf },
    { key: "figures", href: "/anime-figures" as const, photo: PHOTOS.figureWall },
    { key: "antique", href: "/antique" as const, photo: PHOTOS.potteryAndFigures },
    { key: "shops", href: "/visit" as const, photo: PHOTOS.aisle },
  ].map((b) => ({
    src: b.photo.src,
    alt: photoAlt(b.photo, locale),
    title: t(`banners.${b.key}.title`),
    sub: t(`banners.${b.key}.sub`),
    href: b.href,
  }));

  const cats = [
    { key: "pokemon", href: "/pokemon" as const, photo: PHOTOS.pokemonShelf },
    { key: "figures", href: "/anime-figures" as const, photo: PHOTOS.figureRows },
    { key: "antique", href: "/antique" as const, photo: PHOTOS.potteryShelves },
  ] as const;

  return (
    <>
      <div className="mx-auto max-w-site px-4 pt-4 sm:px-6">
        <BannerSlider banners={banners} pickLabel={t("slidePick", { n: "{n}" })} />

        <div className="mt-6">
          <h1 className="text-[16px] font-bold sm:text-[18px]">{t("h1")}</h1>
          <p className="mt-1 text-[14px] text-ink-soft">{t("intro")}</p>
        </div>

        {/* ---------- 売り場から探す ---------- */}
        <section className="mt-10" aria-labelledby="cats">
          <h2 id="cats" className="bar-title">
            {t("catTitle")}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {cats.map((c) => (
              <li key={c.key}>
                <Link href={c.href} className="group flex border border-line bg-white hover:border-ink sm:block">
                  <div className="relative h-[92px] w-[120px] shrink-0 sm:h-auto sm:w-auto sm:aspect-[16/10]">
                    <Image src={c.photo.src} alt="" fill sizes="(max-width: 640px) 120px, 340px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2 px-3 py-2 sm:py-3">
                    <div>
                      <p className="text-[16px] font-black group-hover:underline sm:text-[18px]">{t(`cats.${c.key}.name`)}</p>
                      <p className="text-[12px] text-ink-soft sm:text-[13px]">{t(`cats.${c.key}.note`)}</p>
                    </div>
                    <span aria-hidden="true" className="text-[22px] font-bold text-tag">›</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- ポケモンカード ---------- */}
      <section className="mt-12 bg-mist" aria-labelledby="poke">
        <div className="mx-auto grid max-w-site gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="grid min-w-0 grid-cols-2 items-start gap-3">
            <div className="relative aspect-[3/4]">
              <Image
                src={PHOTOS.pokemonShelf.src}
                alt={photoAlt(PHOTOS.pokemonShelf, locale)}
                fill
                sizes="(max-width: 768px) 55vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] bg-[#0b0b0b]">
              <Image
                src={PHOTOS.pokemonBox.src}
                alt={photoAlt(PHOTOS.pokemonBox, locale)}
                fill
                sizes="(max-width: 768px) 45vw, 240px"
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <h2 id="poke" className="bar-title">
              {t("pokeTitle")}
            </h2>
            <p className="mt-4">
              <span className="hilite-tag">{t("banners.pokemon.sub")}</span>
            </p>
            <p className="mt-3 text-[15px]">{t("pokeBody1")}</p>
            <p className="mt-1 text-[14px] text-ink-soft">{t("pokeBody2")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/pokemon" className="btn">
                {t("pokeLink")}
              </Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-sub">
                {t("instagramBtn")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-site px-4 sm:px-6">
        {/* ---------- 新着商品（在庫管理アプリに登録があるときだけ） ---------- */}
        {latest.length > 0 && (
          <section className="mt-12" aria-labelledby="latest">
            <div className="flex items-end justify-between gap-4">
              <h2 id="latest" className="bar-title">
                {t("newTitle")}
              </h2>
              <Link href="/collection" className="text-link text-[14px] font-bold">
                {t("newAll")} ›
              </Link>
            </div>
            <div className="mt-4">
              <ProductGrid products={latest} locale={locale} category={CATALOG_CATEGORY} />
            </div>
          </section>
        )}

        {/* ---------- 店舗一覧 ---------- */}
        <section className="mt-12" aria-labelledby="shops">
          <h2 id="shops" className="bar-title">
            {t("shopsTitle")}
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {SHOPS.map((shop) => (
              <li key={shop.id} className="flex flex-col border border-line bg-white p-4">
                <p className="text-[17px] font-black">{isJa ? shop.nameJa : shop.nameEn}</p>
                <p className="mt-1">
                  <span className="hilite-tag">{s("walk", { mins: shop.walkMinsFromKiyomizu })}</span>
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{isJa ? shop.addressJa : shop.addressEn}</p>
                <p className="mt-1 text-[13px]">{s("hours")}</p>
                <a
                  href={directionsUrl(shop, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sub mt-4 min-h-[40px] text-[13px]"
                >
                  {s("mapBtn")}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- はじめての方へ ---------- */}
        <section className="mt-12" aria-labelledby="first">
          <h2 id="first" className="bar-title">
            {t("firstTitle")}
          </h2>
          <div className="mt-4 border border-line bg-sky-pale px-5 py-4">
            <ul className="space-y-1 text-[14px]">
              {messages.home.first.map((n) => (
                <li key={n} className="pl-[1em] -indent-[1em]">
                  ・{n}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/visit" className="btn">
                {t("mapBtn")}
              </Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-sub">
                {t("instagramBtn")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

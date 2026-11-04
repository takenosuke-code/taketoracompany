import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SHOPS, directionsUrl, INSTAGRAM_URL } from "@/lib/shops";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";
import { PHOTOS, photoAlt } from "@/lib/photos";
import ProductShelf from "@/components/ProductShelf";

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
  const isJa = locale === "ja";

  // 新着: taketora_app（在庫管理アプリ）の商品マスタから最新5件
  const catalog = await getCatalogProducts();
  const latest = catalog.slice(0, 5);

  const kinds = [
    {
      key: "antique",
      href: "/antique" as const,
      photo: PHOTOS.potteryShelves,
    },
    {
      key: "figures",
      href: "/anime-figures" as const,
      photo: PHOTOS.figureRows,
    },
    {
      key: "pokemon",
      href: "/pokemon" as const,
      photo: PHOTOS.pokemonShelf,
    },
  ] as const;

  return (
    <>
      {/* ---------- 最初の画面: 店の特徴（器とフィギュアが同じ店にある）をそのまま見せる ---------- */}
      <section className="mx-auto max-w-shop px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="grid items-end gap-8 lg:grid-cols-[5fr_7fr] lg:gap-0">
          <div className="lg:pb-10 lg:pr-10">
            <h1 className="text-[15px] font-bold text-ink-soft">{t("h1")}</h1>
            <p className="mt-4 whitespace-pre-line text-[38px] font-black leading-[1.3] tracking-[0.02em] sm:text-[50px] lg:text-[54px]">
              {t("lead")}
            </p>
            <p className="mt-6 max-w-[34rem] text-[16px] leading-[2]">{t("body")}</p>
            <p className="mt-5 inline-block bg-sky-200 px-2 py-0.5 text-[14px] font-bold">
              {t("open")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/visit" className="btn">
                {t("ctaShops")}
              </Link>
              <Link href="/collection" className="btn-line">
                {t("ctaItems")}
              </Link>
            </div>
          </div>
          <div className="relative -mx-4 aspect-[4/3] sm:mx-0 lg:aspect-auto lg:h-[560px]">
            <Image
              src={PHOTOS.potteryAndFigures.src}
              alt={photoAlt(PHOTOS.potteryAndFigures, locale)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="shelf -mx-4 sm:mx-0" />
      </section>

      {/* ---------- 置いているもの: 3種類を1枚の棚に並べる ---------- */}
      <section className="mx-auto max-w-shop px-4 pt-20 sm:px-6 sm:pt-24" aria-labelledby="kinds">
        <h2 id="kinds" className="text-[28px] font-black sm:text-[34px]">
          {t("whatTitle")}
        </h2>
        <ul className="mt-8 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-0">
          {kinds.map((k) => (
            <li key={k.key} className="flex flex-col">
              <div className="relative h-[260px] md:mx-3 md:h-[320px]">
                <Image
                  src={k.photo.src}
                  alt={photoAlt(k.photo, locale)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="shelf" />
              <div className="flex flex-1 flex-col px-1 pt-4 md:px-3">
                <h3 className="text-[20px] font-black">{t(`${k.key}.name`)}</h3>
                <p className="mt-2 text-[15px] leading-[1.9] text-ink-soft">{t(`${k.key}.body`)}</p>
                <Link href={k.href} className="text-link mt-3 text-[15px] font-bold">
                  {t(`${k.key}.link`)}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- 最近入った商品（在庫管理アプリに登録があるときだけ出す） ---------- */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-shop px-4 pt-20 sm:px-6 sm:pt-24" aria-labelledby="latest">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div>
              <h2 id="latest" className="text-[28px] font-black sm:text-[34px]">
                {t("newTitle")}
              </h2>
              <p className="mt-1 text-[14px] text-ink-soft">{t("newNote")}</p>
            </div>
            <Link href="/collection" className="text-link text-[15px] font-bold">
              {t("newAll")}
            </Link>
          </div>
          <div className="mt-8">
            <ProductShelf products={latest} locale={locale} category={CATALOG_CATEGORY} />
          </div>
        </section>
      )}

      {/* ---------- 3つの店 ---------- */}
      <section className="mt-20 bg-sky-50 sm:mt-24" aria-labelledby="shops">
        <div className="mx-auto grid max-w-shop gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3]">
              <Image
                src={PHOTOS.aisle.src}
                alt={photoAlt(PHOTOS.aisle, locale)}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="shelf" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 id="shops" className="text-[28px] font-black sm:text-[34px]">
              {t("shopsTitle")}
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">{t("shopsIntro")}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {SHOPS.map((shop) => (
                <li key={shop.id} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-x-6">
                  <div>
                    <h3 className="text-[18px] font-black">{isJa ? shop.nameJa : shop.nameEn}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                      {isJa ? shop.addressJa : shop.addressEn}
                    </p>
                    <a
                      href={directionsUrl(shop, locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link mt-1 inline-block text-[14px] font-bold"
                    >
                      {s("directions")}
                    </a>
                  </div>
                  <p className="text-[14px] font-bold sm:text-right">
                    <span className="text-ink-soft">{s("fromKiyomizu")}</span>
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    <span className="text-[22px] font-black">{s("walkShort", { mins: shop.walkMinsFromKiyomizu })}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] font-bold">{s("hours")}</p>
          </div>
        </div>
      </section>

      {/* ---------- はじめて来られる方へ ---------- */}
      <section className="mx-auto max-w-shop px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="first">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <h2 id="first" className="text-[28px] font-black sm:text-[34px]">
            {t("firstTitle")}
          </h2>
          <div>
            <ul className="space-y-3 text-[16px] leading-[1.9]">
              {(["first1", "first2", "first3"] as const).map((key) => (
                <li key={key} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 bg-pine-edge" />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-line mt-7"
            >
              {t("instagram")}
              <span className="font-medium text-ink-soft">@taketora_antiques</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

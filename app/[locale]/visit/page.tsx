import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import { localeUrl, localePath, hreflang, ogMeta } from "@/lib/urls";
import { SHOPS, directionsUrl, mapsEmbedUrl, INSTAGRAM_URL } from "@/lib/shops";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.visit" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/visit"),
      languages: hreflang("/visit"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/visit" }),
  };
}

// 店内を撮った YouTube ショート（既存サイトから引き継ぎ）
const VIDEOS = [
  { id: "kC8viRPTW5A", titleJa: "たけとら 店内の動画 1", titleEn: "Inside Taketora, video 1" },
  { id: "Ow0XaLcdM3o", titleJa: "たけとら 店内の動画 2", titleEn: "Inside Taketora, video 2" },
];

export default async function VisitPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.visit"), href: localePath(locale, "/visit") },
        ]}
        title={t("visit.title")}
        intro={<p>{t("visit.intro")}</p>}
      >
        <ul className="mt-6 flex flex-wrap gap-2">
          {SHOPS.map((shop) => (
            <li key={shop.id}>
              <a
                href={`#${shop.id}`}
                className="inline-block rounded border border-line px-3 py-1.5 text-[14px] font-bold hover:border-ink"
              >
                {isJa ? shop.nameJa : shop.nameEn}
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      <div className="mx-auto max-w-shop px-4 sm:px-6">
        {SHOPS.map((shop) => {
          const name = isJa ? shop.nameJa : shop.nameEn;
          return (
            <section
              key={shop.id}
              id={shop.id}
              aria-labelledby={`${shop.id}-name`}
              className="grid scroll-mt-20 gap-8 border-b border-line py-12 lg:grid-cols-[1fr_1.3fr] lg:gap-12"
            >
              <div>
                <h2 id={`${shop.id}-name`} className="text-[26px] font-black sm:text-[30px]">
                  {name}
                </h2>
                <dl className="mt-5 space-y-4 text-[15px]">
                  <div>
                    <dt className="font-bold text-ink-soft">{t("shops.address")}</dt>
                    <dd className="mt-0.5">{isJa ? shop.addressJa : shop.addressEn}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink-soft">{t("shops.hoursLabel")}</dt>
                    <dd className="mt-0.5">{t("shops.hours")}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink-soft">{t("shops.fromKiyomizu")}</dt>
                    <dd className="mt-0.5 text-[22px] font-black">
                      {t("shops.walkShort", { mins: shop.walkMinsFromKiyomizu })}
                    </dd>
                  </div>
                </dl>
                <a
                  href={directionsUrl(shop, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-7"
                >
                  {t("shops.directions")}
                </a>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-line bg-sky-50">
                <iframe
                  src={mapsEmbedUrl(shop, locale)}
                  title={isJa ? `${name}の地図` : `Map of ${name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </section>
          );
        })}

        {/* 店内の動画 */}
        <section className="border-b border-line py-14" aria-labelledby="videos">
          <h2 id="videos" className="text-[26px] font-black sm:text-[30px]">
            {t("visit.videosTitle")}
          </h2>
          <p className="mt-2 text-[15px] text-ink-soft">{t("visit.videosIntro")}</p>
          <div className="mt-6 grid max-w-[44rem] grid-cols-2 gap-4">
            {VIDEOS.map((v) => (
              <div key={v.id} className="relative aspect-[9/16] overflow-hidden bg-ink">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`}
                  title={isJa ? v.titleJa : v.titleEn}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ))}
          </div>
        </section>

        {/* はじめて来られる方へ */}
        <section className="py-14 pb-20" aria-labelledby="first">
          <h2 id="first" className="text-[26px] font-black sm:text-[30px]">
            {t("visit.firstTitle")}
          </h2>
          <ul className="mt-5 max-w-[44rem] space-y-3 text-[16px] leading-[1.9]">
            {(["first1", "first2", "first3"] as const).map((key) => (
              <li key={key} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 bg-pine-edge" />
                <span>{t(`home.${key}`)}</span>
              </li>
            ))}
          </ul>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-line mt-7">
            {t("common.instagram")}
            <span className="font-medium text-ink-soft">@taketora_antiques</span>
          </a>
        </section>
      </div>
    </>
  );
}

import { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
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
  const messages = (await getMessages({ locale })) as unknown as { visit: { notes: string[] } };
  const isJa = locale === "ja";

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.visit"), href: localePath(locale, "/visit") },
        ]}
        title={t("visit.title")}
        intro={<p className="text-center text-[13px]">{t("visit.intro")}</p>}
      >
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 text-[13px]">
          {SHOPS.map((shop) => (
            <li key={shop.id}>
              <a href={`#${shop.id}`} className="text-link">
                {isJa ? shop.nameJa : shop.nameEn}
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      {SHOPS.map((shop) => {
        const name = isJa ? shop.nameJa : shop.nameEn;
        return (
          <section key={shop.id} id={shop.id} className="mt-12 scroll-mt-4" aria-labelledby={`${shop.id}-name`}>
            <h2 id={`${shop.id}-name`} className="sec-title">
              {name}
            </h2>
            <table className="mt-4 w-full border-collapse bg-white text-[13px]">
              <tbody>
                <tr className="border-b border-dotted border-rule">
                  <th scope="row" className="w-[7.5rem] px-4 py-3 text-left align-top font-bold sm:w-[10rem]">
                    {t("shops.address")}
                  </th>
                  <td className="px-4 py-3">{isJa ? shop.addressJa : shop.addressEn}</td>
                </tr>
                <tr className="border-b border-dotted border-rule">
                  <th scope="row" className="px-4 py-3 text-left align-top font-bold">
                    {t("shops.hoursLabel")}
                  </th>
                  <td className="px-4 py-3">{t("shops.hours")}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 text-left align-top font-bold">
                    {t("shops.access")}
                  </th>
                  <td className="px-4 py-3">{t("shops.walkShort", { mins: shop.walkMinsFromKiyomizu })}</td>
                </tr>
              </tbody>
            </table>
            <div className="relative mt-3 aspect-[16/9] bg-[#ddd6ca] sm:aspect-[2/1]">
              <iframe
                src={mapsEmbedUrl(shop, locale)}
                title={isJa ? `${name}の地図` : `Map of ${name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <p className="mt-3 text-center">
              <a href={directionsUrl(shop, locale)} target="_blank" rel="noopener noreferrer" className="s-btn">
                {t("shops.mapBtn")}
              </a>
            </p>
          </section>
        );
      })}

      <section className="mt-14" aria-labelledby="notes">
        <h2 id="notes" className="sec-title">
          {t("visit.noteTitle")}
        </h2>
        <ul className="mx-auto mt-4 max-w-[36rem] text-[13px] leading-[2.1]">
          {messages.visit.notes.map((n) => (
            <li key={n} className="pl-[1em] -indent-[1em]">
              ・{n}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
            Instagram @taketora_antiques
          </a>
        </p>
      </section>

      <section className="mt-14" aria-labelledby="videos">
        <h2 id="videos" className="sec-title">
          {t("visit.videosTitle")}
        </h2>
        <div className="mx-auto mt-4 grid max-w-[480px] grid-cols-2 gap-3">
          {VIDEOS.map((v) => (
            <div key={v.id} className="relative aspect-[9/16] bg-ink">
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
    </>
  );
}

import { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ScrollRevealSection from "@/components/ScrollRevealSection";

const BASE_URL = "https://taketora-antique.com";

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
      canonical: `${BASE_URL}/${locale}/visit`,
      languages: {
        ja: `${BASE_URL}/ja/visit`,
        en: `${BASE_URL}/en/visit`,
        "x-default": `${BASE_URL}/ja/visit`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/visit`,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

const shops = [
  {
    id: 1,
    nameJa: "たけとら 高台寺店",
    nameEn: "Taketora Kodaiji",
    addressJa: "〒605-0824 京都府京都市東山区南町421-2",
    addressEn:
      "421-2 Minamimachi, Higashiyama Ward, Kyoto, 605-0824, Japan",
    mapsUrl: "https://maps.app.goo.gl/uffSvD9BWBj35SmB6",
    walkMinsFromKiyomizu: 6,
  },
  {
    id: 2,
    nameJa: "たけとら 清水寺店",
    nameEn: "Taketora Kiyomizu",
    addressJa: "〒605-0848 京都府京都市東山区五条橋東6丁目539-49",
    addressEn:
      "6 Chome-539-49 Gojobashihigashi, Higashiyama Ward, Kyoto, 605-0848, Japan",
    mapsUrl: "",
    walkMinsFromKiyomizu: 12,
  },
  {
    id: 3,
    nameJa: "たけとら 亀屋町店",
    nameEn: "Taketora Kameyacho",
    addressJa: "〒600-8451 京都府京都市下京区亀屋町51",
    addressEn:
      "51 Kameyacho, Shimogyo Ward, Kyoto, 600-8451, Japan",
    mapsUrl: "",
    walkMinsFromKiyomizu: 18,
  },
];

const attractions = [
  {
    nameJa: "清水寺",
    nameEn: "Kiyomizu-dera Temple",
    descJa: "パノラマビューが美しい歴史的な木造建築",
    descEn: "Historic wooden temple with panoramic city views",
  },
  {
    nameJa: "伏見稲荷大社",
    nameEn: "Fushimi Inari Shrine",
    descJa: "千本鳥居で有名な神社",
    descEn: "Famous shrine with thousands of vermillion torii gates",
  },
  {
    nameJa: "祇園",
    nameEn: "Gion District",
    descJa: "伝統的な花街、保存された町家が並ぶ",
    descEn: "Traditional geisha district with preserved machiya houses",
  },
  {
    nameJa: "八坂神社",
    nameEn: "Yasaka Shrine",
    descJa: "祇園の中心にある美しい神社",
    descEn: "Beautiful shrine in the heart of Gion",
  },
  {
    nameJa: "二年坂・三年坂",
    nameEn: "Ninenzaka & Sannenzaka",
    descJa: "清水寺へ続く風情ある石畳の坂道",
    descEn: "Charming preserved streets leading to Kiyomizu-dera",
  },
  {
    nameJa: "円山公園",
    nameEn: "Maruyama Park",
    descJa: "桜の名所として人気のスポット",
    descEn: "Popular cherry blossom viewing spot",
  },
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
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Gemini_Generated_Image_njk45ynjk45ynjk4.png"
          alt={
            isJa
              ? "清水寺と京都の風景 - たけとらアンティークショップ"
              : "Kiyomizu-dera Temple and Kyoto scenery - Taketora Antique Shop"
          }
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-stone-950/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/60" />
      </div>

      <div className="relative z-10">
        {/* Hero with YouTube Shorts */}
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center pt-20">
          <div className="max-w-6xl mx-auto w-full">
            <ScrollRevealSection variant="fade-up">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                  {isJa ? "Experience" : "Experience"}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold mb-4 tracking-wide">
                  {t("visit.heroTitle")}
                </h2>
                <div className="mt-3 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>
            </ScrollRevealSection>

            <ScrollRevealSection variant="scale" delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
                <div className="glass-card overflow-hidden shadow-2xl">
                  <div className="aspect-[9/16] w-full relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/kC8viRPTW5A?autoplay=1&mute=1&loop=1&playlist=kC8viRPTW5A&controls=1&modestbranding=1&rel=0"
                      title={isJa ? "たけとら 店舗紹介" : "Taketora Experience"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                </div>
                <div className="glass-card overflow-hidden shadow-2xl">
                  <div className="aspect-[9/16] w-full relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/Ow0XaLcdM3o?autoplay=1&mute=1&loop=1&playlist=Ow0XaLcdM3o&controls=1&modestbranding=1&rel=0"
                      title={isJa ? "たけとら コレクション紹介" : "Taketora Collection Tour"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                </div>
              </div>
            </ScrollRevealSection>

            <div className="text-center mt-10">
              <div className="w-5 h-8 border border-[#F2E8DC]/20 rounded-full flex justify-center pt-1.5 mx-auto">
                <div className="w-1 h-2 bg-[#D4AF37]/60 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <ScrollRevealSection variant="scale">
            <div className="max-w-4xl mx-auto">
              <article className="glass-card p-8 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/20 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/20 rounded-br-xl" />
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold mb-6 tracking-wide">
                  {t("visit.mainTitle")}
                </h2>
                <p className="text-base sm:text-lg md:text-xl font-light text-[#F2E8DC]/80 leading-relaxed">
                  {t("visit.mainBody")}
                </p>
              </article>
            </div>
          </ScrollRevealSection>
        </section>

        {/* Shop Locations */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <ScrollRevealSection variant="fade-up">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <p className="text-[#D4AF37]/60 text-xs sm:text-sm tracking-[0.35em] uppercase font-light mb-3">
                  Store Locations
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold tracking-wide">
                  {t("visit.shopsTitle")}
                </h2>
                <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {shops.map((shop, index) => {
                  const address = isJa ? shop.addressJa : shop.addressEn;
                  const shopName = isJa ? shop.nameJa : shop.nameEn;
                  const mapsQuery = encodeURIComponent(`${shopName} ${address}`);
                  const directionsUrl = shop.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

                  return (
                    <ScrollRevealSection key={shop.id} variant="fade-up" delay={index * 150}>
                      <div className="group glass-card overflow-hidden hover:border-amber-600/30 transition-all duration-500 hover:shadow-gold-lg h-full flex flex-col">
                        {/* Top accent */}
                        <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20" />

                        <div className="p-6 sm:p-8 flex-1 flex flex-col">
                          {/* Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-amber-700 rounded-lg" />
                              <span className="relative flex items-center justify-center w-full h-full text-stone-950 font-bold text-lg font-serif">
                                {index + 1}
                              </span>
                            </div>
                            <h3 className="font-serif text-xl sm:text-2xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 leading-tight">
                              {shopName}
                            </h3>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-3 mb-5">
                            <svg className="w-4 h-4 text-[#D4AF37]/60 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-[#F2E8DC]/65 text-sm font-light leading-relaxed">
                              {address}
                            </p>
                          </div>

                          <div className="gold-line mb-5" />

                          {/* Info row */}
                          <div className="flex items-center justify-between gap-2 mb-6">
                            <div className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[#F2E8DC]/45 text-xs font-light">
                                {t("visit.openDaily")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                              <span className="text-[#D4AF37] text-xs font-semibold tracking-wide">
                                {t("visit.minWalk", { mins: shop.walkMinsFromKiyomizu })}
                              </span>
                            </div>
                          </div>

                          {/* Directions button */}
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full flex items-center justify-center gap-2 text-sm font-bold tracking-wider text-stone-950 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#e0c050] hover:to-amber-500 rounded-lg px-4 py-3 transition-all duration-300 shadow-lg shadow-amber-900/20 hover:shadow-gold-lg hover:-translate-y-0.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                            </svg>
                            {t("visit.getDirections")}
                          </a>
                        </div>
                      </div>
                    </ScrollRevealSection>
                  );
                })}
              </div>
            </div>
          </ScrollRevealSection>
        </section>

        {/* Map & Neighborhood */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 pb-24">
          <ScrollRevealSection variant="fade-up">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10 sm:mb-14">
                <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                  {isJa ? "Neighborhood" : "Neighborhood"}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold tracking-wide">
                  {t("visit.neighborhoodTitle")}
                </h2>
                <p className="text-center text-[#F2E8DC]/60 text-sm sm:text-base mt-4 font-light max-w-2xl mx-auto">
                  {t("visit.neighborhoodBody")}
                </p>
                <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>

              <div className="glass-card overflow-hidden shadow-2xl">
                <div className="aspect-video w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.5!2d135.777!3d34.996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108d385dcfb07%3A0x62af658650c0baed!2sKiyomizu-dera!5e0!3m2!1s${locale}!2sjp!4v1234567890123!5m2!1s${locale}!2sjp`}
                    title={
                      isJa
                        ? "たけとら 京都の店舗マップ"
                        : "Taketora Locations in Kyoto"
                    }
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <a
                      href="https://www.google.com/maps/search/Kiyomizu-dera,+Higashiyama+Ward,+Kyoto/@34.9948,135.7850,15z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card px-4 py-2.5 text-[#D4AF37] text-xs sm:text-sm hover:border-amber-700/40 transition-all duration-300 font-light inline-flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {t("visit.openInMaps")}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {attractions.map((attraction, index) => (
                  <ScrollRevealSection key={attraction.nameEn} variant="fade-up" delay={index * 80}>
                    <div className="glass-card p-5 sm:p-6 hover:border-amber-600/30 transition-all duration-500 group h-full">
                      <h3 className="font-serif text-lg sm:text-xl text-[#D4AF37] mb-2 group-hover:text-[#F2E8DC] transition-colors duration-300">
                        {isJa ? attraction.nameJa : attraction.nameEn}
                      </h3>
                      <p className="text-[#F2E8DC]/55 text-xs sm:text-sm font-light leading-relaxed">
                        {isJa ? attraction.descJa : attraction.descEn}
                      </p>
                    </div>
                  </ScrollRevealSection>
                ))}
              </div>
            </div>
          </ScrollRevealSection>
        </section>
      </div>
    </div>
  );
}

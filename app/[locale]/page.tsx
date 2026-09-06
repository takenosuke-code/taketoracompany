import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ScrollRevealSection from "@/components/ScrollRevealSection";
import ImageSlideshow from "@/components/ImageSlideshow";
import LazyVideo from "@/components/LazyVideo";
import { SHOPS, directionsUrl } from "@/lib/shops";
import { getCatalogProducts, catalogToCard } from "@/lib/catalog";

// 商品・在庫（スマレジ）を60秒ごとに再取得
export const revalidate = 60;

export default async function Homepage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  // 新着: taketora_app（在庫管理アプリ）の商品マスタから最新6件
  const catalog = await getCatalogProducts();
  const products = catalog.slice(0, 6).map(catalogToCard);

  // Slideshow alt texts
  const slideshowImages = [
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8706%20(1).jpg",
      altJa: "京都たけとらの骨董品コレクション - 日本の陶磁器",
      altEn:
        "Japanese ceramics collection at Taketora antique shop Kyoto",
    },
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8736.jpg",
      altJa: "京都・東山のアンティークショップたけとら 店内展示",
      altEn: "Inside Taketora antique shop in Kyoto Higashiyama",
    },
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8739%20(1).jpg",
      altJa: "京都たけとらの伝統工芸品・古道具展示",
      altEn:
        "Traditional crafts and vintage items at Taketora Kyoto",
    },
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8741.jpg",
      altJa: "京都たけとらの店内 - 骨董品と古美術品",
      altEn:
        "Antique art and collectibles display at Taketora Kyoto",
    },
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8745.jpg",
      altJa: "京都・五条坂のたけとら アンティークショップ内部",
      altEn:
        "Taketora antique shop interior on Gojo-zaka Kyoto",
    },
    {
      url: "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8759.jpg",
      altJa: "たけとらの厳選コレクション - 京都・東山",
      altEn:
        "Curated collection at Taketora Higashiyama Kyoto",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Fixed Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          // Don't eagerly download the full background video before the hero
          // paints; the poster (the LCP image) shows while the video lazy-loads.
          preload="none"
          poster={`/_next/image?url=${encodeURIComponent(slideshowImages[0].url)}&w=1280&q=60`}
          className="w-full h-full object-cover"
        >
          <source
            src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Taketorahorizontal.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/30 via-transparent to-stone-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        {/* h-screen 固定だと縦の短い端末でCTAが overflow-hidden に切られるため、
            min-h(小さい画面では内容ぶん伸びる)+ svh(iOSのURLバー分を除いた高さ)にする */}
        <section className="min-h-svh w-full flex items-center justify-center pt-16 sm:pt-20 pb-24 sm:pb-16 relative overflow-hidden">
          {/* Decorative floating orbs */}
          <div className="floating-orb w-64 h-64 bg-amber-500/10 top-20 -left-20" />
          <div className="floating-orb w-48 h-48 bg-amber-400/10 bottom-40 -right-10 animation-delay-2000" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Eyebrow with gold line */}
            <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
              <div className="hidden sm:block h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
              <p className="text-xs sm:text-sm font-medium tracking-[0.35em] text-[#D4AF37] uppercase">
                {t("hero.eyebrow")}
              </p>
              <div className="hidden sm:block h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
            </div>

            {/* Main Title with shimmer — no entrance animation so the LCP
                element paints immediately (it must not start at opacity:0). */}
            <h1 className="mb-4 font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-shimmer drop-shadow-2xl tracking-wider">
              {t("hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="mb-6 text-lg sm:text-xl md:text-2xl text-[#D4AF37]/80 font-light tracking-wider animate-fade-in opacity-0 stagger-2">
              {t("hero.subtitle")}
            </p>

            {/* Body */}
            <p className="max-w-2xl mx-auto font-light text-[#F2E8DC]/85 text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line animate-fade-in opacity-0 stagger-3">
              {t("hero.body")}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-10 animate-fade-in opacity-0 stagger-4">
              {[
                t("hero.badges.antiques"),
                t("hero.badges.figures"),
                t("hero.badges.pokemon"),
                t("hero.badges.english"),
              ].map((badge) => (
                <span
                  key={badge}
                  className="badge-gold"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up opacity-0 stagger-5">
              <Link
                href="/collection"
                className="btn-gold-filled group"
              >
                <span className="tracking-widest text-xs sm:text-sm uppercase font-bold">
                  {t("hero.cta1")}
                </span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/visit"
                className="btn-gold group"
              >
                <span className="relative text-[#D4AF37] tracking-widest text-xs sm:text-sm uppercase font-semibold group-hover:text-[#F2E8DC] transition-colors duration-300">
                  {t("hero.cta2")}
                </span>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] text-[#F2E8DC]/40 tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-5 h-8 border border-[#F2E8DC]/20 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-[#D4AF37]/60 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* --- ANTIQUES SECTION (Top Priority for SEO) --- */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10">
          <ScrollRevealSection variant="fade-up">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Image with overlay effect */}
                <ScrollRevealSection variant="fade-right" delay={200}>
                  <div className="relative w-full h-full min-h-[350px] sm:min-h-[450px] rounded-2xl overflow-hidden group">
                    <Image
                      src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/antique2.JPG"
                      alt={
                        isJa
                          ? "京都たけとらの骨董品・古道具 - 伝統工芸品展示"
                          : "Japanese antiques and traditional crafts at Taketora Kyoto"
                      }
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                    {/* Decorative corner accent */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-lg" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-lg" />
                  </div>
                </ScrollRevealSection>

                {/* Description */}
                <ScrollRevealSection variant="fade-left" delay={400}>
                  <div className="space-y-4 sm:space-y-5 glass-card p-6 sm:p-8 lg:p-10 flex flex-col h-full">
                    <span className="text-xs sm:text-sm text-[#D4AF37]/70 tracking-[0.25em] uppercase font-light">
                      {t("antiques.label")}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold tracking-wide">
                      {t("antiques.title")}
                    </h2>
                    <div className="gold-line" />
                    <p className="text-[#F2E8DC]/90 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                      {t("antiques.subtitle")}
                    </p>
                    <p className="text-[#F2E8DC]/75 text-sm font-light leading-relaxed">
                      {t("antiques.body1")}
                    </p>
                    <p className="text-[#F2E8DC]/75 text-sm font-light leading-relaxed">
                      {t("antiques.body2")}
                    </p>

                    {/* Categories with icons */}
                    <ul className="space-y-2 text-[#F2E8DC]/70 text-xs sm:text-sm font-light">
                      {[
                        t("antiques.categories.ceramics"),
                        t("antiques.categories.tea"),
                        t("antiques.categories.folk"),
                        t("antiques.categories.art"),
                      ].map((cat) => (
                        <li key={cat} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0" />
                          {cat}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <Link
                        href="/antique"
                        className="btn-gold-filled group inline-flex"
                      >
                        <span className="text-xs sm:text-sm uppercase tracking-wider font-bold">
                          {t("antiques.cta")}
                        </span>
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </ScrollRevealSection>
              </div>
            </div>
          </ScrollRevealSection>
        </section>

        {/* --- COLLECTION CARDS (3 columns) --- */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <ScrollRevealSection variant="fade-up">
              <div className="text-center mb-12 sm:mb-16">
                <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                  {isJa ? "Explore Our World" : "Explore Our World"}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gradient-gold tracking-wide">
                  {isJa ? "コレクション" : "Collections"}
                </h2>
                <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>
            </ScrollRevealSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Anime Figures Card */}
              <ScrollRevealSection variant="fade-up" delay={0}>
                <Link
                  href="/anime-figures"
                  className="product-card group glass-card block overflow-hidden"
                >
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/rows%20of%20anime%20figs.JPG"
                      alt={
                        isJa
                          ? "たけとらのアニメフィギュアコレクション - 正規品プレミアムフィギュア"
                          : "Authentic anime figure collection at Taketora Kyoto"
                      }
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                    {/* Category label overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">
                        {t("collections.anime.title")}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[#F2E8DC]/65 text-sm font-light leading-relaxed">
                      {t("collections.anime.body")}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-xs tracking-wider uppercase font-medium group-hover:gap-3 transition-all duration-300">
                      <span>{isJa ? "詳しく見る" : "Explore"}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollRevealSection>

              {/* Pokémon Cards */}
              <ScrollRevealSection variant="fade-up" delay={150}>
                <Link
                  href="/pokemon"
                  className="product-card group glass-card block overflow-hidden"
                >
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/product/MegaBraveBoosterBox_15000yen.png"
                      alt={
                        isJa
                          ? "たけとらのポケモンカードコレクション - シールドボックス・レアカード"
                          : "Pokémon card collection at Taketora Kyoto - booster boxes and rare cards"
                      }
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">
                        {t("collections.pokemon.title")}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[#F2E8DC]/65 text-sm font-light leading-relaxed">
                      {t("collections.pokemon.body")}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-xs tracking-wider uppercase font-medium group-hover:gap-3 transition-all duration-300">
                      <span>{isJa ? "詳しく見る" : "Explore"}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollRevealSection>

              {/* Full Collection */}
              <ScrollRevealSection variant="fade-up" delay={300}>
                <Link
                  href="/collection"
                  className="product-card group glass-card block overflow-hidden"
                >
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/IMG_8759.jpg"
                      alt={
                        isJa
                          ? "たけとらの全コレクション - 骨董品・フィギュア・カード"
                          : "Full collection at Taketora Kyoto - antiques, figures, and cards"
                      }
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="font-serif text-xl sm:text-2xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-lg">
                        {t("collections.all.title")}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[#F2E8DC]/65 text-sm font-light leading-relaxed">
                      {t("collections.all.body")}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-xs tracking-wider uppercase font-medium group-hover:gap-3 transition-all duration-300">
                      <span>{isJa ? "詳しく見る" : "Explore"}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollRevealSection>
            </div>
          </div>
        </section>

        {/* --- STORYTELLING / ABOUT SECTION --- */}
        <section className="relative min-h-screen w-full flex overflow-hidden">
          {/* Split video background */}
          <div className="absolute inset-0">
            <div className="relative w-1/2 h-full float-left overflow-hidden">
              <LazyVideo
                src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/heropagepreview.mp4"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-1/2 h-full float-left overflow-hidden">
              <LazyVideo
                src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/herpagepreview2.mp4"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlays */}
            <div className="absolute inset-0 bg-stone-950/75" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/40" />
            {/* Center divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center justify-center w-full py-20 sm:py-28">
            <div className="text-center px-4 max-w-5xl mx-auto">
              <ScrollRevealSection variant="scale">
                <div className="space-y-8" id="about">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                    <p className="text-xs sm:text-sm font-medium tracking-[0.35em] text-[#D4AF37] uppercase">
                      {t("about.title")}
                    </p>
                    <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
                  </div>

                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-shimmer drop-shadow-2xl tracking-[0.2em]">
                    TAKETORA
                  </h2>

                  <div className="max-w-3xl mx-auto space-y-5">
                    <p className="font-light text-[#F2E8DC]/95 text-base md:text-lg lg:text-xl leading-relaxed">
                      {t("about.p1")}
                    </p>
                    <p className="font-light text-[#F2E8DC]/85 text-sm md:text-base lg:text-lg leading-relaxed">
                      {t("about.p2")}
                    </p>
                    <p className="font-light text-[#F2E8DC]/85 text-sm md:text-base lg:text-lg leading-relaxed">
                      {t("about.p3")}
                    </p>
                  </div>

                  {/* Values */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
                    {(["english", "location"] as const).map(
                      (key, index) => (
                        <ScrollRevealSection key={key} variant="fade-up" delay={index * 150}>
                          <div className="glass-card p-5 sm:p-6 text-center group hover:border-amber-600/30 transition-all duration-500">
                            <h3 className="text-[#D4AF37] font-semibold text-sm sm:text-base mb-2 tracking-wide">
                              {t(`about.values.${key}.title`)}
                            </h3>
                            <p className="text-[#F2E8DC]/65 text-xs sm:text-sm font-light leading-relaxed">
                              {t(`about.values.${key}.body`)}
                            </p>
                          </div>
                        </ScrollRevealSection>
                      )
                    )}
                  </div>
                </div>
              </ScrollRevealSection>
            </div>
          </div>
        </section>

        {/* --- SLIDESHOW SECTION --- */}
        <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-10">
          <ScrollRevealSection variant="fade-up">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10 sm:mb-16">
                <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                  {isJa ? "Gallery" : "Gallery"}
                </p>
                <h2 className="text-[#D4AF37] text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 tracking-wide">
                  {t("collections.title")}
                </h2>
                <p className="text-[#F2E8DC]/70 text-sm md:text-base max-w-2xl mx-auto font-light">
                  {t("collections.subtitle")}
                </p>
                <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </div>
              <ImageSlideshow
                images={slideshowImages.map((img) => img.url)}
                autoPlayInterval={5000}
              />
            </div>
          </ScrollRevealSection>
        </section>

        {/* --- SHOP INFO SECTION --- */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-10">
          <ScrollRevealSection variant="scale">
            <div className="max-w-5xl mx-auto">
              <div className="glass-card p-6 sm:p-10 lg:p-14 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/20 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]/20 rounded-br-xl" />

                <div className="text-center mb-8">
                  <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                    {isJa ? "Shop Information" : "Shop Information"}
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gradient-gold tracking-wide">
                    {t("shopInfo.title")}
                  </h2>
                  <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                </div>

                {/* 3店舗（店舗マスタ lib/shops.ts から表示） */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
                  {SHOPS.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex flex-col gap-3 p-5 rounded-lg bg-amber-500/5 border border-amber-900/10"
                    >
                      <h3 className="text-[#F2E8DC] font-medium text-sm tracking-wider uppercase">
                        {isJa ? shop.nameJa : shop.nameEn}
                      </h3>
                      <p className="text-[#F2E8DC]/65 text-sm font-light leading-relaxed">
                        {isJa ? shop.addressJa : shop.addressEn}
                      </p>
                      <p className="text-[#D4AF37] text-xs font-semibold tracking-wide">
                        {t("visit.minWalk", { mins: shop.walkMinsFromKiyomizu })}
                      </p>
                      <a
                        href={directionsUrl(shop, locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 text-[#D4AF37] text-sm hover:text-[#F2E8DC] transition-colors duration-300"
                      >
                        {t("visit.getDirections")}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>

                {/* 共通情報（営業時間・言語・Instagram） */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-3">
                  <p className="text-[#F2E8DC]/65 text-sm font-light">
                    {t("shopInfo.hours")}
                  </p>
                  <p className="text-[#F2E8DC]/65 text-sm font-light">
                    {t("shopInfo.languages")}
                  </p>
                  <a
                    href="https://www.instagram.com/taketora_antiques/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#D4AF37] text-sm hover:text-[#F2E8DC] transition-colors duration-300 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @taketora_antiques
                  </a>
                </div>

                {/* Google Maps Embed */}
                <div className="mt-10 rounded-xl overflow-hidden border border-amber-900/20 shadow-lg">
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.2!2d135.7738!3d34.9948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDU5JzQxLjMiTiAxMzXCsDQ2JzI1LjciRQ!5e0!3m2!1sja!2sjp!4v1234567890"
                    title={
                      isJa
                        ? "たけとら 京都・東山の地図"
                        : "Taketora Location Map - Kyoto Higashiyama"
                    }
                  />
                </div>
              </div>
            </div>
          </ScrollRevealSection>
        </section>

        {/* --- NEW ARRIVALS --- */}
        <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-10">
          <ScrollRevealSection variant="fade-up">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-14">
                <div>
                  <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
                    {isJa ? "New Arrivals" : "New Arrivals"}
                  </p>
                  <h2 className="text-[#D4AF37] text-3xl sm:text-4xl lg:text-5xl font-serif tracking-wide">
                    {t("newArrivals.title")}
                  </h2>
                  <div className="mt-3 w-16 h-0.5 bg-gradient-to-r from-[#D4AF37]/60 to-transparent" />
                </div>
                <Link
                  href="/collection"
                  className="group inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F2E8DC] transition-colors duration-300 text-xs sm:text-sm uppercase tracking-wider font-medium"
                >
                  {t("newArrivals.viewAll")}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {products?.map((product: any, index: number) => {
                  const productUrl = product.slug
                    ? `/anime-figures/${product.slug}`
                    : "/collection";

                  return (
                    <ScrollRevealSection key={product.id} variant="fade-up" delay={index * 100}>
                      <Link
                        href={productUrl}
                        className="product-card group glass-card block overflow-hidden"
                      >
                        <div className="h-52 sm:h-60 lg:h-72 w-full relative overflow-hidden bg-gradient-to-br from-stone-800/30 to-stone-900/30">
                          <Image
                            src={
                              product.image_url || "https://placehold.co/600x400"
                            }
                            alt={
                              isJa
                                ? `京都たけとら - ${product.name}`
                                : `${product.name} at Taketora Kyoto`
                            }
                            fill
                            className="object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-5 sm:p-6 space-y-2">
                          <h3 className="text-[#F2E8DC] text-base sm:text-lg font-serif group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-[#D4AF37] font-serif text-lg sm:text-xl tracking-wide">
                              ¥{product.price?.toLocaleString("ja-JP") || "0"}
                            </p>
                            <span className="text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollRevealSection>
                  );
                })}
              </div>
            </div>
          </ScrollRevealSection>
        </section>
      </div>
    </div>
  );
}

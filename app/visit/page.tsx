import { Metadata } from 'next';
import Image from 'next/image';
import ScrollRevealSection from '@/components/ScrollRevealSection';

export const metadata: Metadata = {
  title: 'Visit Us | Taketora - Premium Japanese Collectibles in Kyoto',
  description: 'Discover Taketora\'s three boutique locations in the historic Higashiyama district of Kyoto, just steps away from Kiyomizu-dera Temple and other iconic attractions.',
};

// Shop locations
const shops = [
  {
    id: 1,
    name: 'Taketora Kiyomizu',
    address: '421-2 Minamimachi, Higashiyama Ward, Kyoto, 605-0824, Japan',
    lat: 34.9949,
    lng: 135.7850,
    walkMinsFromKiyomizu: 6,
  },
  {
    id: 2,
    name: 'Taketora Gojo',
    address: '6 Chome-539-49 Gojobashihigashi, Higashiyama Ward, Kyoto, 605-0848, Japan',
    lat: 34.9980,
    lng: 135.7700,
    walkMinsFromKiyomizu: 12,
  },
  {
    id: 3,
    name: 'Taketora Kameyacho',
    address: '51 Kameyacho, Shimogyo Ward, Kyoto, 600-8451, Japan',
    lat: 35.0030,
    lng: 135.7600,
    walkMinsFromKiyomizu: 18,
  },
];

// Popular tourist attractions near Kiyomizu
const attractions = [
  {
    name: 'Kiyomizu-dera Temple',
    lat: 34.9948,
    lng: 135.7850,
    description: 'Historic wooden temple with panoramic city views',
  },
  {
    name: 'Fushimi Inari Shrine',
    lat: 34.9671,
    lng: 135.7727,
    description: 'Famous shrine with thousands of vermillion torii gates',
  },
  {
    name: 'Gion District',
    lat: 35.0034,
    lng: 135.7750,
    description: 'Traditional geisha district with preserved machiya houses',
  },
  {
    name: 'Yasaka Shrine',
    lat: 35.0037,
    lng: 135.7783,
    description: 'Beautiful shrine in the heart of Gion',
  },
  {
    name: 'Ninenzaka & Sannenzaka',
    lat: 34.9965,
    lng: 135.7845,
    description: 'Charming preserved streets leading to Kiyomizu-dera',
  },
  {
    name: 'Maruyama Park',
    lat: 35.0030,
    lng: 135.7780,
    description: 'Popular cherry blossom viewing spot',
  },
];

export default function VisitPage() {

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Gemini_Generated_Image_njk45ynjk45ynjk4.png"
          alt="Kiyomizu-dera Temple, Kyoto"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Slightly lighter overlays so the background image shows through more clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/70 to-stone-900/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-amber-900/10" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with YouTube Shorts - visible immediately */}
        <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] mb-6 sm:mb-8 text-center tracking-wide">
              Experience Taketora
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* YouTube Short 1 */}
              <div className="bg-stone-900/70 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-[9/16] w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/kC8viRPTW5A?autoplay=1&mute=1&loop=1&playlist=kC8viRPTW5A&controls=1&modestbranding=1&rel=0"
                    title="Taketora Experience"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
              </div>

              {/* YouTube Short 2 */}
              <div className="bg-stone-900/70 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-[9/16] w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Ow0XaLcdM3o?autoplay=1&mute=1&loop=1&playlist=Ow0XaLcdM3o&controls=1&modestbranding=1&rel=0"
                    title="Taketora Experience"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8 sm:mt-12 text-[#F2E8DC]/80 text-xs sm:text-sm tracking-[0.3em] uppercase font-light bg-stone-900/40 backdrop-blur-sm px-4 py-2 rounded-sm inline-block">
              Scroll to discover our Kyoto locations
            </div>
          </div>
        </section>

        {/* Info Section - revealed as you scroll */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <ScrollRevealSection>
            <div className="max-w-4xl mx-auto">
              <article className="bg-stone-900/70 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 sm:p-8 lg:p-10 shadow-2xl">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-4 sm:mb-6 tracking-wide">
                  Visit Taketora in Kyoto
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl font-light text-[#F2E8DC]/85 leading-relaxed">
                  Our three Kyoto boutiques sit just below Kiyomizu-dera in the Higashiyama district, tucked between
                  the temple paths, preserved stone streets, and traditional townhouses. As you make your way down from
                  the Kiyomizu stage toward Ninenzaka, Sannenzaka, and Gion, you can easily stop by Taketora to pick up
                  premium collectibles that feel right at home in this historic neighborhood.
                </p>
              </article>
            </div>
          </ScrollRevealSection>
        </section>

        {/* Shop Locations */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <ScrollRevealSection>
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-8 sm:mb-12 text-center tracking-wide">
                Our Kyoto Shops
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {shops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="bg-stone-900/70 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 sm:p-8 shadow-xl hover:border-[#D4AF37]/40 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-sm flex items-center justify-center mr-3">
                        <span className="text-stone-100 font-bold text-lg font-serif">{index + 1}</span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#D4AF37]">{shop.name}</h3>
                    </div>
                    <p className="text-[#F2E8DC]/80 text-sm sm:text-base font-light leading-relaxed mb-4">
                      {shop.address}
                    </p>
                  <div className="text-[#F2E8DC]/60 text-xs sm:text-sm font-light flex items-center justify-between gap-2">
                    <span>Open Daily: 10:00 - 20:00</span>
                    <span className="text-[#D4AF37] font-semibold">{shop.walkMinsFromKiyomizu} min walk from Kiyomizu-dera</span>
                  </div>
                  <div className="mt-4">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}&travelmode=walking`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#D4AF37] hover:text-[#F2E8DC] transition-colors duration-300 border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded px-3 py-2 bg-stone-900/60"
                    >
                      Get walking directions
                    </a>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealSection>
        </section>

        {/* Map & Neighborhood Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 pb-24">
          <ScrollRevealSection>
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-6 sm:mb-8 text-center tracking-wide">
                Explore the Neighborhood
              </h2>
              <p className="text-center text-[#F2E8DC]/80 text-base sm:text-lg mb-8 sm:mb-12 font-light max-w-2xl mx-auto">
                From Kiyomizu-dera to Fushimi Inari and Gion, our locations sit along the natural path most visitors
                walk when exploring Kyoto, making it easy to drop by before or after the temple.
              </p>

              {/* Google Maps Embed */}
              <div className="bg-stone-900/70 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.5!2d135.777!3d34.996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108d385dcfb07%3A0x62af658650c0baed!2sKiyomizu-dera!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    title="Taketora Locations in Kyoto"
                  />
                  {/* Fallback link */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <a
                      href="https://www.google.com/maps/search/Kiyomizu-dera,+Higashiyama+Ward,+Kyoto/@34.9948,135.7850,15z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-stone-900/90 backdrop-blur-sm border border-[#D4AF37]/30 text-[#D4AF37] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-stone-800/90 transition-colors duration-300 font-light"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Attractions List */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {attractions.map((attraction) => (
                  <div
                    key={attraction.name}
                    className="bg-stone-900/60 backdrop-blur-sm border border-[#D4AF37]/10 rounded-lg p-4 sm:p-5 hover:border-[#D4AF37]/30 transition-all duration-300"
                  >
                    <h3 className="font-serif text-lg sm:text-xl text-[#D4AF37] mb-2">{attraction.name}</h3>
                    <p className="text-[#F2E8DC]/70 text-xs sm:text-sm font-light">{attraction.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRevealSection>
        </section>
      </div>
    </div>
  );
}


import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Homepage() {
  // Keep your existing database connection safe here
  const supabase = createClient();
  const { data: products } = await supabase.from('products').select('*').limit(3);
  
  // Get the first category from products to link the button
  const firstCategory = products && products.length > 0 && products[0].category 
    ? products[0].category 
    : 'anime-figures'; // fallback

  return (
    <main className="relative w-full h-screen overflow-hidden">
      
      {/* --- HERO SECTION (Video Background) --- */}
      <section className="relative h-full w-full flex items-center justify-center">
        
        {/* 1. The Video Layer */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source 
            src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Taketorahorizontal.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* 2. The Luxury Overlay (Darkens bottom/center for readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/40 to-transparent" />

        {/* 3. The Content Layer */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          
          {/* Small "Eyebrow" Text */}
          <p className="mb-4 text-sm md:text-base font-medium tracking-[0.3em] text-[#D4AF37] uppercase animate-fade-in">
            Authentic Japanese Collectibles
          </p>
          
          {/* Main Title (Kyoto Style) */}
          <h1 className="mb-6 font-serif text-5xl md:text-8xl text-[#F2E8DC] drop-shadow-2xl tracking-wide">
            TAKETORA
          </h1>
          
          {/* Subtitle */}
          <p className="max-w-xl mx-auto font-light text-[#F2E8DC]/90 text-lg md:text-xl leading-relaxed mb-10">
            Experience the timeless spirit of Akihabara culture, curated for the discerning collector.
          </p>

          {/* CTA Button */}
          <Link 
            href={`/${firstCategory}`}
            className="group relative inline-block px-6 sm:px-8 py-2.5 sm:py-3 overflow-hidden border border-[#D4AF37] rounded-sm transition-all duration-300"
          >
            <span className="absolute inset-0 w-full h-full bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative text-[#D4AF37] tracking-widest text-xs sm:text-sm uppercase font-semibold group-hover:text-[#F2E8DC]">
              Explore Collection
            </span>
          </Link>

        </div>

        {/* Optional: Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#F2E8DC]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

      </section>

      {/* --- SECTION 2: PRODUCT PREVIEW (Just so you can see your data) --- */}
      <section className="bg-[#1a1a1a] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
          <h2 className="text-[#D4AF37] text-2xl sm:text-3xl lg:text-4xl font-serif">New Arrivals</h2>
          {firstCategory && (
            <Link
              href={`/${firstCategory}`}
              className="text-[#D4AF37] hover:text-[#F2E8DC] transition-colors duration-300 text-xs sm:text-sm uppercase tracking-wider border-b border-[#D4AF37] pb-1 whitespace-nowrap"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {products?.map((product) => {
            const productUrl = product.category && product.slug 
              ? `/${product.category}/${product.slug}`
              : product.slug 
              ? `/products/${product.slug}`
              : '#';
            
            return (
              <Link 
                key={product.id} 
                href={productUrl}
                className="bg-[#2a2a2a] p-3 sm:p-4 rounded-md border border-gray-800 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 group"
              >
                <div className="h-48 sm:h-56 lg:h-64 w-full relative mb-3 sm:mb-4 bg-black/50 overflow-hidden rounded">
                  <img 
                    src={product.image_url || 'https://placehold.co/600x400'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-1 sm:p-2 group-hover:scale-105 transition-transform duration-300"
                    style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <h3 className="text-[#F2E8DC] text-lg sm:text-xl font-serif group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-[#D4AF37] mt-2 font-semibold text-base sm:text-lg">
                  ¥{product.price?.toLocaleString('ja-JP') || '0'}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}
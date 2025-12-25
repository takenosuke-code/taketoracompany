import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import ScrollRevealSection from '@/components/ScrollRevealSection';

export default async function Homepage() {
  // Keep your existing database connection safe here
  const supabase = createClient();
  // Fetch from all tables ordered by date (newest first) - get more to sort properly
  const [animeResult, pokemonResult, antiqueResult] = await Promise.all([
    supabase.from('animefigure').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('pokemon').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('antique').select('*').order('created_at', { ascending: false }).limit(10),
  ]);
  
  // Combine all products and track their source table
  const allProducts: any[] = [];
  if (animeResult.data && animeResult.data.length > 0) {
    animeResult.data.forEach((product: any) => {
      allProducts.push({ ...product, _tableSource: 'animefigure' });
    });
  }
  if (pokemonResult.data && pokemonResult.data.length > 0) {
    pokemonResult.data.forEach((product: any) => {
      allProducts.push({ ...product, _tableSource: 'pokemon' });
    });
  }
  if (antiqueResult.data && antiqueResult.data.length > 0) {
    antiqueResult.data.forEach((product: any) => {
      allProducts.push({ ...product, _tableSource: 'antique' });
    });
  }
  
  // Sort by created_at (newest first) and take top 3
  allProducts.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
  
  const products = allProducts.slice(0, 3);
  
  // Get the first category from products to link the button
  const firstCategory = products && products.length > 0 && products[0].category 
    ? products[0].category 
    : 'anime-figures'; // fallback

  return (
    <div className="relative min-h-screen">
      {/* Fixed Video Background - stays visible as you scroll */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source 
            src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/Taketorahorizontal.mp4" 
            type="video/mp4" 
          />
        </video>
        {/* Base overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="h-screen w-full flex items-center justify-center pt-16 sm:pt-20">
          {/* Content Layer */}
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

        {/* --- PRODUCT CATEGORY SECTIONS --- */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 lg:space-y-14">
            
            {/* Anime Figures Section */}
            <ScrollRevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
                {/* Image - Left - matches description box height */}
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-amber-900/30 shadow-xl">
                  <Image
                    src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/rows%20of%20anime%20figs.JPG"
                    alt="Anime Figures Collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                
                {/* Description - Right - with overlay to make background less defined */}
                <div className="space-y-3 sm:space-y-4 bg-stone-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-amber-900/20 flex flex-col">
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide">
                    Anime Figures
                  </h2>
                  <p className="text-[#F2E8DC]/90 text-sm sm:text-base md:text-lg font-light leading-relaxed flex-grow">
                    Discover authentic Japanese anime figures imported directly from Japan. Our curated collection features 
                    premium collectibles from popular series, including limited editions and exclusive releases. Each figure 
                    is carefully selected for quality craftsmanship and comes with original packaging, ensuring authenticity 
                    and value for collectors.
                  </p>
                  <Link
                    href="/anime-figures"
                    className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-gray-950 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider font-semibold self-start"
                  >
                    Browse Anime Figures
                  </Link>
                </div>
              </div>
            </ScrollRevealSection>

            {/* Antiques Section */}
            <ScrollRevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
                {/* Image - Left - matches description box height */}
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-amber-900/30 shadow-xl">
                  <Image
                    src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/antique2.JPG"
                    alt="Antique Collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                
                {/* Description - Right - with overlay to make background less defined */}
                <div className="space-y-3 sm:space-y-4 bg-stone-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-amber-900/20 flex flex-col">
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide">
                    Antiques
                  </h2>
                  <p className="text-[#F2E8DC]/90 text-sm sm:text-base md:text-lg font-light leading-relaxed flex-grow">
                    Immerse yourself in Japan's rich cultural heritage with our curated collection of authentic antiques. 
                    From traditional ceramics and porcelain to vintage artifacts, each piece tells a story of Japan's timeless 
                    craftsmanship. Our antiques are sourced directly from Kyoto and surrounding regions, ensuring authenticity 
                    and historical significance for collectors and enthusiasts alike.
                  </p>
                  <Link
                    href="/antique"
                    className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-gray-950 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider font-semibold self-start"
                  >
                    Browse Antiques
                  </Link>
                </div>
              </div>
            </ScrollRevealSection>

          </div>
        </section>

        {/* --- SECTION 2: PRODUCT PREVIEW (New Arrivals) --- */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10 min-h-screen">
          <ScrollRevealSection>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
              <h2 className="text-[#D4AF37] text-2xl sm:text-3xl lg:text-4xl font-serif">New Arrivals</h2>
              <Link
                href="/collection"
                className="text-[#D4AF37] hover:text-[#F2E8DC] transition-colors duration-300 text-xs sm:text-sm uppercase tracking-wider border-b border-[#D4AF37] pb-1 whitespace-nowrap"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {products?.map((product: any) => {
                // Determine category slug based on table source
                let categorySlug = 'anime-figures'; // default
                if (product._tableSource === 'animefigure') {
                  categorySlug = 'anime-figures';
                } else if (product._tableSource === 'pokemon') {
                  categorySlug = 'pokemon';
                } else if (product._tableSource === 'antique') {
                  categorySlug = 'antique';
                } else {
                  // Fallback to category field if _tableSource not available
                  if (product.category) {
                    const cat = product.category.toLowerCase();
                    if (cat === 'pokemon' || cat === 'pokemoncard') {
                      categorySlug = 'pokemon';
                    } else if (cat === 'antique') {
                      categorySlug = 'antique';
                    }
                  }
                }
            
            const productUrl = product.slug && categorySlug
              ? `/${categorySlug}/${product.slug}`
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
          </ScrollRevealSection>
        </section>

      </div>
    </div>
  );
}
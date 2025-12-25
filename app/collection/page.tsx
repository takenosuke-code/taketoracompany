import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbItem } from '@/types/product';

export const metadata: Metadata = {
  title: 'Our Collection | Taketora - Premium Japanese Collectibles',
  description: 'Browse our complete collection of authentic anime figures, Pokemon cards, and Japanese antiques imported directly from Japan.',
};

interface CollectionPageProps {
  searchParams?: {
    category?: string;
    subcategory?: string;
  };
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const supabase = createClient();
  
  // Fetch directly from tables
  const [animeFiguresResult, pokemonCardsResult, antiquesResult] = await Promise.all([
    supabase.from('animefigure').select('*').order('category', { ascending: true }),
    supabase.from('pokemon').select('*').order('category', { ascending: true }),
    supabase.from('antique').select('*').order('category', { ascending: true }),
  ]);

  // Log errors for debugging
  if (animeFiguresResult.error) {
    console.error('Error fetching anime figures:', animeFiguresResult.error);
  }
  if (pokemonCardsResult.error) {
    console.error('❌ [COLLECTION DEBUG] Error fetching pokemon cards:', pokemonCardsResult.error);
  }
  if (antiquesResult.error) {
    console.error('Error fetching antiques:', antiquesResult.error);
  }
  
  // DEBUG: Log Pokemon cards fetch results
  console.log('🔍 [COLLECTION DEBUG] Pokemon cards fetch result:');
  console.log('  - Error:', pokemonCardsResult.error);
  console.log('  - Data count:', pokemonCardsResult.data?.length || 0);
  console.log('  - Raw data:', pokemonCardsResult.data);

  // Group products by table (product type) and then by category field
  const groupedProducts: Record<string, Record<string, any[]>> = {};
  
  // Process anime figures
  if (animeFiguresResult.data && animeFiguresResult.data.length > 0) {
    groupedProducts['anime-figures'] = {};
    animeFiguresResult.data.forEach((product: any) => {
      const category = product.category || 'other';
      if (!groupedProducts['anime-figures'][category]) {
        groupedProducts['anime-figures'][category] = [];
      }
      groupedProducts['anime-figures'][category].push(product);
    });
  }
  
  // Process pokemon cards - category field is "pokemon"
  if (pokemonCardsResult.data && pokemonCardsResult.data.length > 0) {
    console.log('🔍 [COLLECTION DEBUG] Processing Pokemon cards...');
    groupedProducts['pokemon'] = {};
    pokemonCardsResult.data.forEach((product: any) => {
      // The category field in pokemon table is "pokemon"
      const category = product.category || 'other';
      console.log(`  - Pokemon card: ${product.name || product.id}, Category: "${category}"`);
      if (!groupedProducts['pokemon'][category]) {
        groupedProducts['pokemon'][category] = [];
      }
      groupedProducts['pokemon'][category].push(product);
    });
    console.log('🔍 [COLLECTION DEBUG] Pokemon cards grouped by category:', Object.keys(groupedProducts['pokemon']));
    console.log('🔍 [COLLECTION DEBUG] Full Pokemon grouped structure:', groupedProducts['pokemon']);
  } else {
    console.log('⚠️ [COLLECTION DEBUG] No Pokemon cards found - data is empty or null');
  }
  
  // Process antiques
  if (antiquesResult.data && antiquesResult.data.length > 0) {
    groupedProducts['antique'] = {};
    antiquesResult.data.forEach((product: any) => {
      const category = product.category || 'other';
      if (!groupedProducts['antique'][category]) {
        groupedProducts['antique'][category] = [];
      }
      groupedProducts['antique'][category].push(product);
    });
  }

  // Filter by product type if specified - create a new filtered object
  let filteredGroupedProducts = groupedProducts;
  if (searchParams?.category) {
    const categoryFilter = searchParams.category.toLowerCase();
    const filtered: Record<string, Record<string, any[]>> = {};
    if (categoryFilter === 'anime-figures' || categoryFilter === 'animefigure') {
      if (groupedProducts['anime-figures']) {
        filtered['anime-figures'] = groupedProducts['anime-figures'];
      }
    } else if (categoryFilter === 'pokemon' || categoryFilter === 'pokémon') {
      if (groupedProducts['pokemon']) {
        filtered['pokemon'] = groupedProducts['pokemon'];
      }
    } else if (categoryFilter === 'antique') {
      if (groupedProducts['antique']) {
        filtered['antique'] = groupedProducts['antique'];
      }
    }
    filteredGroupedProducts = filtered;
  }

  // Filter by subcategory (category field) if specified
  // For pokemon cards, if subcategory is "Popular", show all pokemon cards (category is "pokemon")
  if (searchParams?.subcategory) {
    const subcategoryFiltered: Record<string, Record<string, any[]>> = {};
    Object.keys(filteredGroupedProducts).forEach(productType => {
      subcategoryFiltered[productType] = {};
      Object.keys(filteredGroupedProducts[productType]).forEach(category => {
        const categoryLower = category.toLowerCase();
        const subcategoryLower = searchParams.subcategory?.toLowerCase() || '';
        // For pokemon, if subcategory is "Popular", show all pokemon categories
        // Otherwise match exactly
        if (productType === 'pokemon' && subcategoryLower === 'popular') {
          // Show all pokemon card categories when filtering by "Popular"
          subcategoryFiltered[productType][category] = filteredGroupedProducts[productType][category];
        } else if (categoryLower === subcategoryLower) {
          subcategoryFiltered[productType][category] = filteredGroupedProducts[productType][category];
        }
      });
      // Remove empty product types
      if (Object.keys(subcategoryFiltered[productType]).length === 0) {
        delete subcategoryFiltered[productType];
      }
    });
    filteredGroupedProducts = subcategoryFiltered;
  }

  // Format names for display
  const formatProductTypeName = (type: string): string => {
    const names: Record<string, string> = {
      'anime-figures': 'Anime Figures',
      'pokemon': 'Pokémon Cards',
      'antique': 'Antiques',
    };
    return names[type] || type;
  };

  const formatCategoryName = (name: string): string => {
    if (!name || name === 'other') return 'Other';
    // Handle "pokemon" -> "Pokémon Cards"
    if (name.toLowerCase() === 'pokemon') {
      return 'Pokémon Cards';
    }
    return name
      .split(/[-_\s]/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Build breadcrumbs for SEO
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Our Collection', href: '/collection' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-amber-500/25 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <div className="mb-3 sm:mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#F2E8DC] mb-4 tracking-wide">
            Our Collection
          </h1>
          <p className="text-[#F2E8DC]/70 text-base sm:text-lg font-light max-w-3xl">
            Discover our complete range of authentic Japanese collectibles, from premium anime figures to rare Pokemon cards and traditional antiques.
          </p>
        </div>

        {/* Products by Table (Product Type) and Category */}
        {Object.keys(filteredGroupedProducts).length > 0 ? (
          <div className="space-y-12 sm:space-y-16">
            {Object.entries(filteredGroupedProducts).map(([productType, categories]) => (
              <div key={productType} className="space-y-6 sm:space-y-8">
                {/* Product Type Header (Table Name) */}
                <div className="border-b-2 border-amber-900/40 pb-3 sm:pb-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#D4AF37] tracking-wide">
                    {formatProductTypeName(productType)}
                  </h2>
                </div>

                {/* Categories (from category field in table) - Popular first, then others */}
                {Object.entries(categories)
                  .sort(([a], [b]) => {
                    // Always put "popular" category first (case-insensitive)
                    const aLower = a.toLowerCase();
                    const bLower = b.toLowerCase();
                    if (aLower === 'popular') return -1;
                    if (bLower === 'popular') return 1;
                    return a.localeCompare(b);
                  })
                  .map(([categoryName, categoryProducts]) => {
                  if (!categoryProducts || categoryProducts.length === 0) return null;
                  
                  const displayCategoryName = formatCategoryName(categoryName);
                  
                  return (
                    <div key={categoryName} className="space-y-4 sm:space-y-6">
                      {/* Category Header */}
                      <div className="border-b border-amber-900/30 pb-2 sm:pb-3">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                          {displayCategoryName}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-1">
                          {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
                        </p>
                      </div>
                      
                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {categoryProducts.map((product: any) => {
                          // Determine the correct category slug for routing
                          let categorySlug = 'anime-figures';
                          if (productType === 'pokemon') {
                            // Pokemon cards route to /pokemon
                            categorySlug = 'pokemon';
                          } else if (productType === 'antique') {
                            categorySlug = 'antique';
                          }
                          
                          const productUrl = product.slug && categorySlug
                            ? `/${categorySlug}/${product.slug}`
                            : '#';
                          
                          return (
                            <Link
                              key={product.id}
                              href={productUrl}
                              className="group bg-gradient-to-b from-stone-900/90 to-stone-950/90 backdrop-blur-sm border border-amber-900/30 rounded-lg overflow-hidden hover:border-amber-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20"
                            >
                              {/* Image Container */}
                              <div className="aspect-[4/3] w-full relative bg-gradient-to-br from-stone-800/50 to-stone-900/50 overflow-hidden">
                                {product.image_url || product.image ? (
                                  <Image
                                    src={product.image_url || product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/30">
                                    <span className="text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                                <h3 className="font-serif text-base sm:text-lg text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                                  {product.name}
                                </h3>
                                
                                <p className="text-[10px] sm:text-xs text-[#F2E8DC]/70 font-light line-clamp-2 leading-tight mb-1">
                                  {product.description}
                                </p>
                                
                                {/* Stock Status */}
                                <div className="flex items-center gap-2 mb-1.5">
                                  {product.instock === true || product.in_stock === true || product.stock > 0 ? (
                                    <span className="text-[10px] sm:text-xs text-amber-400 font-light">In Stock</span>
                                  ) : (
                                    <span className="text-[10px] sm:text-xs text-red-400/70 font-light">Out of Stock</span>
                                  )}
                                </div>
                                
                                {/* Price */}
                                <p className="text-lg sm:text-xl text-[#D4AF37] font-light">
                                  ¥{product.price?.toLocaleString('ja-JP') || '0'}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-[#F2E8DC]/60 text-lg sm:text-xl font-light">
              No products available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


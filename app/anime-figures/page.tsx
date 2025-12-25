import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { BreadcrumbItem } from '@/types/product';

export const metadata: Metadata = {
  title: 'Anime Figures | Taketora - Premium Japanese Collectibles',
  description: 'Browse our collection of authentic anime figures imported directly from Japan. Premium quality collectibles with original packaging.',
};

export default async function AnimeFiguresPage() {
  const supabase = createClient();
  
  // Fetch all anime figure products from Supabase
  const { data: products, error } = await supabase
    .from('animefigure')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching anime figures:', error);
  }

  // Group products by category field (check category first, then sub_category as fallback)
  const groupedProducts: Record<string, typeof products> = {};
  const productsWithoutCategory: typeof products = [];

  if (products) {
    products.forEach((product: any) => {
      // Check both category and sub_category fields
      const category = product.category || product.sub_category || product.subcategory;
      if (category) {
        if (!groupedProducts[category]) {
          groupedProducts[category] = [];
        }
        groupedProducts[category].push(product);
      } else {
        productsWithoutCategory.push(product);
      }
    });
  }

  // Format category name for display
  const formatCategoryName = (name: string): string => {
    if (!name || name === 'other') return 'Other';
    return name
      .split(/[-_\s]/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-amber-500/25 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* No breadcrumbs for anime-figures page - clean layout */}

        {/* Products by Category */}
        {products && products.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Render each category section - Popular first, then others */}
            {Object.entries(groupedProducts)
              .sort(([a], [b]) => {
                // Always put "popular" category first (case-insensitive)
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();
                if (aLower === 'popular') return -1;
                if (bLower === 'popular') return 1;
                return a.localeCompare(b);
              })
              .map(([categorySlug, categoryProducts]) => {
              if (!categoryProducts || categoryProducts.length === 0) return null;
              
              const categoryName = formatCategoryName(categorySlug);
              
              return (
                <div key={categorySlug} className="space-y-3 sm:space-y-4">
                  {/* Category Header */}
                  <div className="border-b border-amber-900/30 pb-2 sm:pb-3">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                      {categoryName}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-1">
                      {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
                    </p>
                  </div>

                  {/* Products Grid for this category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {categoryProducts.map((product: any) => {
                      const productUrl = product.slug 
                        ? `/anime-figures/${product.slug}`
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

            {/* Products without category (if any) */}
            {productsWithoutCategory.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {/* Header for products without category */}
                <div className="border-b border-amber-900/30 pb-2 sm:pb-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                    Other Products
                  </h2>
                  <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-1">
                    {productsWithoutCategory.length} {productsWithoutCategory.length === 1 ? 'product' : 'products'} available
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {productsWithoutCategory.map((product: any) => {
                    const productUrl = product.slug 
                      ? `/anime-figures/${product.slug}`
                      : '#';
                    
                    return (
                      <Link
                        key={product.id}
                        href={productUrl}
                        className="group bg-gradient-to-b from-stone-900/90 to-stone-950/90 backdrop-blur-sm border border-amber-900/30 rounded-lg overflow-hidden hover:border-amber-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20"
                      >
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
                        
                        <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                          <h3 className="font-serif text-base sm:text-lg text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                          
                          <p className="text-[10px] sm:text-xs text-[#F2E8DC]/70 font-light line-clamp-2 leading-tight mb-1">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-1.5">
                            {product.instock === true || product.in_stock === true || product.stock > 0 ? (
                              <span className="text-[10px] sm:text-xs text-amber-400 font-light">In Stock</span>
                            ) : (
                              <span className="text-[10px] sm:text-xs text-red-400/70 font-light">Out of Stock</span>
                            )}
                          </div>
                          
                          <p className="text-lg sm:text-xl text-[#D4AF37] font-light">
                            ¥{product.price?.toLocaleString('ja-JP') || '0'}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-[#F2E8DC]/60 text-lg sm:text-xl font-light">
              No anime figures available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


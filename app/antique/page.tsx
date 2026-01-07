import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbItem } from '@/types/product';

export const metadata: Metadata = {
  title: 'Antique Collection | Taketora - Authentic Japanese Antiques',
  description: 'Discover our curated collection of authentic Japanese antiques, including porcelain, ceramics, and traditional artifacts from Kyoto and beyond.',
};

export default async function AntiquePage() {
  const supabase = createClient();
  
  // Fetch all antique products from Supabase
  const { data: products, error } = await supabase
    .from('antique')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching antique products:', error);
  }

  // Group products by subcategory
  const groupedProducts: Record<string, typeof products> = {};
  const productsWithoutSubcategory: typeof products = [];

  if (products) {
    products.forEach((product: any) => {
      const category = product.category || product.sub_category || product.subcategory;
      if (category) {
        if (!groupedProducts[category]) {
          groupedProducts[category] = [];
        }
        groupedProducts[category].push(product);
      } else {
        productsWithoutSubcategory.push(product);
      }
    });
  }

  // Format subcategory name for display
  const formatSubcategoryName = (slug: string): string => {
    return slug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Build breadcrumbs for SEO
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Antique Collection', href: '/antique' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/5 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets/wafustyle.png"
          alt="Wafu style background"
          fill
          className="object-cover opacity-50"
          priority
        />
        {/* Lighter overlay for better background visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/50 to-gray-950/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <div className="mb-3 sm:mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center relative">
          {/* Decorative line above title */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            <div className="mx-4 text-amber-400/40 text-2xl">◆</div>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#D4AF37] mb-4 sm:mb-6 tracking-wide drop-shadow-lg">
            古美術コレクション
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F2E8DC]/90 mb-4 sm:mb-6 tracking-wide">
            Antique Collection
          </h2>
          <p className="text-[#F2E8DC]/75 text-sm sm:text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed italic">
            Curated selection of authentic Japanese antiques, traditional ceramics, and porcelain. 
            Each piece embodies Japan&apos;s rich cultural heritage and timeless craftsmanship.
          </p>
          
          {/* Decorative line below description */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            <div className="mx-4 text-amber-400/40 text-2xl">◆</div>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Products by Subcategory */}
        {products && products.length > 0 ? (
          <div className="space-y-8 sm:space-y-12">
            {/* Render each subcategory section */}
            {Object.entries(groupedProducts)
              .sort(([a], [b]) => {
                // Always put "popular" category first (case-insensitive)
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();
                if (aLower === 'popular') return -1;
                if (bLower === 'popular') return 1;
                return a.localeCompare(b);
              })
              .map(([subCategorySlug, subCategoryProducts]) => {
              if (!subCategoryProducts || subCategoryProducts.length === 0) return null;
              
              const subCategoryName = formatSubcategoryName(subCategorySlug);
              
              return (
                <div key={subCategorySlug} className="space-y-4 sm:space-y-6">
                  {/* Subcategory Header */}
                  <div className="border-b border-amber-800/40 pb-3 sm:pb-4 relative">
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide pl-4 sm:pl-6 drop-shadow-md">
                      {subCategoryName}
                    </h2>
                    <div className="text-[#F2E8DC]/60 text-sm sm:text-base font-light mt-1 pl-4 sm:pl-6 italic">
                      <span>{subCategoryProducts.length}</span> <span>{subCategoryProducts.length === 1 ? 'piece' : 'pieces'}</span> available
                    </div>
                  </div>
                  
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {subCategoryProducts.map((product: any) => {
                      const productUrl = product.slug 
                        ? `/antique/${product.slug}`
                        : '#';
                      
                      return (
                        <Link
                          key={product.id}
                          href={productUrl}
                          className="group bg-transparent backdrop-blur-sm border border-amber-800/30 rounded-lg overflow-hidden hover:border-amber-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20 hover:-translate-y-0.5"
                        >
                          {/* Image Container */}
                          <div className="aspect-[4/3] w-full relative bg-transparent overflow-hidden backdrop-blur-sm">
                            {product.image_url || product.image ? (
                              <Image
                                src={product.image_url || product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#F2E8DC]/30">
                                <span className="text-xs italic">No Image</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-4 sm:p-5 lg:p-6 space-y-2.5 bg-transparent backdrop-blur-sm">
                            <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                            
                            <p className="text-[11px] sm:text-xs text-[#F2E8DC]/70 font-light line-clamp-2 leading-relaxed mb-2 italic">
                              {product.description}
                            </p>
                            
                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-2">
                              {product.instock === true || product.in_stock === true || product.stock > 0 ? (
                                <span className="text-[10px] sm:text-xs text-amber-300 font-light px-2 py-0.5 bg-amber-400/5 rounded border border-amber-400/15">
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-[10px] sm:text-xs text-red-400/70 font-light px-2 py-0.5 bg-red-400/10 rounded border border-red-400/20">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            
                            {/* Price */}
                            <div className="pt-2 border-t border-amber-800/20">
                              <p className="text-xl sm:text-2xl text-[#D4AF37] font-serif tracking-wide">
                                ¥{typeof product.price === 'number' ? product.price.toLocaleString('ja-JP') : '0'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {/* Products without subcategory */}
            {productsWithoutSubcategory && productsWithoutSubcategory.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b border-amber-800/40 pb-3 sm:pb-4 relative backdrop-blur-sm bg-stone-900/20 rounded-t-lg px-2">
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] tracking-wide pl-4 sm:pl-6 drop-shadow-lg">
                    Other Antiques
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {productsWithoutSubcategory.map((product: any) => {
                    const productUrl = product.slug 
                      ? `/antique/${product.slug}`
                      : '#';
                    
                    return (
                        <Link
                          key={product.id}
                          href={productUrl}
                          className="group bg-transparent backdrop-blur-sm border border-amber-800/30 rounded-lg overflow-hidden hover:border-amber-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20 hover:-translate-y-0.5"
                        >
                        <div className="aspect-[4/3] w-full relative bg-transparent overflow-hidden backdrop-blur-sm">
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
                              <span className="text-xs italic">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 sm:p-5 lg:p-6 space-y-2.5 bg-transparent backdrop-blur-sm">
                          <h3 className="font-serif text-base sm:text-lg md:text-xl text-[#F2E8DC] group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                          
                          <p className="text-[11px] sm:text-xs text-[#F2E8DC]/70 font-light line-clamp-2 leading-relaxed mb-2 italic">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {product.instock === true || product.in_stock === true || product.stock > 0 ? (
                              <span className="text-[10px] sm:text-xs text-amber-300 font-light px-2 py-0.5 bg-amber-400/5 rounded border border-amber-400/15">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs text-red-400/70 font-light px-2 py-0.5 bg-red-400/10 rounded border border-red-400/20">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          
                          <div className="pt-2 border-t border-amber-800/20">
                            <p className="text-xl sm:text-2xl text-[#D4AF37] font-serif tracking-wide">
                              ¥{typeof product.price === 'number' ? product.price.toLocaleString('ja-JP') : '0'}
                            </p>
                          </div>
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
              No antique items available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


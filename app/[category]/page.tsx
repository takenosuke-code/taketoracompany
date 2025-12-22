import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbItem } from '@/types/product';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.category
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} | Taketora - Premium Japanese Collectibles`,
    description: `Browse our collection of authentic ${categoryName.toLowerCase()} imported directly from Japan. Premium quality collectibles with original packaging.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient();
  
  // Fetch all products for this category from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', params.category)
    .order('sub_category', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Format category name for display
  const categoryName = params.category
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Group products by subcategory (check both sub_category and subcategory)
  const groupedProducts: Record<string, typeof products> = {};
  const productsWithoutSubcategory: typeof products = [];

  if (products) {
    products.forEach((product: any) => {
      const subCategory = product.sub_category || product.subcategory;
      if (subCategory) {
        if (!groupedProducts[subCategory]) {
          groupedProducts[subCategory] = [];
        }
        groupedProducts[subCategory].push(product);
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
    { label: categoryName, href: `/${params.category}` },
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

        {/* Products by Subcategory */}
        {products && products.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Render each subcategory section */}
            {Object.entries(groupedProducts).map(([subCategorySlug, subCategoryProducts]) => {
              if (!subCategoryProducts || subCategoryProducts.length === 0) return null;
              
              const subCategoryName = formatSubcategoryName(subCategorySlug);
              
              return (
                <div key={subCategorySlug} className="space-y-3 sm:space-y-4">
                  {/* Subcategory Header */}
                  <div className="border-b border-amber-900/30 pb-2 sm:pb-3">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                      {subCategoryName}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-1">
                      {subCategoryProducts.length} {subCategoryProducts.length === 1 ? 'product' : 'products'} available
                    </p>
                  </div>

                  {/* Products Grid for this subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {subCategoryProducts.map((product: any) => {
                      const productUrl = `/${params.category}/${product.slug || product.id}`;
                      
                      return (
                        <Link
                          key={product.id}
                          href={productUrl}
                          className="group relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-lg border border-amber-900/30 overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20"
                        >
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-600/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-600/5 group-hover:to-amber-500/10 transition-all duration-500 rounded-lg"></div>
                          
                          {/* Product Image */}
                          <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden flex items-center justify-center">
                            {product.image_url || product.image ? (
                              <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                                <Image
                                  src={product.image_url || product.image}
                                  alt={product.name}
                                  width={800}
                                  height={800}
                                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[#F2E8DC]/40">No image</span>
                              </div>
                            )}
                            {/* Subtle overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          </div>

                          {/* Product Info */}
                          <div className="relative p-2 sm:p-2.5">
                            <h3 className="font-serif text-sm sm:text-base text-[#F2E8DC] mb-1 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                              {product.name}
                            </h3>
                            
                            {/* Brand */}
                            {product.brand && (
                              <p className="text-[10px] sm:text-xs text-[#F2E8DC]/60 mb-0.5">{product.brand}</p>
                            )}

                            {/* Description */}
                            {product.description && (
                              <p className="text-[10px] sm:text-xs text-[#F2E8DC]/70 mb-1 line-clamp-2 leading-tight">
                                {product.description}
                              </p>
                            )}

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-1 mb-1">
                              {product.original_box && (
                                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-green-900/40 text-green-300 rounded border border-green-700/50 backdrop-blur-sm">
                                  Original Box
                                </span>
                              )}
                              {product.copyright_sticker && (
                                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-blue-900/40 text-blue-300 rounded border border-blue-700/50 backdrop-blur-sm">
                                  Copyright Sticker
                                </span>
                              )}
                              {product.condition && (
                                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-amber-900/40 text-amber-300 rounded border border-amber-700/50 backdrop-blur-sm">
                                  {product.condition}
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <p className="text-base sm:text-lg font-bold text-[#D4AF37] mb-1">
                              ¥{product.price?.toLocaleString('ja-JP') || '0'}
                            </p>

                            {/* Stock Status */}
                            <div className="pt-1 border-t border-amber-900/30">
                              {product.instock === true || product.in_stock === true || product.is_in_stock === true || product.available === true || product.is_available === true ? (
                                <span className="text-[10px] sm:text-xs text-green-400 font-medium flex items-center gap-1">
                                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-[10px] sm:text-xs text-red-400 font-medium">
                                  ✗ Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Products without subcategory (if any) */}
            {productsWithoutSubcategory.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {/* Header for products without subcategory */}
                <div className="border-b border-amber-900/30 pb-2 sm:pb-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#F2E8DC] drop-shadow-lg">
                    Other Products
                  </h2>
                  <p className="text-xs sm:text-sm text-[#F2E8DC]/60 mt-1">
                    {productsWithoutSubcategory.length} {productsWithoutSubcategory.length === 1 ? 'product' : 'products'} available
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {productsWithoutSubcategory.map((product: any) => {
                    const productUrl = `/${params.category}/${product.slug || product.id}`;
                    
                    return (
                      <Link
                        key={product.id}
                        href={productUrl}
                        className="group relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-lg border border-amber-900/30 overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-600/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-600/5 group-hover:to-amber-500/10 transition-all duration-500 rounded-lg"></div>
                        
                        {/* Product Image */}
                        <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden flex items-center justify-center">
                          {product.image_url || product.image ? (
                            <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
                              <Image
                                src={product.image_url || product.image}
                                alt={product.name}
                                width={800}
                                height={800}
                                className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[#F2E8DC]/40">No image</span>
                            </div>
                          )}
                          {/* Subtle overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>

                        {/* Product Info */}
                        <div className="relative p-2 sm:p-2.5">
                          <h3 className="font-serif text-sm sm:text-base text-[#F2E8DC] mb-1 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Brand */}
                          {product.brand && (
                            <p className="text-[10px] sm:text-xs text-[#F2E8DC]/60 mb-0.5">{product.brand}</p>
                          )}

                          {/* Description */}
                          {product.description && (
                            <p className="text-[10px] sm:text-xs text-[#F2E8DC]/70 mb-1 line-clamp-2 leading-tight">
                              {product.description}
                            </p>
                          )}

                          {/* Trust Signals */}
                          <div className="flex flex-wrap gap-1 mb-1">
                            {product.original_box && (
                              <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-green-900/40 text-green-300 rounded border border-green-700/50 backdrop-blur-sm">
                                Original Box
                              </span>
                            )}
                            {product.copyright_sticker && (
                              <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-blue-900/40 text-blue-300 rounded border border-blue-700/50 backdrop-blur-sm">
                                Copyright Sticker
                              </span>
                            )}
                            {product.condition && (
                              <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-amber-900/40 text-amber-300 rounded border border-amber-700/50 backdrop-blur-sm">
                                {product.condition}
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <p className="text-base sm:text-lg font-bold text-[#D4AF37] mb-1">
                            ¥{product.price?.toLocaleString('ja-JP') || '0'}
                          </p>

                          {/* Stock Status */}
                          <div className="pt-1 border-t border-amber-900/30">
                            {product.instock === true || product.in_stock === true || product.is_in_stock === true || product.available === true || product.is_available === true ? (
                              <span className="text-[10px] sm:text-xs text-green-400 font-medium flex items-center gap-1">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs text-red-400 font-medium">
                                ✗ Out of Stock
                              </span>
                            )}
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
          <div className="text-center py-12 sm:py-20">
            <p className="text-lg sm:text-xl text-[#F2E8DC]/80 mb-4 sm:mb-6 px-4">
              No products found in this category.
            </p>
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border border-[#D4AF37] text-[#D4AF37] rounded-sm hover:bg-[#D4AF37]/10 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 text-sm sm:text-base"
            >
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


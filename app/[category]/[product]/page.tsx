import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductDetail from '@/components/ProductDetail';
import CurrencyConverter from '@/components/CurrencyConverter';
import { BreadcrumbItem } from '@/types/product';

interface ProductPageProps {
  params: {
    category: string;
    product: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.product)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Taketora',
    };
  }

  return {
    title: `${product.name} | Taketora - Premium Japanese Collectibles`,
    description: product.description || `Authentic ${product.name} imported directly from Japan. Premium quality collectible with original packaging.`,
    openGraph: {
      title: product.name,
      description: product.description || `Authentic ${product.name} imported directly from Japan.`,
      images: product.image_url ? [product.image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Authentic ${product.name} imported directly from Japan.`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();
  
  // Fetch product from Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.product)
    .single();

  if (error || !product) {
    notFound();
  }

  // Build breadcrumbs for SEO
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, ' '), href: `/${params.category}` },
    { label: product.name, href: `/${params.category}/${params.product}` },
  ];

  // Prepare product data for ProductDetail component
  // Map Supabase fields to Product interface
  const productData = {
    id: product.id,
    slug: product.slug || params.product,
    name: product.name,
    description: product.description || '',
    category: product.category || params.category,
    subcategory: product.subcategory || undefined,
    price: product.price || 0,
    currency: 'JPY' as const,
    image: product.image_url || product.image || '',
    images: product.images || (product.image_url ? [product.image_url] : []),
    brand: product.brand || undefined,
    stock: product.stock || 0,
    condition: (product.condition || 'New') as 'New' | 'Used' | 'Mint',
    copyrightSticker: product.copyright_sticker || false,
    originalBox: product.original_box || false,
    dimensions: typeof product.dimensions === 'string' 
      ? JSON.parse(product.dimensions) 
      : product.dimensions || undefined,
    weight: product.weight || undefined,
    tags: product.tags || [],
    // Add boolean stock fields for ProductDetail component
    instock: product.instock === true,
    in_stock: product.in_stock === true || product.is_in_stock === true || product.available === true || product.is_available === true,
    is_in_stock: product.is_in_stock === true,
    available: product.available === true,
    is_available: product.is_available === true,
  };

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.image_url || product.image || '',
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: 'JPY',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: product.condition ? `https://schema.org/${product.condition}Condition` : 'https://schema.org/NewCondition',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count || 0,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-amber-500/25 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mt-4 sm:mt-8">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-lg overflow-hidden border border-amber-900/30 shadow-xl flex items-center justify-center">
              {product.image_url || product.image ? (
                <div className="w-full h-full flex items-center justify-center p-2 sm:p-3">
                  <Image
                    src={product.image_url || product.image}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/40">
                  <span className="text-[#F2E8DC]/40 text-sm sm:text-base">No image available</span>
                </div>
              )}
            </div>

            {/* Additional Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {product.images.slice(0, 4).map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square bg-gradient-to-b from-gray-900/90 to-gray-950/90 rounded border border-amber-900/30 overflow-hidden backdrop-blur-sm">
                    <Image
                      src={img}
                      alt={`${product.name} - View ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12.5vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-[#D4AF37] bg-amber-900/40 rounded-full border border-amber-700/50 backdrop-blur-sm">
                {product.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#F2E8DC] tracking-tight drop-shadow-lg leading-tight">
              {product.name}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-base sm:text-lg text-[#F2E8DC]/70 font-medium">
                Brand: <span className="text-[#F2E8DC]">{product.brand}</span>
              </p>
            )}

            {/* Price */}
            <div className="space-y-2">
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                ¥{product.price?.toLocaleString('ja-JP') || '0'}
              </p>
              <CurrencyConverter amountJPY={product.price || 0} />
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {product.original_box && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-900/40 border border-green-700/50 rounded-lg backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-green-300">Original Box</span>
                </div>
              )}
              {product.copyright_sticker && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-900/40 border border-blue-700/50 rounded-lg backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-blue-300">Copyright Sticker</span>
                </div>
              )}
              {product.condition && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-amber-900/40 border border-amber-700/50 rounded-lg backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium text-amber-300">
                    Condition: {product.condition}
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="pt-3 sm:pt-4 border-t border-amber-900/30">
              {product.instock === true || product.in_stock === true || product.is_in_stock === true || product.available === true || product.is_available === true ? (
                <p className="text-sm sm:text-base text-green-400 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                  <span>In Stock</span>
                </p>
              ) : (
                <p className="text-sm sm:text-base text-red-400 font-medium">✗ Out of Stock</p>
              )}
            </div>

            {/* Product Detail Component (Add to Cart) */}
            <ProductDetail product={productData} />

            {/* Description */}
            {product.description && (
              <div className="pt-4 sm:pt-6 border-t border-amber-900/30">
                <h2 className="text-lg sm:text-xl font-semibold text-[#F2E8DC] mb-2 sm:mb-3">Description</h2>
                <p className="text-sm sm:text-base text-[#F2E8DC]/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Specifications */}
            {(product.dimensions || product.weight) && (
              <div className="pt-4 sm:pt-6 border-t border-amber-900/30">
                <h2 className="text-lg sm:text-xl font-semibold text-[#F2E8DC] mb-2 sm:mb-3">Specifications</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.dimensions && (() => {
                    const dims = typeof product.dimensions === 'string' 
                      ? JSON.parse(product.dimensions) 
                      : product.dimensions;
                    return dims ? (
                      <>
                        <dt className="text-xs sm:text-sm font-medium text-[#F2E8DC]/70">Dimensions</dt>
                        <dd className="text-xs sm:text-sm text-[#F2E8DC]">
                          {dims.height} × {dims.width} × {dims.depth} {dims.unit || 'cm'}
                        </dd>
                      </>
                    ) : null;
                  })()}
                  {product.weight && (
                    <>
                      <dt className="text-xs sm:text-sm font-medium text-[#F2E8DC]/70">Weight</dt>
                      <dd className="text-xs sm:text-sm text-[#F2E8DC]">{product.weight}g</dd>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 sm:pt-6 border-t border-amber-900/30">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-[#F2E8DC]/70 bg-amber-900/40 border border-amber-700/50 rounded-full backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}


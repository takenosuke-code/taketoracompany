import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taketora.com';
  const supabase = createClient();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Fetch products from Supabase
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at');

    if (products) {
      products.forEach((product) => {
        routes.push({
          url: `${baseUrl}/products/${product.id}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }
  } catch {
    // If products table doesn't exist or error, just return homepage
  }

  return routes;
}

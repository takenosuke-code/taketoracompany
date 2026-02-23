import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

function getWordPressEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    return '';
  }
  if (endpoint.startsWith('WORDPRESS_GRAPHQL_ENDPOINT=')) {
    return endpoint.replace('WORDPRESS_GRAPHQL_ENDPOINT=', '');
  }
  return endpoint;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taketora-antique.com';
  const supabase = createClient();

  const routes: MetadataRoute.Sitemap = [
    // Static pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/anime-figures`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pokemon`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/antique`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/visit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Fetch products from all Supabase tables
  try {
    const [animeResult, pokemonResult, antiqueResult] = await Promise.all([
      supabase.from('animefigure').select('slug, updated_at, created_at'),
      supabase.from('pokemon').select('slug, updated_at, created_at'),
      supabase.from('antique').select('slug, updated_at, created_at'),
    ]);

    // Add anime figure products
    if (animeResult.data) {
      animeResult.data.forEach((product) => {
        if (product.slug) {
          routes.push({
            url: `${baseUrl}/anime-figures/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }

    // Add pokemon products
    if (pokemonResult.data) {
      pokemonResult.data.forEach((product) => {
        if (product.slug) {
          routes.push({
            url: `${baseUrl}/pokemon/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }

    // Add antique products
    if (antiqueResult.data) {
      antiqueResult.data.forEach((product) => {
        if (product.slug) {
          routes.push({
            url: `${baseUrl}/antique/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch blog posts from WordPress
  try {
    const endpoint = getWordPressEndpoint();
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetBlogSlugs {
              allBlog {
                nodes {
                  slug
                  date
                }
              }
            }
          `,
        }),
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.allBlog?.nodes) {
          result.data.allBlog.nodes.forEach((blog: any) => {
            if (blog.slug) {
              routes.push({
                url: `${baseUrl}/blog/${blog.slug}`,
                lastModified: blog.date ? new Date(blog.date) : new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
              });
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return routes;
}

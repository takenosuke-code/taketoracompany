import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

function getWordPressEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) return "";
  if (endpoint.startsWith("WORDPRESS_GRAPHQL_ENDPOINT="))
    return endpoint.replace("WORDPRESS_GRAPHQL_ENDPOINT=", "");
  return endpoint;
}

const locales = ["ja", "en"] as const;
const BASE_URL = "https://taketora-antique.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const routes: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    { path: "", changeFreq: "daily" as const, priority: 1 },
    { path: "/antique", changeFreq: "weekly" as const, priority: 0.9 },
    { path: "/anime-figures", changeFreq: "weekly" as const, priority: 0.8 },
    { path: "/pokemon", changeFreq: "weekly" as const, priority: 0.8 },
    { path: "/collection", changeFreq: "daily" as const, priority: 0.8 },
    { path: "/visit", changeFreq: "monthly" as const, priority: 0.7 },
    { path: "/blog", changeFreq: "weekly" as const, priority: 0.7 },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: {
            ja: `${BASE_URL}/ja${page.path}`,
            en: `${BASE_URL}/en${page.path}`,
          },
        },
      });
    }
  }

  // Fetch products from Supabase
  try {
    const [animeResult, pokemonResult, antiqueResult] = await Promise.all([
      supabase.from("animefigure").select("slug, updated_at, created_at"),
      supabase.from("pokemon").select("slug, updated_at, created_at"),
      supabase.from("antique").select("slug, updated_at, created_at"),
    ]);

    const productRoutes: Array<{
      slug: string;
      category: string;
      lastModified: Date;
    }> = [];

    if (animeResult.data) {
      animeResult.data.forEach((p) => {
        if (p.slug) {
          productRoutes.push({
            slug: p.slug,
            category: "anime-figures",
            lastModified: p.updated_at
              ? new Date(p.updated_at)
              : p.created_at
              ? new Date(p.created_at)
              : new Date(),
          });
        }
      });
    }

    if (pokemonResult.data) {
      pokemonResult.data.forEach((p) => {
        if (p.slug) {
          productRoutes.push({
            slug: p.slug,
            category: "pokemon",
            lastModified: p.updated_at
              ? new Date(p.updated_at)
              : p.created_at
              ? new Date(p.created_at)
              : new Date(),
          });
        }
      });
    }

    if (antiqueResult.data) {
      antiqueResult.data.forEach((p) => {
        if (p.slug) {
          productRoutes.push({
            slug: p.slug,
            category: "antique",
            lastModified: p.updated_at
              ? new Date(p.updated_at)
              : p.created_at
              ? new Date(p.created_at)
              : new Date(),
          });
        }
      });
    }

    for (const locale of locales) {
      for (const product of productRoutes) {
        const path = `/${product.category}/${product.slug}`;
        routes.push({
          url: `${BASE_URL}/${locale}${path}`,
          lastModified: product.lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: {
            languages: {
              ja: `${BASE_URL}/ja${path}`,
              en: `${BASE_URL}/en${path}`,
            },
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Fetch blog posts
  try {
    const endpoint = getWordPressEndpoint();
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query GetBlogSlugs { allBlog { nodes { slug date } } }`,
        }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.allBlog?.nodes) {
          for (const locale of locales) {
            result.data.allBlog.nodes.forEach((blog: any) => {
              if (blog.slug) {
                const path = `/blog/${blog.slug}`;
                routes.push({
                  url: `${BASE_URL}/${locale}${path}`,
                  lastModified: blog.date ? new Date(blog.date) : new Date(),
                  changeFrequency: "monthly",
                  priority: 0.6,
                  alternates: {
                    languages: {
                      ja: `${BASE_URL}/ja${path}`,
                      en: `${BASE_URL}/en${path}`,
                    },
                  },
                });
              }
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  return routes;
}

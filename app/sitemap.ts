import { MetadataRoute } from "next";
import { localeUrl, hreflang } from "@/lib/urls";
import { getCatalogProducts, CATALOG_CATEGORY } from "@/lib/catalog";

const locales = ["ja", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        url: localeUrl(locale, page.path),
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: hreflang(page.path),
        },
      });
    }
  }

  // 商品ページ: taketora_app（在庫管理アプリ）の商品マスタから生成
  try {
    const products = await getCatalogProducts();
    for (const locale of locales) {
      for (const product of products) {
        const path = `/${CATALOG_CATEGORY}/${product.slug}`;
        routes.push({
          url: localeUrl(locale, path),
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : product.createdAt
            ? new Date(product.createdAt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: {
            languages: hreflang(path),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Fetch blog posts
  try {
    const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
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
                  url: localeUrl(locale, path),
                  lastModified: blog.date ? new Date(blog.date) : new Date(),
                  changeFrequency: "monthly",
                  priority: 0.6,
                  alternates: {
                    languages: hreflang(path),
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

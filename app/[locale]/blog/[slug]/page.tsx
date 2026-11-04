import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BreadcrumbItem } from "@/types/product";
import { localeUrl, localePath, hreflang } from "@/lib/urls";

const BASE_URL = "https://taketora-antique.com";

export const dynamicParams = true;

async function getBlog(slug: string) {
  try {
    const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
    if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetBlog($slug: ID!) {
            blog(id: $slug, idType: SLUG) {
              title
              date
              content
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const result = await res.json();
    if (result.errors) return null;
    return result.data?.blog || null;
  } catch {
    return null;
  }
}

function excerptFromHtml(html: string, max = 160): string {
  if (!html) return "";
  const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (stripped.length <= max) return stripped;
  const cut = stripped.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export async function generateStaticParams() {
  try {
    const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
    if (!endpoint) return [];
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query GetSlugs { allBlog { nodes { slug } } }`,
      }),
    });

    if (!res.ok) return [];
    const result = await res.json();
    if (!result.data?.allBlog?.nodes) return [];

    return result.data.allBlog.nodes.map((blog: any) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog Post Not Found" };

  const description = excerptFromHtml(blog.content || "");
  const url = localeUrl(locale, `/blog/${slug}`);
  const isJa = locale === "ja";

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: url,
      languages: hreflang(`/blog/${slug}`),
    },
    openGraph: {
      title: blog.title,
      description,
      url,
      type: "article",
      publishedTime: blog.date || undefined,
      siteName: isJa ? "たけとら Taketora" : "Taketora",
      locale: isJa ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t("breadcrumbs.home"), href: localePath(locale) },
    { label: t("breadcrumbs.blog"), href: localePath(locale, "/blog") },
    { label: blog.title, href: localePath(locale, `/blog/${slug}`) },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    datePublished: blog.date || undefined,
    dateModified: blog.date || undefined,
    description: excerptFromHtml(blog.content || ""),
    author: { "@type": "Organization", name: "Taketora" },
    publisher: {
      "@type": "Organization",
      name: "Taketora",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/assets/taketora_logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": localeUrl(locale, `/blog/${slug}`),
    },
    inLanguage: isJa ? "ja" : "en",
  };

  return (
    <article className="mx-auto max-w-site px-4 pt-4 sm:px-6">
      <JsonLd data={articleSchema} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto mt-8 max-w-[40rem]">
        <header className="border-b-2 border-ink pb-3">
          {blog.date && (
            <time dateTime={blog.date} className="text-[12px] text-ink-soft">
              {new Date(blog.date).toLocaleDateString(isJa ? "ja-JP" : "en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
          )}
          <h1 className="mt-1 text-[22px] font-black sm:text-[26px]">{blog.title}</h1>
        </header>

        <div className="blog-content mt-6" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <p className="mt-12">
          <Link href="/blog" className="btn-sub">
            {t("blog.back")}
          </Link>
        </p>
      </div>
    </article>
  );
}

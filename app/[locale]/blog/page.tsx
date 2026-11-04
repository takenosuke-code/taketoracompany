import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import { INSTAGRAM_URL } from "@/lib/shops";
import { localeUrl, localePath, hreflang, ogMeta } from "@/lib/urls";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localeUrl(locale, "/blog"),
      languages: hreflang("/blog"),
    },
    ...ogMeta(locale, { title: t("title"), description: t("description"), path: "/blog" }),
  };
}

async function getBlogs() {
  try {
    const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
    if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetAllBlogs {
            allBlog {
              nodes {
                id
                title
                slug
                date
                blogs {
                  blogpreview {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const result = await res.json();
    if (result.errors || !result.data?.allBlog?.nodes) return [];
    return result.data.allBlog.nodes;
  } catch {
    return [];
  }
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";
  const blogs = await getBlogs();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(isJa ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.blog"), href: localePath(locale, "/blog") },
        ]}
        title={t("blog.title")}
      />

      <div className="mt-6">
        {blogs.length === 0 ? (
          <div className="mx-auto max-w-[40rem] bg-white px-5 py-6 text-center">
            <p className="font-bold">{t("blog.emptyTitle")}</p>
            <p className="mt-2 text-[13px] text-ink-soft">{t("blog.emptyBody")}</p>
            <p className="mt-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="s-btn">
                Instagram @taketora_antiques
              </a>
            </p>
          </div>
        ) : (
          <ul className="mx-auto max-w-[44rem]">
            {blogs.map((blog: any) => {
              const thumb = blog.blogs?.blogpreview?.node?.sourceUrl as string | undefined;
              return (
                <li key={blog.id || blog.slug} className="border-b border-dotted border-rule">
                  <Link href={`/blog/${blog.slug}`} className="group flex items-center gap-4 py-4">
                    <div className="relative h-[72px] w-[96px] shrink-0 bg-white">
                      {thumb && (
                        <Image src={thumb} alt="" fill className="object-cover" sizes="96px" />
                      )}
                    </div>
                    <div>
                      {blog.date && (
                        <time dateTime={blog.date} className="text-[12px] text-ink-soft">
                          {formatDate(blog.date)}
                        </time>
                      )}
                      <p className="text-[14px] group-hover:underline">{blog.title}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

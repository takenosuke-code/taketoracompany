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
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: t("breadcrumbs.home"), href: localePath(locale) },
          { label: t("breadcrumbs.blog"), href: localePath(locale, "/blog") },
        ]}
        title={t("blog.title")}
        intro={<p>{t("blog.intro")}</p>}
      />

      <div className="mx-auto max-w-shop px-4 pb-20 pt-6 sm:px-6">
        {blogs.length === 0 ? (
          <div className="py-10">
            <p className="text-[19px] font-black">{t("blog.emptyTitle")}</p>
            <p className="mt-2 text-[15px] text-ink-soft">{t("blog.emptyBody")}</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-line mt-6">
              Instagram @taketora_antiques
            </a>
          </div>
        ) : (
          <ul className="max-w-[56rem] divide-y divide-line">
            {blogs.map((blog: any) => {
              const thumb = blog.blogs?.blogpreview?.node?.sourceUrl as string | undefined;
              return (
                <li key={blog.id || blog.slug}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="group grid grid-cols-[1fr_96px] items-center gap-5 py-6 sm:grid-cols-[1fr_200px] sm:gap-8"
                  >
                    <div>
                      {blog.date && (
                        <time dateTime={blog.date} className="text-[13px] font-bold text-ink-soft">
                          {formatDate(blog.date)}
                        </time>
                      )}
                      <h2 className="mt-1 text-[18px] font-black leading-snug group-hover:underline sm:text-[22px]">
                        {blog.title}
                      </h2>
                    </div>
                    <div className="relative aspect-[4/3] bg-sky-50">
                      {thumb && (
                        <Image
                          src={thumb}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 96px, 200px"
                        />
                      )}
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

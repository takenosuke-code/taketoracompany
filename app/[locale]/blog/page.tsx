import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ScrollRevealSection from "@/components/ScrollRevealSection";

const BASE_URL = "https://taketora-antique.com";

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
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        ja: `${BASE_URL}/ja/blog`,
        en: `${BASE_URL}/en/blog`,
        "x-default": `${BASE_URL}/ja/blog`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}/blog`,
      locale: locale === "ja" ? "ja_JP" : "en_US",
    },
  };
}

function getWordPressEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set");
  if (endpoint.startsWith("WORDPRESS_GRAPHQL_ENDPOINT="))
    return endpoint.replace("WORDPRESS_GRAPHQL_ENDPOINT=", "");
  return endpoint;
}

async function getBlogs() {
  try {
    const res = await fetch(getWordPressEndpoint(), {
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

  return (
    <div className="min-h-screen bg-stone-950 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-56 h-56 bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 pt-20 sm:pt-24">
        <ScrollRevealSection variant="fade-up">
          <div className="mb-12 sm:mb-16 text-center">
            <p className="text-xs sm:text-sm text-[#D4AF37]/60 tracking-[0.35em] uppercase font-light mb-3">
              {isJa ? "Blog" : "Blog"}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gradient-gold mb-4 tracking-wide">
              {t("blog.title")}
            </h1>
            <p className="text-[#F2E8DC]/60 text-base sm:text-lg font-light max-w-3xl mx-auto">
              {t("blog.subtitle")}
            </p>
            <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          </div>
        </ScrollRevealSection>

        {blogs.length === 0 ? (
          <ScrollRevealSection variant="scale">
            <div className="text-center py-16 sm:py-20">
              <div className="glass-card p-8 sm:p-12 max-w-2xl mx-auto">
                <p className="text-[#F2E8DC]/70 text-lg sm:text-xl font-light mb-2">
                  {t("blog.noPosts")}
                </p>
              </div>
            </div>
          </ScrollRevealSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog: any, index: number) => (
              <ScrollRevealSection key={blog.id || blog.slug} variant="fade-up" delay={index * 100}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="product-card group glass-card block overflow-hidden h-full"
                >
                  {blog.blogs?.blogpreview?.node?.sourceUrl && (
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                      <Image
                        src={blog.blogs.blogpreview.node.sourceUrl}
                        alt={
                          isJa
                            ? `京都たけとらブログ - ${blog.title || "記事画像"}`
                            : `Taketora Kyoto Blog - ${blog.title || "Blog post image"}`
                        }
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    {blog.date && (
                      <p className="text-[#D4AF37]/70 text-xs sm:text-sm font-light mb-3 tracking-wider">
                        {new Date(blog.date).toLocaleDateString(
                          isJa ? "ja-JP" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                    <h2 className="text-xl sm:text-2xl font-serif text-[#F2E8DC] mb-4 group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-2 leading-snug">
                      {blog.title}
                    </h2>
                    <div className="mt-auto pt-4 border-t border-amber-900/20">
                      <span className="text-[#D4AF37] text-sm font-light inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300 tracking-wider">
                        {t("blog.readMore")}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollRevealSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

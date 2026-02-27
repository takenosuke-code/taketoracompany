import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ScrollRevealSection from "@/components/ScrollRevealSection";

export const dynamicParams = true;

function getWordPressEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set");
  if (endpoint.startsWith("WORDPRESS_GRAPHQL_ENDPOINT="))
    return endpoint.replace("WORDPRESS_GRAPHQL_ENDPOINT=", "");
  return endpoint;
}

async function getBlog(slug: string) {
  try {
    const res = await fetch(getWordPressEndpoint(), {
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

export async function generateStaticParams() {
  try {
    const res = await fetch(getWordPressEndpoint(), {
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

  return (
    <div className="min-h-screen bg-stone-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-56 h-56 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 pt-20 sm:pt-24">
        <ScrollRevealSection variant="fade-up">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-300 mb-8 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-light tracking-wider">{t("blog.backToBlog")}</span>
          </Link>
        </ScrollRevealSection>

        <ScrollRevealSection variant="fade-up" delay={100}>
          <article className="glass-card p-8 sm:p-10 lg:p-14 relative overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/15 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/15 rounded-br-xl" />

            <header className="mb-8 sm:mb-10">
              {blog.date && (
                <p className="text-[#D4AF37]/60 text-xs sm:text-sm font-light mb-4 tracking-[0.2em] uppercase">
                  {new Date(blog.date).toLocaleDateString(
                    isJa ? "ja-JP" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F2E8DC] leading-tight tracking-wide mb-6">
                {blog.title}
              </h1>
              <div className="gold-line" />
            </header>

            <div
              className="blog-content max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        </ScrollRevealSection>
      </div>
    </div>
  );
}

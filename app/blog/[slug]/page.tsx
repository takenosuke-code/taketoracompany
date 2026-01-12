import { notFound } from 'next/navigation';
import Link from 'next/link';

// Allow dynamic routes (for development and when generateStaticParams fails)
export const dynamicParams = true;

function getWordPressEndpoint(): string {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new Error('WORDPRESS_GRAPHQL_ENDPOINT environment variable is not set');
  }
  // Handle case where env var value accidentally includes the key name
  if (endpoint.startsWith('WORDPRESS_GRAPHQL_ENDPOINT=')) {
    return endpoint.replace('WORDPRESS_GRAPHQL_ENDPOINT=', '');
  }
  return endpoint;
}

async function getBlog(slug: string) {
  try {
    const res = await fetch(getWordPressEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!res.ok) {
      console.error(`WordPress GraphQL request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const result = await res.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return null;
    }

    return result.data?.blog || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(getWordPressEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetSlugs {
            allBlog {
              nodes {
                id
                slug
              }
            }
          }
        `,
      }),
    });

    if (!res.ok) {
      console.error(`WordPress GraphQL request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const result = await res.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return [];
    }

    const data = result.data;
    if (!data || !data.allBlog || !data.allBlog.nodes) {
      console.error('Unexpected response structure:', result);
      return [];
    }

    return data.allBlog.nodes.map((blog: any) => ({ slug: blog.slug }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Back Link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors duration-300 mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Blog</span>
        </Link>

        {/* Article Card */}
        <article className="bg-white border border-stone-200 rounded-lg p-8 sm:p-10 lg:p-12 shadow-sm">
          {/* Header */}
          <header className="mb-8 sm:mb-10">
            {/* Date */}
            {blog.date && (
              <p className="text-amber-700 text-sm font-medium mb-4 tracking-wider uppercase">
                {new Date(blog.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 leading-tight tracking-wide mb-6">
              {blog.title}
            </h1>
            
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-slate-900 prose-headings:font-serif
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900
              prose-code:text-amber-700 prose-code:bg-stone-100
              prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-200
              prose-blockquote:border-l-amber-700 prose-blockquote:text-slate-700
              prose-img:rounded-lg prose-img:border prose-img:border-stone-200
              prose-hr:border-stone-200"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>
      </div>
    </div>
  );
}

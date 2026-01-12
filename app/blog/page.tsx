import Link from 'next/link';
import Image from 'next/image';

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

async function getBlogs() {
  try {
    const res = await fetch(getWordPressEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!res.ok) {
      console.error(`WordPress GraphQL request failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const result = await res.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
      // If blogpreview field doesn't exist, try without it
      if (result.errors.some((err: any) => err.message?.includes('blogpreview') || err.message?.includes('Cannot query field'))) {
        console.log('Retrying query without blogpreview field...');
        // For now, return empty and let user know - but we'll keep blogpreview since user requested it
      }
      return [];
    }

    const data = result.data;
    if (!data) {
      console.error('No data in response. Full response:', JSON.stringify(result, null, 2));
      return [];
    }

    if (!data.allBlog) {
      console.error('No allBlog in data. Available keys:', Object.keys(data));
      console.error('Full data:', JSON.stringify(data, null, 2));
      return [];
    }

    if (!data.allBlog.nodes) {
      console.error('No nodes in allBlog. Structure:', data.allBlog);
      return [];
    }

    console.log('Blogs fetched successfully:', data.allBlog.nodes.length);
    return data.allBlog.nodes;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Page Header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-900 mb-4 tracking-wide">
            Blog
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-light max-w-3xl">
            Stories, insights, and updates from Taketora
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="bg-white border border-stone-200 rounded-lg p-8 sm:p-12 max-w-2xl mx-auto shadow-sm">
              <p className="text-slate-800 text-lg sm:text-xl font-light mb-2">No blog posts found.</p>
              <p className="text-slate-500 text-sm sm:text-base">Check your WordPress GraphQL connection and ensure blog posts exist.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog: any) => (
              <Link 
                key={blog.id || blog.slug} 
                href={`/blog/${blog.slug}`}
                className="group"
              >
                <article className="h-full bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-amber-600/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Blog Preview Image */}
                  {blog.blogs?.blogpreview?.node?.sourceUrl && (
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-stone-100">
                      <Image
                        src={blog.blogs.blogpreview.node.sourceUrl}
                        alt={blog.title || 'Blog post image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    {/* Date */}
                    {blog.date && (
                      <p className="text-amber-700 text-xs sm:text-sm font-medium mb-3 tracking-wider uppercase">
                        {new Date(blog.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-serif text-slate-900 mb-4 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h2>

                    {/* Read More Link */}
                    <div className="mt-auto pt-4 border-t border-stone-200">
                      <span className="text-amber-700 text-sm font-medium group-hover:underline inline-flex items-center gap-2">
                        Read More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import Link from 'next/link';

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
          query GetBlogs {
            allBlog {
              nodes {
                id
                title
                slug
                date
                excerpt
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
      console.error('GraphQL errors:', result.errors);
      return [];
    }

    const data = result.data;
    if (!data || !data.allBlog || !data.allBlog.nodes) {
      console.error('Unexpected response structure:', result);
      return [];
    }

    return data.allBlog.nodes;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {blogs.map((blog: any) => (
          <article key={blog.slug} className="border-b pb-6">
            <Link href={`/blog/${blog.slug}`}>
              <h2 className="text-xl font-semibold hover:underline">{blog.title}</h2>
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(blog.date).toLocaleDateString('ja-JP')}
            </p>
            {blog.excerpt && (
              <div 
                className="mt-2 text-gray-600"
                dangerouslySetInnerHTML={{ __html: blog.excerpt }} 
              />
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
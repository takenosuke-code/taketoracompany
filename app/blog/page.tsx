import Link from 'next/link';

async function getBlogs() {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetBlogs {
          blogs {
            nodes {
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

  const { data } = await res.json();
  return data.blogs.nodes;
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
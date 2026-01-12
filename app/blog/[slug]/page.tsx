import { notFound } from 'next/navigation';

async function getBlog(slug: string) {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
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

  const { data } = await res.json();
  return data.blog;
}

export async function generateStaticParams() {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetSlugs {
          blogs {
            nodes {
              slug
            }
          }
        }
      `,
    }),
  });

  const { data } = await res.json();
  return data.blogs.nodes.map((blog: any) => ({ slug: blog.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(blog.date).toLocaleDateString('ja-JP')}
      </p>
      <article 
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </main>
  );
}

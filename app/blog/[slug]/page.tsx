import { notFound } from 'next/navigation';

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

import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export async function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.length > 0 && (
            <>
              <span>&middot;</span>
              <div className="flex gap-1">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={post.body} />
      </div>
    </article>
  );
}

import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { CommentSection } from "@/components/comment-section";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="relative">
      <ReadingProgress />
      <article className="mt-6">
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
        <CommentSection slug={slug} />
      </article>
      {post.toc.length > 0 && (
        <aside className="hidden xl:block absolute left-full top-0 h-full ml-8">
          <div className="sticky top-24">
            <TableOfContents toc={post.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}

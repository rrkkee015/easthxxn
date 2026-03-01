import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { CommentSection } from "@/components/comment-section";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatDate } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/categories";
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

const siteUrl = "https://easthxxn.com";

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const postUrl = `${siteUrl}/posts/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      authors: ["easthxxn"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const categoryLabel =
    post.category !== "uncategorized" ? getCategoryLabel(post.category) : null;

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    ...(categoryLabel
      ? [{ label: categoryLabel, href: `/categories/${post.category}` }]
      : []),
    { label: post.title },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Person", name: "easthxxn", url: siteUrl },
      url: `${siteUrl}/posts/${slug}`,
      keywords: post.tags,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems
        .filter((item) => item.href)
        .map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          item: `${siteUrl}${item.href}`,
        })),
    },
  ];

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <article className="mt-6">
        <header className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground/50">
            <time dateTime={post.date} className="shrink-0">{formatDate(post.date)}</time>
            {post.tags.length > 0 && (
              <>
                <span>&middot;</span>
                <div className="flex flex-wrap gap-1">
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

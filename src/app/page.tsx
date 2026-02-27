import type { Metadata } from "next";
import { posts } from "#site/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { paginatePosts } from "@/lib/pagination";

const siteUrl = "https://easthxxn.com";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNum = Number(page) || 1;

  return {
    alternates: {
      canonical: pageNum > 1 ? `${siteUrl}?page=${pageNum}` : siteUrl,
    },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const pageNum = Number(page) || 1;

  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const { posts: paginatedPosts, currentPage, totalPages } = paginatePosts(publishedPosts, pageNum);

  return (
    <div>
      {paginatedPosts.length === 0 ? (
        <p className="text-foreground/50">아직 작성된 포스트가 없습니다.</p>
      ) : (
        <div className="divide-y divide-foreground/10">
          {paginatedPosts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
            />
          ))}
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
    </div>
  );
}

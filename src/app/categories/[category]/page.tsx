import { getAllCategories, getCategoryLabel, getPostsByCategory } from "@/lib/categories";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { paginatePosts } from "@/lib/pagination";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category,
  }));
}

const siteUrl = "https://easthxxn.com";

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page) || 1;
  const label = getCategoryLabel(category);
  const description = `${label} 카테고리의 글 목록`;
  const categoryUrl = `${siteUrl}/categories/${category}`;

  return {
    title: label,
    description,
    alternates: {
      canonical: pageNum > 1 ? `${categoryUrl}?page=${pageNum}` : categoryUrl,
    },
    openGraph: {
      title: label,
      description,
      type: "website",
      url: categoryUrl,
    },
    twitter: {
      card: "summary",
      title: label,
      description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page) || 1;
  const label = getCategoryLabel(category);
  const allPosts = getPostsByCategory(category);
  const { posts, currentPage, totalPages } = paginatePosts(allPosts, pageNum);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-2">{label}</h1>
      <p className="text-foreground/60 text-sm mb-8">
        {label} 카테고리의 글 ({allPosts.length}개)
      </p>
      {posts.length === 0 ? (
        <p className="text-foreground/50">해당 카테고리에 글이 없습니다.</p>
      ) : (
        <div className="divide-y divide-foreground/10">
          {posts.map((post) => (
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
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/categories/${category}`} />
    </div>
  );
}

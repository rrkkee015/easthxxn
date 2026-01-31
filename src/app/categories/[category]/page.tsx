import { getAllCategories, getCategoryLabel, getPostsByCategory } from "@/lib/categories";
import { PostCard } from "@/components/post-card";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);
  return {
    title: label,
    description: `${label} 카테고리의 글 목록`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = getCategoryLabel(category);
  const posts = getPostsByCategory(category);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-2">{label}</h1>
      <p className="text-foreground/60 text-sm mb-8">
        {label} 카테고리의 글 ({posts.length}개)
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
    </div>
  );
}

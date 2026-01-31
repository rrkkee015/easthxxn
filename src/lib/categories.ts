import { posts } from "#site/content";

const categoryLabels: Record<string, string> = {
  dev: "개발",
  news: "뉴스",
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const post of posts) {
    if (post.published && post.category !== "uncategorized") {
      categories.add(post.category);
    }
  }
  return Array.from(categories).sort();
}

export function getPostsByCategory(category: string) {
  return posts
    .filter((post) => post.published && post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

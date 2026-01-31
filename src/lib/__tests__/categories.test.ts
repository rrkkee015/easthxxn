import { describe, it, expect, vi, beforeEach } from "vitest";

const mockPosts = [
  {
    title: "Post A",
    slug: "post-a",
    date: "2026-01-30",
    description: "desc",
    category: "뉴스",
    tags: [],
    published: true,
    body: "",
    permalink: "/posts/post-a",
  },
  {
    title: "Post B",
    slug: "post-b",
    date: "2026-01-31",
    description: "desc",
    category: "뉴스",
    tags: [],
    published: true,
    body: "",
    permalink: "/posts/post-b",
  },
  {
    title: "Post C",
    slug: "post-c",
    date: "2026-01-29",
    description: "desc",
    category: "개발",
    tags: [],
    published: true,
    body: "",
    permalink: "/posts/post-c",
  },
  {
    title: "Post D",
    slug: "post-d",
    date: "2026-01-28",
    description: "desc",
    category: "uncategorized",
    tags: [],
    published: true,
    body: "",
    permalink: "/posts/post-d",
  },
  {
    title: "Draft",
    slug: "draft",
    date: "2026-01-27",
    description: "desc",
    category: "뉴스",
    tags: [],
    published: false,
    body: "",
    permalink: "/posts/draft",
  },
];

vi.mock("#site/content", () => ({
  posts: mockPosts,
}));

describe("getAllCategories", () => {
  let getAllCategories: typeof import("@/lib/categories").getAllCategories;

  beforeEach(async () => {
    const mod = await import("@/lib/categories");
    getAllCategories = mod.getAllCategories;
  });

  it("returns categories sorted alphabetically", () => {
    const categories = getAllCategories();
    expect(categories).toEqual(["개발", "뉴스"]);
  });

  it("excludes uncategorized", () => {
    const categories = getAllCategories();
    expect(categories).not.toContain("uncategorized");
  });

  it("removes duplicates", () => {
    const categories = getAllCategories();
    const unique = new Set(categories);
    expect(categories.length).toBe(unique.size);
  });
});

describe("getPostsByCategory", () => {
  let getPostsByCategory: typeof import("@/lib/categories").getPostsByCategory;

  beforeEach(async () => {
    const mod = await import("@/lib/categories");
    getPostsByCategory = mod.getPostsByCategory;
  });

  it("returns only posts from the given category", () => {
    const posts = getPostsByCategory("뉴스");
    expect(posts.every((p) => p.category === "뉴스")).toBe(true);
  });

  it("excludes unpublished posts", () => {
    const posts = getPostsByCategory("뉴스");
    expect(posts.every((p) => p.published)).toBe(true);
    expect(posts.length).toBe(2);
  });

  it("sorts posts by date descending", () => {
    const posts = getPostsByCategory("뉴스");
    expect(posts[0].slug).toBe("post-b");
    expect(posts[1].slug).toBe("post-a");
  });

  it("returns empty array for unknown category", () => {
    const posts = getPostsByCategory("없는카테고리");
    expect(posts).toEqual([]);
  });
});

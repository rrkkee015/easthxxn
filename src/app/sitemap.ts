import { posts } from "#site/content";
import { getAllCategories } from "@/lib/categories";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://easthxxn.com";

  const postEntries = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  const categoryEntries = getAllCategories().map((category) => ({
    url: `${siteUrl}/categories/${encodeURIComponent(category)}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    ...categoryEntries,
    ...postEntries,
  ];
}

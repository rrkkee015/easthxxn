import { posts } from "#site/content";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://example.com";

  const postEntries = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}

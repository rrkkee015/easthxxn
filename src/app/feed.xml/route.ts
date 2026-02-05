import { Feed } from "feed";
import { posts } from "#site/content";

const siteUrl = "https://easthxxn.com";

export async function GET() {
  const feed = new Feed({
    title: "easthxxn",
    description: "기록하고 공유합니다",
    id: siteUrl,
    link: siteUrl,
    language: "ko",
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, easthxxn`,
    author: {
      name: "easthxxn",
      link: siteUrl,
    },
  });

  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const post of publishedPosts) {
    const postUrl = `${siteUrl}/posts/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

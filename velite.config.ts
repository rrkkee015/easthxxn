import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(120),
          slug: s.path(),
          date: s.isodate(),
          description: s.string().max(300),
          category: s.string().default("uncategorized"),
          tags: s.array(s.string()).default([]),
          published: s.boolean().default(true),
          body: s.mdx(),
        })
        .transform((data) => {
          const slugAsParams = data.slug.split("/").slice(1).join("/");
          const toc = extractToc(data.body);
          return {
            ...data,
            slug: slugAsParams,
            permalink: `/posts/${slugAsParams}`,
            toc,
          };
        }),
    },
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode as any,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
        },
      ],
    ],
  },
});

function extractToc(body: string): { id: string; text: string; level: number }[] {
  const regex = /\.h([23]),\{id:"([^"]+)",children:"([^"]+)"\}/g;
  const toc: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3];
    if (id && text) {
      toc.push({ id, text, level });
    }
  }
  return toc;
}

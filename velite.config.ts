import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";
import { extractToc, extractFirstImage } from "./src/lib/mdx-utils";

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
          const thumbnail = extractFirstImage(data.body);
          return {
            ...data,
            slug: slugAsParams,
            permalink: `/posts/${slugAsParams}`,
            toc,
            thumbnail,
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


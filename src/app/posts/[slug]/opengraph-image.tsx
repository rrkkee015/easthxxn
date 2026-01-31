import { ImageResponse } from "next/og";
import { posts } from "#site/content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function generateStaticParams() {
  return posts
    .filter((post) => post.published)
    .map((post) => ({ slug: post.slug }));
}

async function loadFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap"
  );
  const css = await res.text();
  const fontUrl = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(woff2|truetype|opentype)'\)/
  )?.[1];
  if (!fontUrl) throw new Error("Font URL not found");
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return new ImageResponse(<div>Not Found</div>, { ...size });
  }

  const fontData = await loadFont();

  if (post.thumbnail) {
    const imagePath = join(process.cwd(), "public", post.thumbnail);
    const imageData = await readFile(imagePath);
    const base64 = imageData.toString("base64");
    const ext = post.thumbnail.split(".").pop() ?? "png";
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    const mime = mimeMap[ext] ?? "image/png";
    const dataUrl = `data:${mime};base64,${base64}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          <img
            src={dataUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "40px 50px",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontFamily: "Noto Sans KR",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.7)",
                marginTop: 12,
                display: "flex",
                gap: 16,
              }}
            >
              <span>{post.category}</span>
              <span>
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700 }],
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "60px 50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontFamily: "Noto Sans KR",
              fontWeight: 700,
              color: "#ededed",
              lineHeight: 1.3,
              wordBreak: "keep-all",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.5)",
              marginTop: 24,
              display: "flex",
              gap: 20,
            }}
          >
            <span>{post.category}</span>
            <span>·</span>
            <span>
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 28,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "Noto Sans KR",
            fontWeight: 700,
          }}
        >
          easthxxn
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700 }],
    }
  );
}

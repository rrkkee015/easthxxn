import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function OgImage() {
  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontFamily: "Noto Sans KR",
            fontWeight: 700,
            color: "#ededed",
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

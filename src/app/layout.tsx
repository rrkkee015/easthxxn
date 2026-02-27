import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollRestore } from "@/components/scroll-restore";
import { Analytics } from "@vercel/analytics/next";
import { getAllCategories } from "@/lib/categories";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://easthxxn.com";

export const metadata: Metadata = {
  title: {
    default: "easthxxn",
    template: "%s | easthxxn",
  },
  description: "기록하고 공유합니다",
  metadataBase: new URL(siteUrl),
  verification: {
    google: "uJAsCRZj9o-wM_KwhnmCBx98vo9oNpA4zrQ3vy7IbIo",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "easthxxn",
    title: "easthxxn",
    description: "기록하고 공유합니다",
  },
  twitter: {
    card: "summary_large_image",
    title: "easthxxn",
    description: "기록하고 공유합니다",
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-clip`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "easthxxn",
              url: siteUrl,
              description: "기록하고 공유합니다",
            }),
          }}
        />
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
        >{`history.scrollRestoration="manual"`}</Script>
        <ThemeProvider>
          <ScrollRestore />
          <Header categories={categories} />
          <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-2 pb-8">
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollRestore } from "@/components/scroll-restore";
import { Analytics } from "@vercel/analytics/react";
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

export const metadata: Metadata = {
  title: {
    default: "Dlog",
    template: "%s | Dlog",
  },
  description: "개발 블로그",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration="manual"`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
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

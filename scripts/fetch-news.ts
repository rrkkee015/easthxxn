import Parser from "rss-parser";
import OpenAI from "openai";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const RSS_FEEDS = [
  {
    category: "US News",
    url: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "US Immigration",
    url: "https://news.google.com/rss/search?q=US+immigration+policy&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "US Employment",
    url: "https://news.google.com/rss/search?q=US+jobs+employment+hiring&hl=en-US&gl=US&ceid=US:en",
  },
];

const MAX_ARTICLES_PER_FEED = 3;

interface Article {
  category: string;
  title: string;
  link: string;
}

async function fetchRSSFeeds(): Promise<Article[]> {
  const parser = new Parser();
  const articles: Article[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      const items = result.items.slice(0, MAX_ARTICLES_PER_FEED);

      for (const item of items) {
        if (item.title && item.link) {
          articles.push({
            category: feed.category,
            title: item.title,
            link: item.link,
          });
        }
      }

      console.log(
        `[RSS] ${feed.category}: fetched ${items.length} articles`
      );
    } catch (error) {
      console.error(`[RSS] Failed to fetch ${feed.category}:`, error);
    }
  }

  return articles;
}

async function generateSummary(articles: Article[]): Promise<string> {
  const openai = new OpenAI();

  const userPrompt = buildUserPrompt(articles);

  console.log("[OpenAI] Generating summary...");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  console.log("[OpenAI] Summary generated successfully");
  return content;
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildMDX(dateStr: string, description: string, body: string): string {
  const displayDate = formatDisplayDate(dateStr);

  return `---
title: "US Daily Brief - ${displayDate}"
date: "${dateStr}"
description: "${description}"
tags: ["news", "immigration", "employment"]
published: true
---

${body}
`;
}

async function main() {
  console.log("=== US News Fetch Script ===\n");

  // 1. Fetch RSS feeds
  const articles = await fetchRSSFeeds();

  if (articles.length === 0) {
    console.error("No articles fetched. Exiting.");
    process.exit(1);
  }

  console.log(`\n[Total] ${articles.length} articles collected\n`);

  // 2. Generate summary via OpenAI
  const rawOutput = await generateSummary(articles);

  // 3. Parse description from output
  let description = "Today's US news brief for English learners";
  let body = rawOutput;

  const descMatch = rawOutput.match(/^DESCRIPTION:\s*(.+)/);
  if (descMatch) {
    description = descMatch[1].trim().replace(/"/g, '\\"');
    // Remove the DESCRIPTION line and the blank line after it
    body = rawOutput.replace(/^DESCRIPTION:.*\n\n?/, "");
  }

  // 4. Write MDX file
  const dateStr = getTodayDateString();
  const fileName = `${dateStr}-us-news.mdx`;
  const filePath = join(
    process.cwd(),
    "content",
    "posts",
    fileName
  );

  if (existsSync(filePath)) {
    console.log(`[Skip] ${fileName} already exists`);
    return;
  }

  const mdxContent = buildMDX(dateStr, description, body);
  writeFileSync(filePath, mdxContent, "utf-8");

  console.log(`[Done] Created ${filePath}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

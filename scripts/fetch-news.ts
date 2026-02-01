import Parser from "rss-parser";
import OpenAI from "openai";
import { writeFileSync, existsSync, mkdirSync } from "fs";
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
  {
    category: "US Tech",
    url: "https://news.google.com/rss/search?q=US+tech+industry+IT+Silicon+Valley&hl=en-US&gl=US&ceid=US:en",
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
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  console.log("[OpenAI] Summary generated successfully");
  return content;
}

async function generateImage(
  openai: OpenAI,
  imagePrompt: string,
  fileName: string
): Promise<string | null> {
  const imageDir = join(process.cwd(), "public", "images", "news");
  mkdirSync(imageDir, { recursive: true });

  const imagePath = join(imageDir, `${fileName}.png`);
  const publicPath = `/images/news/${fileName}.png`;

  if (existsSync(imagePath)) {
    console.log(`[Image] ${fileName} already exists, skipping`);
    return publicPath;
  }

  try {
    console.log(`[Image] Generating ${fileName}...`);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    writeFileSync(imagePath, buffer);

    console.log(`[Image] Saved ${fileName}`);
    return publicPath;
  } catch (error) {
    console.error(`[Image] Failed to generate ${fileName}:`, error);
    return null;
  }
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

function buildMDX(
  dateStr: string,
  description: string,
  body: string
): string {
  const displayDate = formatDisplayDate(dateStr);

  return `---
title: "US Daily Brief - ${displayDate}"
date: "${dateStr}"
description: "${description}"
category: "news"
tags: ["news", "immigration", "employment", "tech"]
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

  // 3. Parse metadata from output
  let description = "Today's US news brief for English learners";
  let body = rawOutput;

  const descMatch = rawOutput.match(/^DESCRIPTION:\s*(.+)/m);
  if (descMatch) {
    description = descMatch[1].trim().replace(/"/g, '\\"');
  }

  // Parse all IMAGE_N prompts
  const imagePrompts: Record<number, string> = {};
  const imageRegex = /^IMAGE_(\d+):\s*(.+)/gm;
  let match;
  while ((match = imageRegex.exec(rawOutput)) !== null) {
    imagePrompts[parseInt(match[1])] = match[2].trim();
  }

  // Remove metadata lines
  body = body.replace(/^DESCRIPTION:.*\n?/m, "");
  body = body.replace(/^IMAGE_\d+:.*\n?/gm, "");
  body = body.replace(/^\n+/, "");

  // 4. Generate images and replace markers
  const openai = new OpenAI();
  const dateStr = getTodayDateString();

  for (const [num, prompt] of Object.entries(imagePrompts)) {
    const fileName = `${dateStr}-${num}`;
    const imagePath = await generateImage(openai, prompt, fileName);

    if (imagePath) {
      body = body.replace(
        `[IMAGE_${num}]`,
        `![Article ${num}](${imagePath})`
      );
    } else {
      body = body.replace(`[IMAGE_${num}]`, "");
    }
  }

  // 5. Write MDX file
  const postsDir = join(process.cwd(), "content", "posts");
  mkdirSync(postsDir, { recursive: true });
  const fileName = `${dateStr}-us-news.mdx`;
  const filePath = join(postsDir, fileName);

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

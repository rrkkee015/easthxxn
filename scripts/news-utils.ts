export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildMDX(
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

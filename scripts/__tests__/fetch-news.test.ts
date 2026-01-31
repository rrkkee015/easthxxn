import { describe, it, expect } from "vitest";

function buildMDX(dateStr: string, description: string, body: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const displayDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `---
title: "US Daily Brief - ${displayDate}"
date: "${dateStr}"
description: "${description}"
category: "뉴스"
tags: ["news", "immigration", "employment"]
published: true
---

${body}
`;
}

describe("buildMDX", () => {
  const dateStr = "2026-01-31";
  const description = "Test description";
  const body = "## Hello World";

  it("includes category field in frontmatter", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain('category: "뉴스"');
  });

  it("has valid frontmatter delimiters", () => {
    const result = buildMDX(dateStr, description, body);
    const parts = result.split("---");
    expect(parts.length).toBeGreaterThanOrEqual(3);
  });

  it("includes the date in frontmatter", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain(`date: "${dateStr}"`);
  });

  it("includes the body after frontmatter", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain(body);
  });

  it("includes all required frontmatter fields", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain("title:");
    expect(result).toContain("date:");
    expect(result).toContain("description:");
    expect(result).toContain("category:");
    expect(result).toContain("tags:");
    expect(result).toContain("published:");
  });
});

import { describe, it, expect } from "vitest";
import { buildMDX, formatDisplayDate, getTodayDateString } from "../news-utils";

describe("buildMDX", () => {
  const dateStr = "2026-01-31";
  const description = "Test description";
  const body = "## Hello World";

  it("uses 'news' as category", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain('category: "news"');
  });

  it("includes 'tech' in tags", () => {
    const result = buildMDX(dateStr, description, body);
    expect(result).toContain('"tech"');
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

describe("formatDisplayDate", () => {
  it("formats date in English US locale", () => {
    const result = formatDisplayDate("2026-01-31");
    expect(result).toContain("January");
    expect(result).toContain("31");
    expect(result).toContain("2026");
  });
});

describe("getTodayDateString", () => {
  it("returns YYYY-MM-DD format", () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

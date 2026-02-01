import { describe, it, expect } from "vitest";
import { buildUserPrompt } from "../prompt";

describe("buildUserPrompt", () => {
  it("groups articles by category", () => {
    const articles = [
      { category: "US News", title: "Article 1", link: "https://a.com" },
      { category: "US Tech", title: "Article 2", link: "https://b.com" },
      { category: "US News", title: "Article 3", link: "https://c.com" },
    ];
    const result = buildUserPrompt(articles);
    expect(result).toContain("### US News");
    expect(result).toContain("### US Tech");
  });

  it("includes article titles and links", () => {
    const articles = [
      { category: "US News", title: "Big Story", link: "https://example.com/big" },
    ];
    const result = buildUserPrompt(articles);
    expect(result).toContain("Big Story");
    expect(result).toContain("https://example.com/big");
  });

  it("formats articles as markdown list items", () => {
    const articles = [
      { category: "US News", title: "Story", link: "https://x.com" },
    ];
    const result = buildUserPrompt(articles);
    expect(result).toContain("- Story (https://x.com)");
  });

  it("handles empty array", () => {
    const result = buildUserPrompt([]);
    expect(result).toContain("today's US news articles");
    expect(result).not.toContain("###");
  });
});

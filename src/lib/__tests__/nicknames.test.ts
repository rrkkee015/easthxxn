import { describe, it, expect } from "vitest";
import { generateNickname } from "@/lib/nicknames";

describe("generateNickname", () => {
  it("returns an object with nickname and emoji fields", () => {
    const result = generateNickname();
    expect(result).toHaveProperty("nickname");
    expect(result).toHaveProperty("emoji");
  });

  it("returns a non-empty nickname", () => {
    const { nickname } = generateNickname();
    expect(nickname.length).toBeGreaterThan(0);
  });

  it("returns a non-empty emoji", () => {
    const { emoji } = generateNickname();
    expect(emoji.length).toBeGreaterThan(0);
  });

  it("generates different nicknames across multiple calls", () => {
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      results.add(generateNickname().nickname);
    }
    expect(results.size).toBeGreaterThan(1);
  });
});

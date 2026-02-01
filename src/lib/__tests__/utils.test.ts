import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, timeAgo } from "../utils";

describe("formatDate", () => {
  it("formats date in Korean locale", () => {
    const result = formatDate("2026-01-15");
    expect(result).toContain("2026");
    expect(result).toContain("1");
    expect(result).toContain("15");
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns '방금 전' for less than 1 minute", () => {
    expect(timeAgo("2026-02-01T11:59:30Z")).toBe("방금 전");
  });

  it("returns 'N분 전' for minutes", () => {
    expect(timeAgo("2026-02-01T11:55:00Z")).toBe("5분 전");
    expect(timeAgo("2026-02-01T11:01:00Z")).toBe("59분 전");
  });

  it("returns 'N시간 전' for hours", () => {
    expect(timeAgo("2026-02-01T11:00:00Z")).toBe("1시간 전");
    expect(timeAgo("2026-01-31T13:00:00Z")).toBe("23시간 전");
  });

  it("returns 'N일 전' for days", () => {
    expect(timeAgo("2026-01-31T12:00:00Z")).toBe("1일 전");
    expect(timeAgo("2026-01-03T12:00:00Z")).toBe("29일 전");
  });

  it("returns 'N달 전' for months", () => {
    expect(timeAgo("2026-01-02T12:00:00Z")).toBe("1달 전");
    expect(timeAgo("2025-08-01T12:00:00Z")).toBe("6달 전");
  });
});

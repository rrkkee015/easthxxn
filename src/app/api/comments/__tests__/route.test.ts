import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
    })),
  },
}));

// Chain mocks
mockSelect.mockReturnValue({ eq: mockEq });
mockEq.mockReturnValue({ order: mockOrder });
mockInsert.mockReturnValue({ select: mockSelect });

import { GET, POST } from "../route";
import { NextRequest } from "next/server";

function makeGetRequest(slug?: string): NextRequest {
  const url = slug
    ? `http://localhost/api/comments?slug=${slug}`
    : "http://localhost/api/comments";
  return new NextRequest(url);
}

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
  });

  it("returns 400 when slug is missing", async () => {
    const req = makeGetRequest();
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns data on valid request", async () => {
    const mockData = [{ id: "1", nickname: "테스트", emoji: "🐱", content: "hi", created_at: "2026-01-01" }];
    mockOrder.mockResolvedValue({ data: mockData, error: null });

    const req = makeGetRequest("test-slug");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockData);
  });
});

describe("POST /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  it("returns 400 when required fields are missing", async () => {
    const req = makePostRequest({ post_slug: "test" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when content exceeds 100 characters", async () => {
    const req = makePostRequest({
      post_slug: "test",
      nickname: "user",
      emoji: "🐱",
      content: "a".repeat(101),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 on valid request", async () => {
    const mockData = {
      id: "1",
      nickname: "user",
      emoji: "🐱",
      content: "hello",
      created_at: "2026-01-01",
    };
    mockSelect.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const req = makePostRequest({
      post_slug: "test",
      nickname: "user",
      emoji: "🐱",
      content: "hello",
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual(mockData);
  });
});

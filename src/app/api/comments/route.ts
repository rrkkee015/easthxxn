import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "slug 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id, nickname, emoji, content, created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { post_slug, nickname, emoji, content } = body;

  if (!post_slug || !nickname || !emoji || !content) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 },
    );
  }

  if (content.length > 100) {
    return NextResponse.json(
      { error: "댓글은 100자까지 가능합니다." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_slug, nickname, emoji, content })
    .select("id, nickname, emoji, content, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

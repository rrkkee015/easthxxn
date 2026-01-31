"use client";

import { useEffect, useState } from "react";
import { CommentForm } from "./comment-form";

interface Comment {
  id: string;
  nickname: string;
  emoji: string;
  content: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  return `${months}달 전`;
}

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (comment: {
    nickname: string;
    emoji: string;
    content: string;
  }) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_slug: slug, ...comment }),
    });

    if (!res.ok) throw new Error("댓글 등록 실패");

    const newComment: Comment = await res.json();
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <section className="mt-16 border-t border-foreground/10 pt-8">
      <h2 className="text-lg font-bold mb-6">댓글</h2>
      <CommentForm onSubmit={handleSubmit} />

      {loading ? (
        <p className="mt-8 text-sm text-foreground/40">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/40">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-foreground/10 px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{c.emoji}</span>
                <span className="text-sm font-medium">{c.nickname}</span>
                <span className="text-xs text-foreground/30">
                  {timeAgo(c.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground/80">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

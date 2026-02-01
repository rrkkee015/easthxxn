"use client";

import { useEffect, useState } from "react";
import { generateNickname } from "@/lib/nicknames";

interface CommentFormProps {
  onSubmit: (comment: {
    nickname: string;
    emoji: string;
    content: string;
  }) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [identity, setIdentity] = useState<{
    nickname: string;
    emoji: string;
  } | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIdentity(generateNickname());
  }, []);

  const handleRandomize = () => {
    setIdentity(generateNickname());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    if (!identity) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        nickname: identity.nickname,
        emoji: identity.emoji,
        content: trimmed,
      });
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{identity?.emoji ?? " "}</span>
        <span className="text-sm font-medium">{identity?.nickname ?? " "}</span>
        <button
          type="button"
          onClick={handleRandomize}
          className="text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
        >
          랜덤 변경
        </button>
      </div>
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= 100) setContent(e.target.value);
          }}
          placeholder="댓글을 남겨보세요 (100자)"
          rows={3}
          className="w-full resize-none rounded-lg border border-foreground/10 bg-transparent px-3 py-2 text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
        <span className="absolute bottom-2 right-3 text-xs text-foreground/30 pb-2">
          {content.length}/100
        </span>
      </div>
      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="rounded-lg bg-foreground px-4 py-1.5 text-sm text-background transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-default"
      >
        {isSubmitting ? "등록 중..." : "댓글 남기기"}
      </button>
    </form>
  );
}

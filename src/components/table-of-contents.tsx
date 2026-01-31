"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const rafRef = useRef<number>(0);

  const updateActiveId = useCallback(() => {
    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    const offset = 100;
    let current = headingElements[0].id;

    for (const el of headingElements) {
      if (el.getBoundingClientRect().top <= offset) {
        current = el.id;
      } else {
        break;
      }
    }

    // 스크롤이 페이지 하단에 도달하면 마지막 헤딩을 활성화
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
    if (atBottom) {
      current = headingElements[headingElements.length - 1].id;
    }

    setActiveId(current);
  }, [toc]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActiveId);
    };

    updateActiveId();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateActiveId]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <nav className="w-56 text-sm">
      <ul className="space-y-1.5">
        {toc.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`block border-l-2 transition-colors ${
                level === 3 ? "pl-5" : "pl-3"
              } ${
                activeId === id
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-foreground/40 hover:text-foreground/70"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestore() {
  const pathname = usePathname();
  const isPopNavigation = useRef(false);
  const lastScrollY = useRef(0);
  const cachedPosition = useRef<number | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      isPopNavigation.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // useLayoutEffect: cleanup이 commit phase에서 동기 실행되므로
  // Next.js의 scroll-to-0보다 먼저 이전 스크롤 위치를 저장할 수 있다.
  useLayoutEffect(() => {
    const key = `scrollY:${pathname}`;

    const saved = sessionStorage.getItem(key);
    cachedPosition.current = saved !== null ? Number(saved) : null;

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      sessionStorage.setItem(key, String(lastScrollY.current));
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const key = `scrollY:${pathname}`;
    let rafId: number | undefined;

    if (isPopNavigation.current) {
      if (cachedPosition.current !== null) {
        const top = cachedPosition.current;
        rafId = requestAnimationFrame(() => {
          window.scrollTo({ top, behavior: "smooth" });
        });
      }
      isPopNavigation.current = false;
    } else {
      sessionStorage.setItem(key, "0");
      window.scrollTo({ top: 0 });
      lastScrollY.current = 0;
    }

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}

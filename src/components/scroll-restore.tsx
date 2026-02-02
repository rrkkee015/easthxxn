"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestore() {
  const pathname = usePathname();
  const isPopNavigation = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isPopNavigation.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const key = `scrollY:${pathname}`;
    let rafId: number | undefined;

    if (isPopNavigation.current) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        rafId = requestAnimationFrame(() => {
          window.scrollTo({ top: Number(saved), behavior: "smooth" });
        });
      }
      isPopNavigation.current = false;
    } else {
      sessionStorage.setItem(key, "0");
      window.scrollTo({ top: 0 });
    }

    const handleScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}

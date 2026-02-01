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

    if (isPopNavigation.current) {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        window.scrollTo({ top: Number(saved), behavior: "smooth" });
      }
      isPopNavigation.current = false;
    } else {
      sessionStorage.setItem(key, String(window.scrollY));
    }

    const handleScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}

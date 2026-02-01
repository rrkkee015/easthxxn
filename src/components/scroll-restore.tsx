"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    const key = `scrollY:${pathname}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
    }

    const handleScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";

export function ScrollRestore() {
  useEffect(() => {
    const saved = sessionStorage.getItem("scrollY");
    if (saved) {
      window.scrollTo({ top: Number(saved), behavior: "smooth" });
      sessionStorage.removeItem("scrollY");
    }

    const handleScroll = () => {
      sessionStorage.setItem("scrollY", String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}

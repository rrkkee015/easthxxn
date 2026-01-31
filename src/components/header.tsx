"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

interface HeaderProps {
  categories?: string[];
}

export function Header({ categories = [] }: HeaderProps) {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const activeCategory = pathname.startsWith("/categories/")
    ? decodeURIComponent(pathname.split("/")[2])
    : null;

  return (
    <header className="border-b border-foreground/10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg shrink-0">
          Dlog
        </Link>
        <div className="ml-auto flex items-center gap-6">
          {categories.length > 0 && (
            <nav className="flex gap-6 overflow-x-auto text-sm">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${encodeURIComponent(cat)}`}
                  className={`shrink-0 py-1 transition-colors ${
                    activeCategory === cat
                      ? "text-foreground font-semibold"
                      : "text-foreground/50 hover:text-foreground/80"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </nav>
          )}
          <button
          onClick={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
          className="shrink-0 p-2 rounded-md hover:bg-foreground/5 transition-colors"
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden dark:block"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block dark:hidden"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
        </div>
      </div>
    </header>
  );
}

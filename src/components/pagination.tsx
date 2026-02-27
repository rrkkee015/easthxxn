import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <nav aria-label="페이지네이션" className="mt-10 flex items-center justify-center gap-2 text-sm">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="px-3 py-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          &larr; 이전
        </Link>
      ) : (
        <span className="px-3 py-1.5 rounded-md text-foreground/20 cursor-not-allowed">
          &larr; 이전
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            page === currentPage
              ? "bg-foreground text-background font-semibold"
              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="px-3 py-1.5 rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          다음 &rarr;
        </Link>
      ) : (
        <span className="px-3 py-1.5 rounded-md text-foreground/20 cursor-not-allowed">
          다음 &rarr;
        </span>
      )}
    </nav>
  );
}

import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

export function PostCard({ title, description, date, tags, slug }: PostCardProps) {
  return (
    <article className="py-5">
      <Link href={`/posts/${slug}`} className="group block">
        <h2 className="text-lg font-semibold group-hover:underline underline-offset-4">
          {title}
        </h2>
        <p className="mt-1 text-foreground/60 text-sm">{description}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-foreground/40">
          <time dateTime={date}>{formatDate(date)}</time>
          {tags.length > 0 && (
            <>
              <span>&middot;</span>
              <div className="flex gap-1">
                {tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}

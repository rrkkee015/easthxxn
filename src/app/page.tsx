import { posts } from "#site/content";
import { PostCard } from "@/components/post-card";

export default function Home() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Posts</h1>
      <p className="text-foreground/60 text-sm mb-8">
        개발하며 배운 것들을 기록합니다.
      </p>
      {publishedPosts.length === 0 ? (
        <p className="text-foreground/50">아직 작성된 포스트가 없습니다.</p>
      ) : (
        <div className="divide-y divide-foreground/10">
          {publishedPosts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

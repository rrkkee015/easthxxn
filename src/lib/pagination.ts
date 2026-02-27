const POSTS_PER_PAGE = 10;

export function paginatePosts<T>(posts: T[], page: number) {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(start, start + POSTS_PER_PAGE);
  return { posts: paginatedPosts, currentPage, totalPages };
}

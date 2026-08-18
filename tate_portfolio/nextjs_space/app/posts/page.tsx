import type { Metadata } from 'next';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';
import { PostsIndex } from '@/components/posts-index';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Posts — Tate Schwartz',
  description: 'Short essays by Tate Schwartz',
};

export default function PostsPage() {
  // Only the index metadata crosses to the client; parsed bodies stay server-side.
  const posts = getAllPosts().map(({ slug, title, date, readingTime, drawing }) => ({
    slug,
    title,
    date,
    readingTime,
    drawing,
  }));

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 p-6 md:p-10 lg:p-12 pb-24">
        <PageHeader title="Posts" />
        <PostsIndex posts={posts} />
      </div>
    </main>
  );
}

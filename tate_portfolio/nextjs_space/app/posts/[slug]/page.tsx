import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/posts';
import { PostReader } from '@/components/post-reader';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} — Tate Schwartz`,
    openGraph: { title: post.title, type: 'article', publishedTime: post.date },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <PostReader
      title={post.title}
      date={post.date}
      readingTime={post.readingTime}
      drawing={post.drawing}
      blocks={post.parsed.blocks}
      footnotes={post.parsed.footnotes}
    />
  );
}

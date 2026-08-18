'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PostDrawing } from '@/components/post-drawing';
import { formatDate } from '@/lib/post-meta';
import type { PostMeta } from '@/lib/post-meta';

export function PostsIndex({ posts }: { posts: PostMeta[] }) {
  const [newestFirst, setNewestFirst] = useState(true);

  const ordered = useMemo(() => {
    const sorted = [...posts].sort((a, b) => a.date.localeCompare(b.date));
    return newestFirst ? sorted.reverse() : sorted;
  }, [posts, newestFirst]);

  if (posts.length === 0) {
    return (
      <p className="mt-16 text-center font-garamond text-xl text-charcoal/70">
        Nothing here yet.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-10 md:mt-14 w-full max-w-2xl">
      <div className="flex justify-end">
        <button
          onClick={() => setNewestFirst((value) => !value)}
          className="font-pixel text-[0.7rem] uppercase tracking-[0.15em] text-charcoal/70 hover:text-charcoal transition-colors"
        >
          {newestFirst ? 'Newest first ↓' : 'Oldest first ↑'}
        </button>
      </div>

      <ul className="mt-3 border-t border-charcoal/25">
        {ordered.map((post) => (
          <li key={post.slug} className="border-b border-charcoal/25">
            <Link
              href={`/posts/${post.slug}`}
              className="group flex items-center gap-5 py-6 md:py-7"
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-garamond text-2xl md:text-3xl leading-snug text-charcoal group-hover:underline underline-offset-4 decoration-1">
                  {post.title}
                </h2>
                <p className="mt-2 font-pixel text-[0.68rem] uppercase tracking-[0.15em] text-charcoal/65">
                  {formatDate(post.date)} · {post.readingTime} min
                </p>
              </div>

              <div className="w-24 md:w-32 flex-shrink-0 aspect-[4/3] text-charcoal/85 transition-transform duration-200 group-hover:scale-[1.04]">
                <PostDrawing drawing={post.drawing} title={post.title} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

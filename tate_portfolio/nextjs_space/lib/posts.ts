import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseMarkdown, readingTime, ParsedPost } from './markdown';
import type { PostMeta } from './post-meta';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export type { PostMeta };

export interface Post extends PostMeta {
  parsed: ParsedPost;
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);

  // gray-matter turns an unquoted YAML date into a Date; normalize both forms
  // to a plain ISO day string so nothing shifts across timezones later.
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? '');

  return {
    slug,
    title: String(data.title ?? slug),
    date,
    drawing: data.drawing ? String(data.drawing) : undefined,
    readingTime: readingTime(content),
    parsed: parseMarkdown(content),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map(readPostFile)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

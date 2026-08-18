// Client-safe post types and formatting. Kept separate from lib/posts.ts so
// client components don't pull the filesystem reader into the browser bundle.

export interface PostMeta {
  slug: string;
  title: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  readingTime: number;
  /** Path to the post's drawing under /public. */
  drawing?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2026-08-14` -> `Aug 14, 2026`, without going through Date/timezones. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName || !year || !day) return iso;
  return `${monthName} ${Number(day)}, ${year}`;
}

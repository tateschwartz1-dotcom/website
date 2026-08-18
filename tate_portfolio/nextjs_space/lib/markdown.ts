// A small markdown parser covering exactly the features posts use:
// headings, bold, italic, links, bulleted lists, pull quotes, images, footnotes.
// Output is a plain JSON tree so a server component can hand it to a client one.

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'link'; value: string; href: string }
  | { type: 'footnoteRef'; label: string; index: number };

export type Block =
  | { type: 'heading'; content: Inline[] }
  | { type: 'paragraph'; content: Inline[] }
  | { type: 'list'; items: Inline[][] }
  | { type: 'quote'; content: Inline[] }
  | { type: 'image'; src: string; caption?: string };

export interface Footnote {
  label: string;
  index: number;
  content: Inline[];
}

export interface ParsedPost {
  blocks: Block[];
  footnotes: Footnote[];
}

const FOOTNOTE_DEF = /^\[\^([^\]]+)\]:\s*(.*)$/;
// `[IMAGE: file.png — caption]`. The caption separator must have whitespace on
// both sides so hyphens inside a filename aren't mistaken for it.
const IMAGE_LINE = /^\[IMAGE:\s*(.+?)(?:\s+[—–-]\s+(.*?))?\s*\]$/;

/**
 * Footnote labels are whatever the author typed (`[^1]`, `[^why]`). Display
 * numbers come from order of first reference, so markers always read 1, 2, 3
 * down the page even if the labels are out of order or non-numeric.
 */
function makeFootnoteNumbering() {
  const order = new Map<string, number>();
  return (label: string) => {
    const existing = order.get(label);
    if (existing !== undefined) return existing;
    const next = order.size + 1;
    order.set(label, next);
    return next;
  };
}

function parseInline(raw: string, numberFor: (label: string) => number): Inline[] {
  const spans: Inline[] = [];
  let rest = raw;

  // Ordered by precedence: bold before italic so `**x**` never reads as italic.
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[\^([^\]]+)\])|(\[([^\]]+)\]\(([^)]+)\))/;

  while (rest.length > 0) {
    const match = pattern.exec(rest);
    if (!match || match.index === undefined) {
      spans.push({ type: 'text', value: rest });
      break;
    }

    if (match.index > 0) {
      spans.push({ type: 'text', value: rest.slice(0, match.index) });
    }

    if (match[2] !== undefined) {
      spans.push({ type: 'bold', value: match[2] });
    } else if (match[4] !== undefined) {
      spans.push({ type: 'italic', value: match[4] });
    } else if (match[6] !== undefined) {
      spans.push({ type: 'footnoteRef', label: match[6], index: numberFor(match[6]) });
    } else if (match[8] !== undefined && match[9] !== undefined) {
      spans.push({ type: 'link', value: match[8], href: match[9] });
    }

    rest = rest.slice(match.index + match[0].length);
  }

  return spans.filter((span) => span.type !== 'text' || span.value.length > 0);
}

export function parseMarkdown(body: string): ParsedPost {
  const numberFor = makeFootnoteNumbering();
  const lines = body.replace(/\r\n/g, '\n').split('\n');

  const blocks: Block[] = [];
  const footnoteDefs: { label: string; raw: string }[] = [];

  // Buffers for the multi-line blocks (paragraphs and lists).
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: 'paragraph', content: parseInline(paragraph.join(' '), numberFor) });
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push({ type: 'list', items: listItems.map((item) => parseInline(item, numberFor)) });
    listItems = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushAll();
      continue;
    }

    const footnoteDef = FOOTNOTE_DEF.exec(trimmed);
    if (footnoteDef) {
      flushAll();
      footnoteDefs.push({ label: footnoteDef[1], raw: footnoteDef[2] });
      continue;
    }

    const image = IMAGE_LINE.exec(trimmed);
    if (image) {
      flushAll();
      // A bare filename lives in /public/posts; an absolute path is used as given.
      const src = image[1].trim();
      blocks.push({
        type: 'image',
        src: src.startsWith('/') ? src : `/posts/${src}`,
        caption: image[2]?.trim() || undefined,
      });
      continue;
    }

    if (trimmed.startsWith('#')) {
      flushAll();
      blocks.push({
        type: 'heading',
        content: parseInline(trimmed.replace(/^#+\s*/, ''), numberFor),
      });
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushAll();
      blocks.push({
        type: 'quote',
        content: parseInline(trimmed.replace(/^>\s*/, ''), numberFor),
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
      continue;
    }

    // A non-list line ends any open list, then joins the running paragraph.
    flushList();
    paragraph.push(trimmed);
  }

  flushAll();

  // Definitions are numbered by reference order; anything defined but never
  // referenced is dropped rather than rendered with a dangling number.
  const footnotes: Footnote[] = footnoteDefs
    .map((def) => ({
      label: def.label,
      index: numberFor(def.label),
      content: parseInline(def.raw, numberFor),
    }))
    .sort((a, b) => a.index - b.index);

  return { blocks, footnotes };
}

export function countWords(body: string): number {
  return body
    .replace(/\[\^[^\]]+\]:?/g, ' ')
    .replace(/\[IMAGE:[^\]]*\]/g, ' ')
    .replace(/[#>*_`-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(body: string): number {
  return Math.max(1, Math.round(countWords(body) / 200));
}

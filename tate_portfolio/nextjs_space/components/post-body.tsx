'use client';

import { Fragment } from 'react';
import { Block, Footnote, Inline } from '@/lib/markdown';
import { PostDrawing } from '@/components/post-drawing';

function renderInline(spans: Inline[], keyPrefix: string) {
  return spans.map((span, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (span.type) {
      case 'bold':
        return <strong key={key} className="font-semibold">{span.value}</strong>;
      case 'italic':
        return <em key={key}>{span.value}</em>;
      case 'link':
        return (
          <a
            key={key}
            href={span.href}
            target={span.href.startsWith('/') ? '_self' : '_blank'}
            rel={span.href.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="underline underline-offset-[3px] decoration-[0.06em] hover:opacity-70 transition-opacity"
          >
            {span.value}
          </a>
        );
      case 'footnoteRef':
        return (
          <sup key={key} id={`fnref-${span.index}`} className="ml-[0.1em]">
            <a
              href={`#fn-${span.index}`}
              className="text-[0.72em] no-underline hover:opacity-70 transition-opacity"
              aria-label={`Footnote ${span.index}`}
            >
              {span.index}
            </a>
          </sup>
        );
      default:
        return <Fragment key={key}>{span.value}</Fragment>;
    }
  });
}

interface PostBodyProps {
  blocks: Block[];
  footnotes: Footnote[];
  title: string;
  /** Pre-mixed rule color — Tailwind can't apply an opacity modifier to currentColor. */
  ruleColor: string;
  invertImages?: boolean;
}

export function PostBody({ blocks, footnotes, title, ruleColor, invertImages }: PostBodyProps) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `block-${i}`;

        switch (block.type) {
          case 'heading':
            return (
              <h2 key={key} className="text-[1.32em] font-semibold mt-[1.9em] mb-[0.55em] leading-tight">
                {renderInline(block.content, key)}
              </h2>
            );

          case 'quote':
            return (
              <blockquote
                key={key}
                className="my-[1.7em] pl-[1.1em] border-l-2 text-[1.15em] italic leading-snug"
                style={{ borderColor: ruleColor }}
              >
                {renderInline(block.content, key)}
              </blockquote>
            );

          case 'list':
            return (
              <ul key={key} className="my-[1.2em] space-y-[0.6em]">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex">
                    <span className="mr-[0.7em] flex-shrink-0" aria-hidden="true">•</span>
                    <span>{renderInline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'image':
            return (
              <figure key={key} className="my-[2em]">
                <div className="w-full aspect-[4/3]">
                  <PostDrawing drawing={block.src} title={title} invert={invertImages} />
                </div>
                {block.caption && (
                  <figcaption className="mt-[0.7em] text-center text-[0.8em] italic opacity-70">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return (
              <p key={key} className="my-[1.1em]">
                {renderInline(block.content, key)}
              </p>
            );
        }
      })}

      {footnotes.length > 0 && (
        <section className="mt-[3em] pt-[1.5em] border-t" style={{ borderColor: ruleColor }}>
          <ol className="space-y-[0.9em] text-[0.85em] leading-relaxed">
            {footnotes.map((footnote) => (
              <li key={footnote.index} id={`fn-${footnote.index}`} className="flex">
                <a
                  href={`#fnref-${footnote.index}`}
                  className="mr-[0.7em] flex-shrink-0 no-underline hover:opacity-70 transition-opacity"
                  aria-label={`Back to footnote ${footnote.index} reference`}
                >
                  {footnote.index}.
                </a>
                <span>{renderInline(footnote.content, `fn-${footnote.index}`)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

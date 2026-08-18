'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { PostBody } from '@/components/post-body';
import { PostDrawing } from '@/components/post-drawing';
import { formatDate } from '@/lib/post-meta';
import type { Block, Footnote } from '@/lib/markdown';
import {
  BACKGROUNDS,
  DEFAULT_SETTINGS,
  ReaderSettings,
  SIZES,
  SPACINGS,
  TYPEFACES,
  WIDTHS,
  loadSettings,
  resolveBackground,
  saveSettings,
  withAlpha,
} from '@/lib/reader-settings';

interface PostReaderProps {
  title: string;
  date: string;
  readingTime: number;
  drawing?: string;
  blocks: Block[];
  footnotes: Footnote[];
}

export function PostReader({ title, date, readingTime, drawing, blocks, footnotes }: PostReaderProps) {
  const router = useRouter();
  const { currentIndex } = useTheme();

  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // Reading progress.
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / scrollable)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Dismiss the panel on Escape or an outside click.
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [panelOpen]);

  const background = resolveBackground(settings, currentIndex);
  const typeface = TYPEFACES.find((t) => t.id === settings.typeface) ?? TYPEFACES[0];
  const spacing = SPACINGS.find((s) => s.id === settings.spacing) ?? SPACINGS[1];
  const width = WIDTHS.find((w) => w.id === settings.width) ?? WIDTHS[1];

  const fg = background.fg;
  const rule = withAlpha(fg, 0.25);
  const activeChip = withAlpha(fg, 0.14);

  const chipStyle = (active: boolean) => ({
    borderColor: active ? fg : rule,
    backgroundColor: active ? activeChip : 'transparent',
    color: fg,
  });

  return (
    <main className="relative min-h-screen" style={{ color: fg }}>
      {/* Reading surface */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={false}
        animate={{ backgroundColor: background.bg }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ backgroundColor: background.bg }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full origin-left"
          style={{
            backgroundColor: withAlpha(fg, 0.4),
            transform: `scaleX(${progress})`,
            transition: 'transform 90ms linear',
          }}
        />
      </div>

      {/* Reader settings */}
      <div ref={panelRef} className="fixed top-5 right-5 md:top-8 md:right-8 z-50">
        <button
          onClick={() => setPanelOpen((open) => !open)}
          className="w-11 h-11 border-2 flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ ...chipStyle(panelOpen), backgroundColor: panelOpen ? activeChip : background.bg }}
          aria-label="Reading settings"
          aria-expanded={panelOpen}
        >
          <span className="font-garamond text-lg leading-none">Aa</span>
        </button>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-[15rem] max-w-[calc(100vw-2.5rem)] border-2 p-4 shadow-lg"
              style={{ backgroundColor: background.bg, borderColor: fg }}
            >
              <PanelSection label="Typeface" fg={fg}>
                <div className="grid grid-cols-2 gap-1.5">
                  {TYPEFACES.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => update({ typeface: option.id })}
                      className="border px-2 py-1.5 text-xs transition-colors"
                      style={{
                        ...chipStyle(settings.typeface === option.id),
                        fontFamily: option.stack,
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection label="Size" fg={fg}>
                <div className="flex gap-1.5">
                  {SIZES.map((option, i) => (
                    <button
                      key={option}
                      onClick={() => update({ size: option })}
                      className="flex-1 border py-1 transition-colors"
                      style={{
                        ...chipStyle(settings.size === option),
                        fontSize: `${11 + i * 2}px`,
                        fontFamily: typeface.stack,
                      }}
                      aria-label={`Text size ${i + 1}`}
                    >
                      A
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection label="Spacing" fg={fg}>
                <div className="flex gap-1.5">
                  {SPACINGS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => update({ spacing: option.id })}
                      className="flex-1 border py-1 text-[0.65rem] transition-colors"
                      style={chipStyle(settings.spacing === option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection label="Width" fg={fg}>
                <div className="flex gap-1.5">
                  {WIDTHS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => update({ width: option.id })}
                      className="flex-1 border py-1 text-[0.65rem] transition-colors"
                      style={chipStyle(settings.width === option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection label="Background" fg={fg} last>
                <div className="flex flex-wrap gap-1.5">
                  {BACKGROUNDS.map((option) => {
                    const selected = background.id === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => update({ background: option.id })}
                        className="w-6 h-6 border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: option.bg,
                          borderColor: selected ? fg : rule,
                        }}
                        aria-label={option.label}
                        title={option.label}
                      />
                    );
                  })}
                </div>
              </PanelSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-12 pt-6 md:pt-10 lg:pt-12 pb-24">
        <button
          onClick={() => router.push('/posts')}
          className="font-pixel text-2xl md:text-3xl lg:text-4xl tracking-wider hover:opacity-70 transition-opacity cursor-pointer text-left flex items-center gap-3"
          style={{ color: fg }}
        >
          <span className="text-lg md:text-xl lg:text-2xl">←</span>
          Posts
        </button>

        <article
          className="mx-auto mt-12 md:mt-16"
          style={{
            maxWidth: width.value,
            fontFamily: typeface.stack,
            fontSize: `${settings.size}px`,
            lineHeight: spacing.value,
            // Avoid a visible reflow while the stored settings are read.
            opacity: hydrated ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
        >
          <h1 className="text-[2.15em] leading-[1.15] font-semibold text-center">{title}</h1>

          <p
            className="mt-[1.1em] text-center uppercase tracking-[0.18em] text-[0.68em]"
            style={{ color: withAlpha(fg, 0.65) }}
          >
            {formatDate(date)} · {readingTime} min
          </p>

          {drawing && (
            <div className="w-[72%] mx-auto aspect-[4/3] mt-[2.2em] mb-[0.6em]">
              <PostDrawing drawing={drawing} title={title} invert={background.dark} />
            </div>
          )}

          <div className="mt-[2em]">
            <PostBody
              blocks={blocks}
              footnotes={footnotes}
              title={title}
              ruleColor={rule}
              invertImages={background.dark}
            />
          </div>
        </article>
      </div>
    </main>
  );
}

function PanelSection({
  label,
  fg,
  last,
  children,
}: {
  label: string;
  fg: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={last ? '' : 'mb-3.5'}>
      <p
        className="font-pixel text-[0.6rem] uppercase tracking-[0.15em] mb-1.5"
        style={{ color: withAlpha(fg, 0.6) }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

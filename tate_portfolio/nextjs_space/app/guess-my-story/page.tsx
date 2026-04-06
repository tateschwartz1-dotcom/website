'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedBackground } from '@/components/animated-background';
import { gameCards, InlineLink } from '@/lib/higher-lower-data';

type Phase = 'tutorial' | 'playing' | 'counting' | 'result' | 'complete';

const TOTAL_GUESSES = gameCards.length - 1;
const COUNT_DURATION = 1800;
const RESULT_PAUSE = 1600;

function calcPoints(a: number, b: number): number {
  const gap = Math.abs(b - a);
  const pct = gap / Math.max(a, b, 1);
  if (pct < 0.05) return 200;
  if (pct < 0.15) return 150;
  if (pct < 0.3) return 125;
  if (pct < 0.5) return 100;
  return 50;
}

function renderLinkedText(
  text: string,
  links: InlineLink[] | undefined,
  answered: boolean
) {
  if (!links || links.length === 0) return text;

  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let keyIdx = 0;

  const sorted = [...links].sort(
    (a, b) => remaining.indexOf(a.text) - remaining.indexOf(b.text)
  );

  for (const link of sorted) {
    const idx = remaining.indexOf(link.text);
    if (idx === -1) continue;
    if (idx > 0) parts.push(remaining.slice(0, idx));

    const isActive = !link.postAnswer || answered;
    const isInternal = link.url.startsWith('/');

    if (isActive) {
      if (isInternal) {
        parts.push(
          <Link
            key={keyIdx++}
            href={link.url}
            target={link.newTab ? '_blank' : undefined}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            className="underline underline-offset-2 decoration-charcoal/40 hover:decoration-charcoal transition-colors"
          >
            {link.text}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={keyIdx++}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-charcoal/40 hover:decoration-charcoal transition-colors"
          >
            {link.text}
          </a>
        );
      }
    } else {
      parts.push(<span key={keyIdx++}>{link.text}</span>);
    }

    remaining = remaining.slice(idx + link.text.length);
  }

  if (remaining) parts.push(remaining);
  return <>{parts}</>;
}

export default function GuessMyStoryPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('tutorial');
  const [step, setStep] = useState(0);
  const [viewStep, setViewStep] = useState(0);
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(0);
  const [guessCorrect, setGuessCorrect] = useState<boolean | null>(null);
  const [answeredSteps, setAnsweredSteps] = useState<Set<number>>(new Set());
  const [completeOverlayHidden, setCompleteOverlayHidden] = useState(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cards to display are based on viewStep, not step
  const leftCard = gameCards[viewStep];
  const rightCard = viewStep + 1 < gameCards.length ? gameCards[viewStep + 1] : null;

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleGuess = useCallback(
    (guess: 'higher' | 'lower') => {
      if (phase !== 'playing' || viewStep !== step) return;
      const currentRight = gameCards[step + 1];
      if (!currentRight) return;

      const rn = currentRight.number;
      const ln = gameCards[step].number;
      const correct =
        (guess === 'higher' && rn >= ln) || (guess === 'lower' && rn <= ln);

      const pts = correct ? calcPoints(ln, rn) : 0;
      setLastPoints(pts);
      setGuessCorrect(correct);
      setPhase('counting');

      setAnsweredSteps((prev) => new Set(prev).add(step));

      const target = rn;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / COUNT_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayNumber(Math.round(eased * target));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayNumber(target);
          setPhase('result');

          timerRef.current = setTimeout(() => {
            const newScore = score + pts;
            setScore(newScore);

            if (step + 1 >= TOTAL_GUESSES) {
              setPhase('complete');
            } else {
              const nextStep = step + 1;
              setStep(nextStep);
              setViewStep(nextStep);
              setDisplayNumber(0);
              setGuessCorrect(null);
              setPhase('playing');
            }
          }, RESULT_PAUSE);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [phase, step, viewStep, score]
  );

  const maxPossible = gameCards.slice(0, -1).reduce((sum, card, i) => {
    return sum + calcPoints(card.number, gameCards[i + 1].number);
  }, 0);

  const formatNum = (n: number) => n.toLocaleString();
  const isStepAnswered = (s: number) => answeredSteps.has(s);

  const renderDescription = (
    text: string,
    links: InlineLink[] | undefined,
    answered: boolean
  ) =>
    text.split('\n\n').map((para, i) => (
      <p key={i} className="font-pixel text-xs md:text-sm leading-loose text-charcoal">
        {renderLinkedText(para, links, answered)}
      </p>
    ));

  const renderPrompt = (
    text: string,
    links: InlineLink[] | undefined,
    answered: boolean
  ) => (
    <p className="font-body font-bold text-base md:text-lg text-charcoal mb-2">
      {renderLinkedText(text, links, answered)}
    </p>
  );

  /* ─── Tutorial ─── */
  const renderTutorial = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center space-y-6 my-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <h2 className="font-pixel text-xl md:text-2xl text-charcoal">
          Guess My Story
        </h2>
        <div className="space-y-4 font-body text-lg md:text-xl">
          <p className="text-charcoal">Read about me, then guess:</p>
          <p className="font-bold text-charcoal text-xl md:text-2xl">
            Is the next number higher or lower?
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 py-4">
          <div className="rounded-xl px-5 py-3 text-center" style={{ backgroundColor: '#F5A88E' }}>
            <p className="font-pixel text-xs text-charcoal/80">current</p>
            <p className="font-pixel text-2xl text-charcoal">9,850</p>
          </div>
          <span className="font-pixel text-charcoal text-xl">vs</span>
          <div className="rounded-xl px-5 py-3 text-center" style={{ backgroundColor: '#A8D5BA' }}>
            <p className="font-pixel text-xs text-charcoal/80">next</p>
            <p className="font-pixel text-3xl text-charcoal">?</p>
          </div>
        </div>

        <p className="text-charcoal font-body text-lg md:text-xl">
          The closer the numbers, the more points you earn!
        </p>

        <button
          onClick={() => setPhase('playing')}
          className="font-pixel text-base bg-charcoal text-white px-10 py-4 rounded-full hover:opacity-80 transition-opacity"
        >
          Play
        </button>
      </motion.div>
    </motion.div>
  );

  /* ─── End overlay ─── */
  const renderOverlay = () => (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 text-center space-y-5"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="text-5xl">{"\uD83C\uDF89"}</div>
        <h2 className="font-pixel text-xl md:text-2xl text-charcoal">Nice job!</h2>
        <p className="font-body text-charcoal text-lg md:text-xl">
          You scored <span className="font-bold">{formatNum(score)}</span> out of{' '}
          {formatNum(maxPossible)} points
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => router.push('/projects')}
            className="font-pixel text-sm bg-charcoal text-white px-8 py-4 rounded-full hover:opacity-80 transition-opacity"
          >
            Projects
          </button>
          <button
            onClick={() => {
              setViewStep(0);
              setCompleteOverlayHidden(true);
            }}
            className="font-pixel text-sm border-2 border-charcoal text-charcoal px-8 py-4 rounded-full hover:opacity-70 transition-opacity"
          >
            Review Cards
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  /* ─── Card Panel ─── */
  const renderCard = (
    card: (typeof gameCards)[0],
    side: 'left' | 'right',
    numberShown: boolean,
    num: number
  ) => {
    const isRight = side === 'right';
    const isCurrentStep = viewStep === step;
    const showButtons = isRight && phase === 'playing' && isCurrentStep;
    const showResult = isRight && phase === 'result' && guessCorrect !== null && isCurrentStep;
    const answered = !isRight || isStepAnswered(viewStep);

    return (
      <motion.div
        key={`${side}-${viewStep}`}
        className="relative flex-1 min-h-0 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col"
        style={{ backgroundColor: card.color }}
        initial={isRight ? { x: 60, opacity: 0 } : { x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Result flash overlay */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 ${
                guessCorrect ? 'bg-green-500/25' : 'bg-red-500/25'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="text-5xl md:text-6xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                {guessCorrect ? '\u2713' : '\u2717'}
              </motion.span>
              {guessCorrect && lastPoints > 0 && (
                <motion.span
                  className="font-pixel text-2xl md:text-3xl text-charcoal bg-white/70 px-4 py-1.5 rounded-full shadow-md"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  +{lastPoints}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card content — top-aligned so layout doesn't shift */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 flex flex-col justify-start">
          {card.imageSrc && (
            <div className="w-full md:w-1/2 md:mx-auto aspect-video rounded-xl bg-white/30 mb-4 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.imageSrc} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-3 mb-5">
            {renderDescription(card.description, card.descriptionLinks, answered)}
          </div>

          <div className="border-t border-charcoal/15 pt-4 text-center">
            {renderPrompt(card.numberPrompt, card.promptLinks, answered)}
            <p className="font-pixel text-3xl md:text-5xl text-charcoal">
              {numberShown ? formatNum(num) : '?'}
            </p>
          </div>

          {/* Higher / Lower buttons */}
          {showButtons && (
            <div className="flex gap-3 justify-center mt-5">
              <button
                onClick={() => handleGuess('higher')}
                className="flex items-center gap-2 font-pixel text-sm bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
              >
                Higher
              </button>
              <button
                onClick={() => handleGuess('lower')}
                className="flex items-center gap-2 font-pixel text-sm bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors shadow-md"
              >
                Lower
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Right card number logic
  const isReviewing = viewStep < step;
  const rightNumberShown = isReviewing
    ? true
    : phase === 'counting' || phase === 'result' || phase === 'complete';
  const rightNum = phase === 'counting' && !isReviewing
    ? displayNumber
    : (rightCard?.number ?? 0);

  /* ─── Main render ─── */
  return (
    <main className="min-h-screen relative flex flex-col">
      <AnimatedBackground />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-8 md:px-12 lg:px-16 py-6">
        <button
          onClick={() => router.push('/projects')}
          className="font-pixel text-2xl md:text-3xl lg:text-4xl text-charcoal tracking-wider hover:opacity-70 transition-opacity cursor-pointer text-left flex items-center gap-3"
        >
          <span className="text-lg md:text-xl lg:text-2xl">←</span>
          Guess My Story
        </button>
        {phase !== 'tutorial' && (
          <span className="font-pixel text-sm md:text-base text-charcoal">
            {formatNum(score)} pts
          </span>
        )}
      </div>

      {/* Game area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-stretch gap-3 md:gap-4 px-4 md:px-8 pb-4 md:pb-8 min-h-0">
        {renderCard(leftCard, 'left', true, leftCard.number)}

        <div className="flex items-center justify-center md:self-center z-20 -my-2 md:my-0 md:-mx-2">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-charcoal text-white flex items-center justify-center font-pixel text-xs md:text-sm shadow-lg">
            VS
          </div>
        </div>

        {rightCard && renderCard(rightCard, 'right', rightNumberShown, rightNum)}
      </div>

      {/* Bottom bar: back/forward arrows + progress dots */}
      {phase !== 'tutorial' && (
        <div className="relative z-10 flex items-center justify-center gap-4 pb-4 px-4">
          <button
            onClick={() => setViewStep((v) => v - 1)}
            disabled={viewStep === 0}
            className="font-pixel text-base text-charcoal disabled:opacity-20 hover:opacity-60 transition-opacity px-2"
            aria-label="Previous card"
          >
            ←
          </button>

          <div className="flex gap-2">
            {Array.from({ length: TOTAL_GUESSES }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  i === viewStep
                    ? 'bg-charcoal'
                    : i < step + (phase === 'complete' ? 1 : 0)
                    ? 'bg-charcoal/50'
                    : 'bg-charcoal/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setViewStep((v) => v + 1)}
            disabled={viewStep >= step}
            className="font-pixel text-base text-charcoal disabled:opacity-20 hover:opacity-60 transition-opacity px-2"
            aria-label="Next card"
          >
            →
          </button>
        </div>
      )}

      {/* Overlays */}
      <AnimatePresence>
        {phase === 'tutorial' && renderTutorial()}
        {phase === 'complete' && !completeOverlayHidden && renderOverlay()}
      </AnimatePresence>
    </main>
  );
}

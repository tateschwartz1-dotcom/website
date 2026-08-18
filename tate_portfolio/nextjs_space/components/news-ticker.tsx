'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const tickerBefore = "Welcome to my website • Look for the easter eggs hidden throughout • Click on the headers to go back a page • You can drag this bar • My design inspiration was how simple HTML websites were back in the early 1990s • On the bottom left, you'll see The Button • It is consistently rated as the top feature • You should navigate to the projects page and play Guess My Story • If you get a perfect score on your first try, send me a message and I'll put you in the Line of Fame • Do not lie • Line of Fame: Mattea, Alex • To see my deleted beliefs page, click ";
const tickerAfter = " • ٩(ˊᗜˋ )و";

// A drag of more than this many pixels is a scroll, not a click on the link.
const CLICK_SLOP = 5;

function TickerContent() {
  return (
    <span className="font-body text-sm md:text-base text-white px-4">
      {tickerBefore}
      <span data-ticker-link className="underline underline-offset-2 cursor-pointer">
        here
      </span>
      {tickerAfter}
    </span>
  );
}

export function NewsTicker() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPos, setDragStartPos] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const movedRef = useRef(false);
  const downPointRef = useRef({ x: 0, y: 0 });
  const downTargetRef = useRef<HTMLElement | null>(null);

  // Measure content width and set initial position
  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 2);
      // Start text about a quarter from the left side
      const quarterPosition = containerRef.current.offsetWidth * 0.25;
      setPosition(quarterPosition);
      setMaxPosition(quarterPosition);
    }
  }, []);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (!isPaused && !isDragging && contentWidth > 0) {
      const speed = 40; // pixels per second
      setPosition(prev => {
        let newPos = prev - (speed * delta) / 1000;
        // Reset when first copy is fully scrolled
        if (newPos <= -contentWidth) {
          newPos += contentWidth;
        }
        return newPos;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isDragging, contentWidth]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Mouse/Touch handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartPos(position);
    movedRef.current = false;
    downPointRef.current = { x: e.clientX, y: e.clientY };
    downTargetRef.current = e.target as HTMLElement;
    // Capture on the container so the link never steals the drag gesture.
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      // Travel on either axis disqualifies the press from counting as a click,
      // so a swipe that starts on the link scrolls instead of navigating.
      if (
        Math.abs(e.clientX - downPointRef.current.x) > CLICK_SLOP ||
        Math.abs(e.clientY - downPointRef.current.y) > CLICK_SLOP
      ) {
        movedRef.current = true;
      }
      let newPos = dragStartPos + deltaX;

      if (contentWidth > 0) {
        // Allow looping when dragging left (natural direction)
        while (newPos <= -contentWidth) newPos += contentWidth;

        // Cap position when dragging right - don't reveal content before start
        if (newPos > maxPosition) {
          newPos = maxPosition;
        }
      }
      setPosition(newPos);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragging = isDragging;
    setIsPaused(false);
    setIsDragging(false);
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    lastTimeRef.current = 0;

    // A press that didn't travel counts as a click on the link.
    if (wasDragging && !movedRef.current && downTargetRef.current?.closest('[data-ticker-link]')) {
      router.push('/beliefs');
    }
    downTargetRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-8 md:h-10 bg-charcoal overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={contentRef}
        className="absolute whitespace-nowrap flex items-center h-full"
        style={{ transform: `translateX(${position}px)` }}
      >
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

const tickerText = "Welcome to my website • Look for the easter eggs hidden throughout • Click on the headers to go back a page • You can drag this bar • My design inspirations were the classic websites for comic strip cartoonists • Charmingly clean and simple • On the bottom left, you'll see The Button • I love pressing The Button • If you get a perfect score on your first try at Guess My Story, send me a message and I'll put you in the Line of Fame • Do not lie • Line of Fame: Mattea, Alex • ٩(ˊᗜˋ )و";

export function NewsTicker() {
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
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
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
    setIsPaused(false);
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    lastTimeRef.current = 0;
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
        <span className="font-body text-sm md:text-base text-white px-4">
          {tickerText}
        </span>
        <span className="font-body text-sm md:text-base text-white px-4">
          {tickerText}
        </span>
      </div>
    </div>
  );
}

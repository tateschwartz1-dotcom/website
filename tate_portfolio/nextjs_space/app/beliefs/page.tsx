'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';
import { useTheme, THEME_COLORS } from '@/context/ThemeContext';

const beliefs = [
  { id: 1, text: 'Simple, but different', rotation: -3 },
  { id: 4, text: 'Keep it simple, but different', rotation: 3 },
  { id: 3, text: 'Shooters shoot', rotation: -2 },
  {
    id: 2,
    lines: ["If you're not embarrassing yourself,", "you're not trying hard enough"],
    rotation: 4,
  },
];

function getPositions(w: number, h: number) {
  const ch = h - 120;
  if (w < 768) {
    return [
      { x: 20, y: ch * 0.03 },
      { x: 15, y: ch * 0.25 },
      { x: 25, y: ch * 0.50 },
      { x: 18, y: ch * 0.73 },
    ];
  }
  return [
    { x: w * 0.04, y: ch * 0.05 },
    { x: w * 0.42, y: ch * 0.10 },
    { x: w * 0.05, y: ch * 0.55 },
    { x: w * 0.06, y: ch * 0.75 },
  ];
}

export default function BeliefsPage() {
  const { currentIndex } = useTheme();
  const [positions, setPositions] = useState<{ x: number; y: number }[] | null>(null);

  useEffect(() => {
    setPositions(getPositions(window.innerWidth, window.innerHeight));
  }, []);

  // The 4 colors that are NOT the current background
  const blockColors = THEME_COLORS.filter((_, i) => i !== currentIndex);

  return (
    <main className="relative h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 h-screen p-8 md:p-12 lg:p-16 overflow-hidden">
        <PageHeader title="Beliefs" />

        <div className="relative h-[calc(100vh-120px)] mt-4">
          {/* Hidden "Boo" text behind Shooters shoot block (index 2) */}
          {positions && (
            <div
              className="absolute font-body text-2xl md:text-3xl lg:text-4xl text-charcoal select-none"
              style={{
                left: positions[2].x,
                top: positions[2].y,
                transform: 'rotate(-2deg)',
              }}
            >
              Boo
            </div>
          )}

          {positions && beliefs.map((belief, i) => (
            <motion.div
              key={belief.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              className="absolute cursor-grab active:cursor-grabbing"
              initial={{
                x: positions[i].x,
                y: positions[i].y,
                rotate: belief.rotation,
              }}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
            >
              <div
                className="text-charcoal px-6 py-3 md:px-10 md:py-4 lg:px-14 lg:py-5 shadow-lg select-none"
                style={{ backgroundColor: blockColors[i] }}
              >
                {'lines' in belief && belief.lines ? (
                  <div className="font-body text-base md:text-xl lg:text-2xl max-w-[80vw]">
                    {belief.lines.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-base md:text-xl lg:text-2xl max-w-[80vw]">
                    {'text' in belief ? belief.text : ''}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

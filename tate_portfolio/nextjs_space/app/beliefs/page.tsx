'use client';

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';

const beliefs = [
  {
    id: 1,
    text: 'Simple, but different',
    rotation: -3,
    initialX: 20,
    initialY: 60,
    bg: 'bg-coral',
  },
  {
    id: 2,
    lines: ["If you're not embarrassing yourself,", "you're not trying hard enough"],
    rotation: 4,
    initialX: 15,
    initialY: 200,
    bg: 'bg-mint',
  },
  {
    id: 3,
    text: 'Shooters shoot',
    rotation: -2,
    initialX: 30,
    initialY: 360,
    bg: 'bg-lavender',
  },
  {
    id: 4,
    text: 'Keep the main thing, the main thing',
    rotation: 3,
    initialX: 20,
    initialY: 480,
    bg: 'bg-peach',
  },
];

export default function BeliefsPage() {
  return (
    <main className="relative h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 h-screen p-8 md:p-12 lg:p-16 overflow-hidden">
        <PageHeader title="Beliefs" />
        
        {/* Draggable Beliefs Blocks */}
        <div className="relative h-[calc(100vh-120px)] mt-4">
          {/* Hidden "Boo" text behind Shooters shoot block */}
          <div 
            className="absolute font-body text-2xl md:text-3xl lg:text-4xl text-charcoal select-none"
            style={{ 
              left: '80px', 
              top: '380px',
              transform: 'rotate(-2deg)',
            }}
          >
            Boo
          </div>
          
          {beliefs.map((belief) => (
            <motion.div
              key={belief.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              className="absolute cursor-grab active:cursor-grabbing"
              initial={{
                x: belief.initialX,
                y: belief.initialY,
                rotate: belief.rotation,
              }}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
            >
              <div className={`${belief.bg} text-charcoal px-6 py-3 md:px-10 md:py-4 lg:px-14 lg:py-5 shadow-lg select-none`}>
                {'lines' in belief && belief.lines ? (
                  <div className="font-body text-base md:text-xl lg:text-2xl">
                    {belief.lines.map((line, i) => (
                      <p key={i} className="max-w-[80vw]">{line}</p>
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

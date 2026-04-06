'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/animated-background';
import { PageHeader } from '@/components/page-header';

// Tate's photos - will cycle through in order
const photos = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.png',
  '/photos/photo6.jpg',
];

export default function PhotoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    // Move to next photo (cycle back to start if at end)
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    if (!hasClicked) {
      setHasClicked(true);
    }
  };

  return (
    <main className="relative h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 h-full p-8 md:p-12 lg:p-16">
        <PageHeader title={hasClicked ? "Photos of me" : "A photo of me"} />
        
        <div className="flex items-center justify-center h-[calc(100%-80px)]">
          <motion.button
            onClick={handleClick}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Polaroid-style frame */}
            <div className="bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-charcoal/5 overflow-hidden">
                <Image
                  src={photos[currentIndex]}
                  alt={`Photo ${currentIndex + 1} of Tate`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                  priority
                />
              </div>
              <p className="absolute bottom-3 md:bottom-4 left-0 right-0 text-center font-body text-charcoal/60 text-xs md:text-sm italic">
                click to see more
              </p>
            </div>
          </motion.button>
        </div>
      </div>
    </main>
  );
}

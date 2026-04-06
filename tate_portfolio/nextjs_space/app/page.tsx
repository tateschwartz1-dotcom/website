'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { AnimatedBackground } from '@/components/animated-background';
import { NewsTicker } from '@/components/news-ticker';

export default function HomePage() {
  const [showWave, setShowWave] = useState(false);

  const handleHelloClick = () => {
    setShowWave(true);
    setTimeout(() => setShowWave(false), 1500);
  };

  return (
    <main className="relative h-screen overflow-hidden flex flex-col">
      <AnimatedBackground />
      
      {/* Main Content Area */}
      <div className="relative z-10 flex-1 p-8 md:p-12 lg:p-16">
        {/* Main Layout Container */}
        <div className="flex flex-col md:flex-row justify-between h-full">
          
          {/* Left Side - Navigation */}
          <div className="flex flex-col justify-start">
            <div className="relative mb-8 md:mb-12">
              <h2 
                onClick={handleHelloClick}
                className="font-body text-4xl md:text-5xl lg:text-6xl text-charcoal font-bold cursor-default select-none"
              >
                Hello!
              </h2>
              <AnimatePresence>
                {showWave && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1.2, 1, 0.8],
                      rotate: [0, 20, -20, 20, -20, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute -right-12 md:-right-16 top-0 text-4xl md:text-5xl lg:text-6xl"
                  >
                    👋
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <nav className="flex flex-col space-y-4 md:space-y-6">
              <Link 
                href="/photo" 
                className="font-body text-xl md:text-2xl text-charcoal italic underline underline-offset-4 hover:opacity-70 transition-opacity w-fit"
              >
                A photo of me
              </Link>
              <Link 
                href="/projects" 
                className="font-body text-xl md:text-2xl text-charcoal italic underline underline-offset-4 hover:opacity-70 transition-opacity w-fit"
              >
                Projects
              </Link>
              <Link 
                href="/favorite-things" 
                className="font-body text-xl md:text-2xl text-charcoal italic underline underline-offset-4 hover:opacity-70 transition-opacity w-fit"
              >
                Favorite things
              </Link>
              <Link 
                href="/beliefs" 
                className="font-body text-xl md:text-2xl text-charcoal italic underline underline-offset-4 hover:opacity-70 transition-opacity w-fit"
              >
                Beliefs
              </Link>
            </nav>
          </div>
          
          {/* Right Side - Logo & Social Links */}
          <div className="flex flex-col items-end mt-8 md:mt-0">
            <h1 className="font-pixel text-2xl md:text-3xl lg:text-4xl text-charcoal tracking-wider">
              TATE SCHWARTZ
            </h1>
            
            <div className="flex justify-end space-x-4 mt-3">
              <a 
                href="https://www.linkedin.com/in/tateschwartz" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm md:text-base text-charcoal hover:opacity-70 transition-opacity"
                title="LinkedIn"
              >
                IN
              </a>
              <a 
                href="https://www.instagram.com/tate.schwartz/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm md:text-base text-charcoal hover:opacity-70 transition-opacity"
                title="Instagram"
              >
                IG
              </a>
              <a 
                href="mailto:tateschwartz1@outlook.com" 
                className="font-body text-sm md:text-base text-charcoal hover:opacity-70 transition-opacity"
                title="Email"
              >
                EM
              </a>
            </div>
          </div>
          
        </div>
      </div>

      {/* News Ticker */}
      <div className="relative z-10">
        <NewsTicker />
      </div>

      {/* Bottom Section with Theme Toggle */}
      <div className="relative z-10 flex-shrink-0 h-32 md:h-40">
        {/* This provides space for the fixed theme toggle button */}
      </div>

      <ThemeToggleButton />
    </main>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/page-header';
import { favorites, FavoriteItem } from '@/lib/favorites';
import { useTheme } from '@/context/ThemeContext';

// Custom gradient colors for scroll effect (will be dynamically reordered based on theme)
const gradientColors = [
  '#F5A88E', // coral
  '#FFD4B2', // peach
  '#FFB6C1', // pink
  '#D4C5F9', // lavender
  '#C5E3F6', // sky
  '#B4E7CE', // mint
];

function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const animalEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🐘', '🦏', '🐪', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🕊️', '🐇', '🐁', '🐀', '🐿️', '🦔'];

export default function FavoriteThingsPage() {
  const { currentColor } = useTheme();
  const [backgroundColor, setBackgroundColor] = useState<string>(currentColor);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Build gradient colors starting from current theme color
  const getScrollColors = () => {
    // Start with current theme color, then add the rest
    const colors = [currentColor, ...gradientColors.filter(c => c.toUpperCase() !== currentColor.toUpperCase())];
    return colors;
  };
  
  // Easter egg states
  const [pokerChips, setPokerChips] = useState<number[]>([]);
  const [chipRain, setChipRain] = useState<{id: number; x: number}[]>([]);
  const [showBigBrotherText, setShowBigBrotherText] = useState(false);
  const [planeFlying, setPlaneFlying] = useState(false);
  const [sandParticles, setSandParticles] = useState<{id: number; x: number; y: number}[]>([]);
  const [eyeEmojis, setEyeEmojis] = useState<{id: number; x: number; y: number}[]>([]);
  const [coinJump, setCoinJump] = useState(false);
  const [animalEmoji, setAnimalEmoji] = useState<{emoji: string; id: number} | null>(null);
  const [playfulBounce, setPlayfulBounce] = useState(false);
  const [highMein, setHighMein] = useState(false);

  // Update background color when theme changes
  useEffect(() => {
    setBackgroundColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const scrollProgress = scrollTop / (scrollHeight - clientHeight);
      
      const scrollColors = getScrollColors();
      const colorIndex = scrollProgress * (scrollColors.length - 1);
      const lowerIndex = Math.floor(colorIndex);
      const upperIndex = Math.min(lowerIndex + 1, scrollColors.length - 1);
      const factor = colorIndex - lowerIndex;
      
      const newColor = interpolateColor(
        scrollColors[lowerIndex],
        scrollColors[upperIndex],
        factor
      );
      
      setBackgroundColor(newColor);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [currentColor]);

  // Ocean's 13 - Poker chip click handler
  const handleOceans13Click = () => {
    if (pokerChips.length >= 12) {
      // Trigger rain effect
      const rainChips = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100
      }));
      setChipRain(rainChips);
      setPokerChips([]);
      setTimeout(() => setChipRain([]), 3000);
    } else {
      setPokerChips([...pokerChips, Date.now()]);
    }
  };

  // Big Brother - Toggle text
  const handleBigBrotherClick = () => {
    setShowBigBrotherText(!showBigBrotherText);
  };

  // A Long Way from Chicago - Plane effect
  const handleChicagoClick = () => {
    if (!planeFlying) {
      setPlaneFlying(true);
      setTimeout(() => setPlaneFlying(false), 2000);
    }
  };

  // Palossand - Sand effect
  const handlePalossandClick = () => {
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setSandParticles(particles);
    setTimeout(() => setSandParticles([]), 2000);
  };

  // Bad Bunny - Eye effect
  const handleBadBunnyClick = () => {
    const eyes = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setEyeEmojis(eyes);
    setTimeout(() => setEyeEmojis([]), 2000);
  };

  // Super Mario Maker 2 - Coin effect
  const handleMarioClick = () => {
    if (!coinJump) {
      setCoinJump(true);
      setTimeout(() => setCoinJump(false), 600);
    }
  };

  // Animal Upon Animal - Random animal
  const handleAnimalClick = () => {
    const randomAnimal = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
    setAnimalEmoji({ emoji: randomAnimal, id: Date.now() });
    setTimeout(() => setAnimalEmoji(null), 1500);
  };

  // Purdue Basketball - Open link
  const handlePurdueClick = () => {
    window.open('https://en.wikipedia.org/wiki/List_of_Big_Ten_Conference_men%27s_basketball_regular_season_champions#Championships_by_school', '_blank');
  };

  // Myers-Briggs - Open link
  const handleMyersBriggsClick = () => {
    window.open('https://www.personality-database.com/type/16/entj-famous-people', '_blank');
  };

  // Helper to render item with easter eggs
  const renderItem = (item: string | FavoriteItem, index: number, categoryName: string) => {
    const text = typeof item === 'string' ? item : item.text;
    const link = typeof item === 'object' ? item.link : undefined;
    
    // Check for easter egg items
    if (text === "Ocean's 13") {
      return (
        <span key={index} className="relative inline">
          <span 
            onClick={handleOceans13Click}
            className="cursor-default select-none"
          >
            {text}
          </span>
          {pokerChips.map((chipId, i) => (
            <span key={chipId} className="ml-1">🎰</span>
          ))}
        </span>
      );
    }
    
    if (text === 'Big Brother') {
      return (
        <span key={index} className="relative">
          <span 
            onClick={handleBigBrotherClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
          <AnimatePresence>
            {showBigBrotherText && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-2 text-charcoal/60 italic"
              >
                — Nothing will beat the Rylie eviction
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      );
    }
    
    if (text === 'A Long Way from Chicago') {
      return (
        <span key={index} className="relative">
          <span 
            onClick={handleChicagoClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
        </span>
      );
    }
    
    if (text === 'Palossand') {
      return (
        <span key={index}>
          <span 
            onClick={handlePalossandClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
        </span>
      );
    }
    
    if (text === 'Bad Bunny') {
      return (
        <span key={index}>
          <span 
            onClick={handleBadBunnyClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
        </span>
      );
    }
    
    if (text === 'Super Mario Maker 2') {
      return (
        <span key={index} className="relative inline-block">
          <span 
            onClick={handleMarioClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
          <AnimatePresence>
            {coinJump && (
              <motion.span
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -30, opacity: [1, 1, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -top-2 left-1/2 text-xl"
              >
                🪙
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      );
    }
    
    if (text === 'Animal Upon Animal') {
      return (
        <span key={index} className="relative inline">
          <span 
            onClick={handleAnimalClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
          <AnimatePresence>
            {animalEmoji && (
              <motion.span
                key={animalEmoji.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="ml-2 text-xl"
              >
                {animalEmoji.emoji}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      );
    }
    
    if (text === 'Purdue Basketball') {
      return (
        <span key={index}>
          <span 
            onClick={handlePurdueClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
        </span>
      );
    }
    
    if (text === 'Myers-Briggs: ENTJ-A') {
      return (
        <span key={index}>
          <span 
            onClick={handleMyersBriggsClick}
            className="cursor-default select-none"
          >
            {text}
          </span>
        </span>
      );
    }
    
    if (text === 'Playful') {
      return (
        <motion.span
          key={index}
          onClick={() => {
            setPlayfulBounce(true);
            setTimeout(() => setPlayfulBounce(false), 1200);
          }}
          animate={playfulBounce ? {
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.2, 0.9, 1.15, 0.95, 1],
            color: ['#3A3A3A', '#F5A88E', '#A8D5BA', '#C3B1E1', '#FDDCB5', '#3A3A3A'],
          } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="cursor-default select-none inline-block"
        >
          {text}
        </motion.span>
      );
    }

    if (text === 'Lo mein') {
      return (
        <motion.span
          key={index}
          onClick={() => setHighMein(!highMein)}
          animate={{ y: highMein ? -14 : 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          className="cursor-default select-none inline-block"
        >
          {highMein ? 'High mein' : 'Lo mein'}
        </motion.span>
      );
    }

    // Regular items with optional links
    if (link) {
      const isExternal = link.startsWith('http');
      const isImage = link.endsWith('.jpg') || link.endsWith('.png');
      
      return (
        <a
          key={index}
          href={link}
          target={isExternal || isImage ? '_blank' : '_self'}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          {text}
        </a>
      );
    }
    
    return <span key={index}>{text}</span>;
  };

  // Special formatting for Theme park category
  const renderThemeParkItems = (items: (string | FavoriteItem)[]) => {
    return (
      <ul className="mt-2 space-y-1 ml-4">
        <li className="flex">
          <span className="mr-3 flex-shrink-0">•</span>
          <span>{renderItem(items[0], 0, 'Theme park')} v. Disney with the Marvel IP</span>
        </li>
        <li className="flex">
          <span className="mr-3 flex-shrink-0">•</span>
          <span>Forced {renderItem(items[1], 1, 'Theme park')} to make buildings appear larger</span>
        </li>
        <li className="flex">
          <span className="mr-3 flex-shrink-0">•</span>
          <span>{renderItem(items[2], 2, 'Theme park')}</span>
        </li>
      </ul>
    );
  };

  // Render items as bullet list
  const renderBulletList = (items: (string | FavoriteItem)[], categoryName: string) => {
    return (
      <ul className="mt-2 space-y-1 ml-4">
        {items.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-3 flex-shrink-0">•</span>
            <span>{renderItem(item, index, categoryName)}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="relative h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{ backgroundColor }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Chip Rain Effect */}
      <AnimatePresence>
        {chipRain.map((chip) => (
          <motion.div
            key={chip.id}
            initial={{ y: -50, x: `${chip.x}vw`, opacity: 1 }}
            animate={{ y: '110vh', rotate: 720 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 + Math.random(), ease: 'linear' }}
            className="fixed top-0 text-3xl z-50 pointer-events-none"
          >
            🎰
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Plane Effect */}
      <AnimatePresence>
        {planeFlying && (
          <motion.div
            initial={{ x: '-10vw', y: '30vh' }}
            animate={{ x: '110vw', y: '20vh' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'linear' }}
            className="fixed text-5xl z-50 pointer-events-none"
          >
            ✈️
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sand Effect */}
      <AnimatePresence>
        {sandParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              y: '110vh',
              opacity: 0,
              scale: 0.5
            }}
            transition={{ duration: 1.5 + Math.random(), ease: 'easeIn' }}
            className="fixed text-2xl z-50 pointer-events-none"
            style={{ color: '#C2B280' }}
          >
            •
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Eye Emoji Effect */}
      <AnimatePresence>
        {eyeEmojis.map((eye) => (
          <motion.div
            key={eye.id}
            initial={{ 
              x: `${eye.x}vw`, 
              y: `${eye.y}vh`,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.8]
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="fixed text-3xl z-50 pointer-events-none"
          >
            👁️
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div 
        ref={scrollRef}
        className="relative z-10 h-full overflow-y-auto p-8 md:p-12 lg:p-16"
      >
        <PageHeader title="Favorite things" />
        
        {/* Favorites List */}
        <div className="mt-8 max-w-3xl space-y-6">
          {favorites.map((fav, index) => (
            <div key={index} className="font-body text-lg md:text-xl text-charcoal">
              <span className="font-semibold">{fav.category}</span>
              {fav.category === 'Theme park nerd discussion topics'
                ? renderThemeParkItems(fav.items)
                : renderBulletList(fav.items, fav.category)
              }
            </div>
          ))}
        </div>
        
        {/* Extra padding at bottom for scroll */}
        <div className="h-32" />
      </div>
    </main>
  );
}

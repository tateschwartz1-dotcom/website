"use client";

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggleButton() {
  const { cycleColor, currentColor } = useTheme();

  return (
    <button
      onClick={cycleColor}
      className="fixed bottom-8 left-8 md:left-12 lg:left-16 z-50 focus:outline-none active:opacity-80 transition-opacity"
      aria-label="Toggle theme color"
    >
      {/* Outer ring - white background for visibility */}
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors duration-500"
        style={{ borderColor: currentColor }}
      >
        {/* Inner circle */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-inner transition-colors duration-500"
          style={{ backgroundColor: currentColor }}
        />
      </div>
    </button>
  );
}

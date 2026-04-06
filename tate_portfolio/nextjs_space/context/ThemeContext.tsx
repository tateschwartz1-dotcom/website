"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available theme colors
export const THEME_COLORS = [
  '#F5A88E', // coral
  '#B4E7CE', // mint
  '#D4C5F9', // lavender
  '#FFD4B2', // peach
  '#C5E3F6', // sky
] as const;

type ThemeColor = typeof THEME_COLORS[number];

interface ThemeContextType {
  currentColor: ThemeColor;
  cycleColor: () => void;
  currentIndex: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedIndex = localStorage?.getItem('themeColorIndex');
    if (savedIndex !== null && savedIndex !== undefined) {
      const parsedIndex = parseInt(savedIndex, 10);
      if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < THEME_COLORS.length) {
        setCurrentIndex(parsedIndex);
      }
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage?.setItem('themeColorIndex', currentIndex.toString());
    }
  }, [currentIndex, mounted]);

  const cycleColor = () => {
    setCurrentIndex((prev) => (prev + 1) % THEME_COLORS.length);
  };

  const value: ThemeContextType = {
    currentColor: THEME_COLORS[currentIndex],
    cycleColor,
    currentIndex,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

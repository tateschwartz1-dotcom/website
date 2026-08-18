// Reader preferences for post pages. Global (one setting applies everywhere)
// and persisted, alongside the site theme color, in localStorage.

export const STORAGE_KEY = 'postReaderSettings';

export const TYPEFACES = [
  { id: 'garamond', label: 'Garamond', stack: 'var(--font-garamond), Garamond, Georgia, serif' },
  { id: 'courier', label: 'Courier', stack: '"Courier Prime", "Courier New", monospace' },
  { id: 'consolas', label: 'Consolas', stack: 'Consolas, "Lucida Console", monospace' },
  { id: 'sans', label: 'Sans', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
] as const;

/** Body size in px; everything else on the page scales off this with `em`. */
export const SIZES = [16, 18, 20, 23] as const;

export const SPACINGS = [
  { id: 'tight', label: 'Tight', value: 1.5 },
  { id: 'normal', label: 'Normal', value: 1.72 },
  { id: 'loose', label: 'Loose', value: 1.95 },
] as const;

export const WIDTHS = [
  { id: 'narrow', label: 'Narrow', value: '32rem' },
  { id: 'normal', label: 'Normal', value: '39rem' },
  { id: 'wide', label: 'Wide', value: '46rem' },
] as const;

export interface Background {
  id: string;
  label: string;
  bg: string;
  fg: string;
  /** Dark grounds invert the black-ink drawings so they stay visible. */
  dark?: boolean;
}

// The five site theme colors first, then the two paper tones and night.
export const BACKGROUNDS: Background[] = [
  { id: 'peach', label: 'Peach', bg: '#FFD4B2', fg: '#3A3A3A' },
  { id: 'mint', label: 'Mint', bg: '#B4E7CE', fg: '#3A3A3A' },
  { id: 'coral', label: 'Coral', bg: '#F5A88E', fg: '#3A3A3A' },
  { id: 'sky', label: 'Sky', bg: '#C5E3F6', fg: '#3A3A3A' },
  { id: 'lavender', label: 'Lavender', bg: '#D4C5F9', fg: '#3A3A3A' },
  { id: 'white', label: 'White', bg: '#FFFFFF', fg: '#3A3A3A' },
  { id: 'cream', label: 'Cream', bg: '#F6F0E2', fg: '#3D3830' },
  { id: 'night', label: 'Night', bg: '#232323', fg: '#E9E4DA', dark: true },
];

/** Maps ThemeContext's THEME_COLORS order onto the background ids above. */
export const THEME_BACKGROUND_IDS = ['peach', 'mint', 'coral', 'sky', 'lavender'];

export interface ReaderSettings {
  typeface: string;
  size: number;
  spacing: string;
  width: string;
  /** `'theme'` follows the site's current color; anything else is an explicit pick. */
  background: string;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  typeface: 'garamond',
  size: 20,
  spacing: 'normal',
  width: 'normal',
  background: 'theme',
};

export function resolveBackground(settings: ReaderSettings, themeIndex: number): Background {
  const id =
    settings.background === 'theme'
      ? THEME_BACKGROUND_IDS[themeIndex] ?? THEME_BACKGROUND_IDS[0]
      : settings.background;
  return BACKGROUNDS.find((option) => option.id === id) ?? BACKGROUNDS[0];
}

/** `#3A3A3A` + 0.25 -> `rgba(58,58,58,0.25)`, for rules and other tinted chrome. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function loadSettings(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ReaderSettings>;
    return {
      typeface: TYPEFACES.some((t) => t.id === parsed.typeface) ? parsed.typeface! : DEFAULT_SETTINGS.typeface,
      size: SIZES.includes(parsed.size as typeof SIZES[number]) ? parsed.size! : DEFAULT_SETTINGS.size,
      spacing: SPACINGS.some((s) => s.id === parsed.spacing) ? parsed.spacing! : DEFAULT_SETTINGS.spacing,
      width: WIDTHS.some((w) => w.id === parsed.width) ? parsed.width! : DEFAULT_SETTINGS.width,
      background:
        parsed.background === 'theme' || BACKGROUNDS.some((b) => b.id === parsed.background)
          ? parsed.background!
          : DEFAULT_SETTINGS.background,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ReaderSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Private browsing / storage disabled — settings just don't persist.
  }
}

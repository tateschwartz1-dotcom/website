export interface FavoriteItem {
  text: string;
  link?: string;
}

export interface FavoriteCategory {
  category: string;
  items: (string | FavoriteItem)[];
}

export const favorites: FavoriteCategory[] = [
  {
    category: 'Movies',
    items: ["Ocean's 13", 'Moneyball', 'Charlie and the Chocolate Factory (2005)'],
  },
  {
    category: 'Shows',
    items: ['Big Brother', 'Dragula', 'Hotel Hell'],
  },
  {
    category: 'Books',
    items: ['A Long Way from Chicago', 'Thinking, Fast and Slow', 'Dream School'],
  },
  {
    category: 'Pokemon',
    items: ['Palossand', 'Porygon', 'Fuecoco'],
  },
  {
    category: 'Music artists',
    items: ['Bad Bunny', 'Orville Peck', 'Glorb'],
  },
  {
    category: 'Video games',
    items: ['Super Mario Maker 2', 'Minecraft build battle', 'Photo Roulette'],
  },
  {
    category: 'Tabletop games',
    items: ['Animal Upon Animal', 'Slapzi', 'Splendor'],
  },
  {
    category: 'Sport teams',
    items: ['Purdue Basketball', 'Kahawa Pride FC', 'Detroit Tigers'],
  },
  {
    category: 'Personality tests',
    items: [
      'Myers-Briggs: ENTJ-A',
      'CliftonStrengths: Significance, Strategic, Futuristic, Achiever, Focus',
      { text: 'Tate Princess', link: '/tate-princess.jpg' },
    ],
  },
  {
    category: 'Theme park nerd discussion topics',
    items: [
      { text: 'Universal', link: 'http://www.fordhamiplj.org/2016/02/05/universal-and-disneys-arrangement-on-marvel-ip-in-theme-parks/' },
      { text: 'perspectives', link: 'https://amusementlogic.com/general-news/forced-perspective-technique-in-theming/' },
      'Potential park expansions',
    ],
  },
  {
    category: 'Foods',
    items: ['Lo mein', 'Ribs', 'Pizza'],
  },
  {
    category: 'Words that describe me',
    items: ['Playful', 'Creative', 'Strategic'],
  },
];

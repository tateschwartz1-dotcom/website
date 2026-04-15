export interface ProjectLink {
  text: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  descriptionLinks?: ProjectLink[];
  bulletList?: string[];
  image: string;
  rotation: number;
  position: { top: string; left: string };
  size: { width: string; height: string };
  scale?: number;
  link?: string;
  linkText?: string;
}

export const projects: Project[] = [
  {
    id: 'recruit-poster',
    title: 'Card Games',
    description: "One of my favorite hobbies is custom card game design. I usually start with index cards until I upgrade to Photoshop layouts printed professionally. Some of my games include:",
    bulletList: [
      'Fighting with frogs',
      'Trying to outsmart a demon in the woods',
      'UNO, but very very  v e r y  different',
      'Knights in a battle of courage',
      'Recruiting a team to help you survive the end of the world',
    ],
    image: '/projects/recruitback.png',
    rotation: -12,
    position: { top: '5%', left: '5%' },
    size: { width: '180px', height: '240px' },
    scale: 0.85,
  },
  {
    id: 'classified',
    title: 'Classified',
    description: "I'm working on some new exciting projects now. I can't share the details… but here are some sneak peaks.",
    descriptionLinks: [
      { text: 'MascotGO', url: 'https://www.mascotgo.com/' },
      { text: 'Degy Entertainment', url: 'https://www.degy.com/' },
    ],
    image: '/projects/classifiedfolder.png',
    rotation: -8,
    position: { top: '8%', left: '50%' },
    size: { width: '200px', height: '160px' },
    scale: 0.8,
  },
  {
    id: 'johnbox-games',
    title: 'Johnbox Games',
    description: "I love playing party games with my friends. To access premium features and ensure everyone can play on any device, I whipped up free versions of our favorite games.\n\nIt might take a minute to load the first time it\u2019s booted up. Play ",
    image: '/projects/newestJBGL.png',
    rotation: 3,
    position: { top: '45%', left: '35%' },
    size: { width: '160px', height: '160px' },
    scale: 0.82,
    link: 'https://johnboxgames.onrender.com/',
    linkText: 'here',
  },
  {
    id: 'miel-wearline',
    title: 'MIEL Wearline',
    description: "This is one of my shirts from my apparel business. Each design took inspiration from different iconic parts of my hometown.\n\nAlthough the business is now closed, you can visit a janky archived version of the website ",
    image: '/projects/shirtback.png',
    rotation: -5,
    position: { top: '35%', left: '25%' },
    size: { width: '200px', height: '220px' },
    scale: 1.15,
    link: 'https://web.archive.org/web/20250817155636/https:/mielwearline.store/',
    linkText: 'here',
  },
  {
    id: 'card-back',
    title: 'Playing Cards & Dice',
    description: "I love inventing original games using a deck of cards and some plain dice. I've collected all of my greatest hits and put them in a packet, sorted by game type. (I left out the many, many, many duds.)\n\nDownload the packet ",
    image: '/projects/cardback2.png',
    rotation: 2,
    position: { top: '30%', left: '65%' },
    size: { width: '140px', height: '200px' },
    scale: 0.85,
    link: '/Playing-Cards-and-Dice.pdf',
    linkText: 'here',
  },
  {
    id: 'el-summer-games',
    title: 'EL Summer Games',
    description: "In 2023, I hosted a month-long online competition where people would compete in unusual games for points. With over 50 players, it was a great success and very entertaining to judge.\n\nA link to the Instagram account is ",
    image: '/projects/ELSGlogo.png',
    rotation: -3,
    position: { top: '45%', left: '10%' },
    size: { width: '150px', height: '150px' },
    scale: 0.75,
    link: 'https://www.instagram.com/el.summer.games?igsh=MXRmbDFvNDY4MzRzYg==',
    linkText: 'here',
  },
  {
    id: 'book-cover',
    title: 'Forty Thousand Words',
    description: "Every summer, I try to release a different creative project. One of my adventures was working with my friend to write and publish a book. We had a lot of fun with the process of production, creating a really silly light read.\n\nYou can buy the book ",
    image: '/projects/bookcover.jpg',
    rotation: 4,
    position: { top: '55%', left: '55%' },
    size: { width: '160px', height: '220px' },
    scale: 1,
    link: 'https://www.amazon.com/Forty-Thousand-Words-Tate-Schwartz/dp/B0BBQLH29L',
    linkText: 'here',
  },
  {
    id: 'the-process',
    title: 'The Process',
    description: "I write all of my ideas on paper before creating them. Here are some of the pages from making this website.",
    image: '/projects/Box.png',
    rotation: -6,
    position: { top: '75%', left: '30%' },
    size: { width: '160px', height: '160px' },
    scale: 1,
  },
];

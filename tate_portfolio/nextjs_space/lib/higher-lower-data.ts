export interface InlineLink {
  text: string;
  url: string;
  postAnswer?: boolean;
  newTab?: boolean;
}

export interface GameCard {
  description: string;
  numberPrompt: string;
  number: number;
  color: string;
  imageSrc?: string;
  imageContain?: boolean;
  descriptionLinks?: InlineLink[];
  promptLinks?: InlineLink[];
}

export const gameCards: GameCard[] = [
  {
    description:
      "My parents met in the Air Force, moving my childhood all over the place. I was born in Illinois, then bounced between England, Minnesota, Virginia and Michigan. Having to reset so many times brought me close to my sister.",
    numberPrompt: "The amount of miles I moved between those five locations",
    number: 9850,
    color: "#F5A88E",
    imageSrc: "/higher-lower/origins.png",
    descriptionLinks: [
      { text: "card games", url: "/projects/card-back", newTab: true },
    ],
  },
  {
    description:
      "Now, I attend Purdue University, studying Communication and Spanish. My classes involve a lot of writing, presenting, media theory and research.",
    numberPrompt:
      "The number of words the average person speaks per day (per a 2025 study)",
    number: 12650,
    color: "#A8D5BA",
    imageSrc: "/higher-lower/now.jpg",
    promptLinks: [
      {
        text: "study",
        url: "https://psycnet.apa.org/doiLanding?doi=10.1037%2Fpspp0000534",
        postAnswer: true,
      },
    ],
  },
  {
    description:
      "Working for the independent local newspaper, I wore a lot of hats. I wrote stories, filmed videos, created puzzles, designed pages, managed large teams and edited everything.",
    numberPrompt:
      "The total number of New York Times crossword puzzles published before 2020",
    number: 25620,
    color: "#C3B1E1",
    imageSrc: "/higher-lower/exponent.jpg",
  },
  {
    description:
      "During the summer, I teach at a journalism camp for high school students. I love being a mentor and teaching new skills. (And cheering loudly during the volleyball tournament.)",
    numberPrompt:
      "The total number of minutes I have spent working at the camp",
    number: 17550,
    color: "#FDDCB5",
    imageSrc: "/higher-lower/mipa.png",
  },
  {
    description:
      "My favorite class was studying away in Washington D.C. for American Political Communication. I got to learn from legislators, lawyers and leaders about how the city works.\n\nWhen I returned to campus, my job was to moderate nonpartisan political discussions on controversial topics for the C-SPAN Student Community. I was also on C-SPAN\u2019s national broadcast to interview an economist about college affordability.",
    numberPrompt:
      "Views my C-SPAN Washington Journal clip got on Instagram after six months",
    number: 2653,
    color: "#A7C7E7",
    imageSrc: "/higher-lower/politics.jpg",
    promptLinks: [
      {
        text: "Instagram",
        url: "https://www.instagram.com/reel/DOoqlbkkad0/?igsh=YTdwaXk1MXVpenZ6",
        postAnswer: true,
      },
    ],
  },
  {
    description:
      "When prospective students come to visit campus, it\u2019s my job to greet them. I meet with families to break down complex academic programs and share about student life as a representative of the university.",
    numberPrompt:
      "The number of students in Purdue\u2019s College of Liberal Arts in 2025",
    number: 2791,
    color: "#F5A88E",
    imageSrc: "/higher-lower/deans.png",
  },
  {
    description:
      "I currently intern at MascotGO, a startup company building an AI-native college discovery experience. It has been a blessing to work in such a fast-paced environment under the mentorship of a Silicon Valley veteran and a global technology CEO.",
    numberPrompt:
      "The number of degree-granting colleges nationwide in 2024",
    number: 3981,
    color: "#A8D5BA",
    imageSrc: "/higher-lower/mascotgo.png",
    descriptionLinks: [
      { text: "Silicon Valley veteran", url: "https://www.peteravritch.com/" },
      { text: "global technology CEO", url: "https://www.helenfuthomas.com/" },
    ],
  },
  {
    description:
      "As a Booking & Sales intern for Degy Entertainment, I support the Parks & Rec department with selling entertainment packages. I write blog posts, research clients and draft proposals for potential market expansions.",
    numberPrompt:
      "The cost (in dollars) of a Bubble Bash Foam Party package for 300 people",
    number: 4200,
    color: "#C3B1E1",
    imageSrc: "/projects/NEWDEGY.png",
    imageContain: true,
    descriptionLinks: [
      { text: "Degy Entertainment", url: "https://www.degy.com/" },
    ],
  },
  {
    description:
      "Some clubs I\u2019m in:\n\nPaint Crew: I attend every basketball game, sometimes waiting seven hours before tipoff to get the best seats.\n\nbuildpurdue: I work with a community of startup founders, collaborating on projects until 3 a.m.\n\nEffective Altruism: We raise awareness for charity causes that are high-impact but unintuitive. A few unorthodox focus areas include pandemic prevention and shrimp welfare.",
    numberPrompt:
      "The cost (in dollars) to save one life through a malaria medicine charity",
    number: 4000,
    color: "#FDDCB5",
    imageSrc: "/higher-lower/clubs.png",
    promptLinks: [
      {
        text: "charity",
        url: "https://www.givewell.org/charities/top-charities",
        postAnswer: true,
      },
    ],
  },
];

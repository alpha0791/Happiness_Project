import { Mood, Quote, QuizQuestion } from './types';

export const MOOD_TIPS: Record<Mood, string[]> = {
  happy: [
    "Keep that smile going! Share your joy with a friend.",
    "Write down what made you happy today.",
    "Do something kind for someone else to spread the vibe."
  ],
  sad: [
    "It's okay to feel sad. Try a 5-minute breathing exercise.",
    "Listen to your favorite upbeat music.",
    "Take a short walk outside and notice the nature around you."
  ],
  neutral: [
    "A perfect time for a new hobby! Try sketching or reading.",
    "Call a friend you haven't spoken to in a while.",
    "Plan something exciting for the weekend."
  ],
  surprised: [
    "Take a moment to process the news. Breathe deeply.",
    "Write down your thoughts about what happened.",
    "Share the surprise with someone you trust."
  ],
  angry: [
    "Count to ten and take deep breaths.",
    "Try some light exercise or stretching to release tension.",
    "Write down what's bothering you, then tear up the paper."
  ],
  fearful: [
    "Remind yourself that you are safe in this moment.",
    "Focus on 5 things you can see, 4 you can touch, 3 you can hear.",
    "Talk to someone who makes you feel secure."
  ],
  disgusted: [
    "Step away from the source of the feeling.",
    "Focus on something clean and pleasant.",
    "Wash your hands or face to feel refreshed."
  ]
};

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { text: "Happiness is not something readymade. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The most important thing is to enjoy your life—to be happy—it's all that matters.", author: "Audrey Hepburn" },
  { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
  { text: "Happiness is a warm puppy.", author: "Charles M. Schulz" },
  { text: "The only thing that will make you happy is being happy with who you are.", author: "Goldie Hawn" }
];

export const FRIEND_QUIZ: QuizQuestion[] = [
  {
    question: "How often do you check in on your friends?",
    options: [
      { text: "Daily - we're super close!", score: 10 },
      { text: "Weekly - we catch up regularly.", score: 7 },
      { text: "Monthly - life gets busy.", score: 4 },
      { text: "Rarely - we only talk when needed.", score: 1 }
    ]
  },
  {
    question: "Do you listen more than you talk?",
    options: [
      { text: "Always - I love hearing their stories.", score: 10 },
      { text: "Usually - I try to balance it.", score: 7 },
      { text: "Sometimes - I get excited to share too.", score: 4 },
      { text: "Not really - I have a lot to say!", score: 1 }
    ]
  }
];

export const COUPLE_QUIZ: QuizQuestion[] = [
  {
    question: "How do you handle disagreements?",
    options: [
      { text: "Talk it out calmly and find a compromise.", score: 10 },
      { text: "Take a break then discuss later.", score: 7 },
      { text: "Sometimes we argue, but we make up.", score: 4 },
      { text: "We usually just ignore the problem.", score: 1 }
    ]
  },
  {
    question: "Do you share similar life goals?",
    options: [
      { text: "Yes, we are perfectly aligned.", score: 10 },
      { text: "Mostly, with some minor differences.", score: 7 },
      { text: "We have some common ground.", score: 4 },
      { text: "We are very different people.", score: 1 }
    ]
  }
];

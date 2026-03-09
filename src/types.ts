export type Mood = 'happy' | 'sad' | 'neutral' | 'surprised' | 'angry' | 'fearful' | 'disgusted';

export interface MoodEntry {
  date: string;
  mood: Mood;
  score: number;
}

export interface Quote {
  text: string;
  author: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    score: number;
  }[];
}

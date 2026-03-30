export type View = 'test' | 'results' | 'stats' | 'gallery' | 'shop' | 'goals';
export type TestDuration = 15 | 30 | 60 | 120;
export type WordSet = 'english' | 'english1k' | 'quotes';
export type CatState = 'idle' | 'typing' | 'happy' | 'excited' | 'mindblown' | 'sleepy';
export type Theme = 'dark' | 'light' | 'matcha' | 'chai' | 'strawberry' | 'galaxy' | 'sakura' | 'seaside' | 'school';
export type CatSkin = 'default' | 'cosmic' | 'golden' | 'forest' | 'sunset';

export interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'extra';
}

export interface WordState {
  chars: CharState[];
  typed: string;
  isComplete: boolean;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: TestDuration;
  wordSet: WordSet;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  wpmHistory: number[];
  consistency: number;
}

export interface Settings {
  theme: Theme;
  fontSize: 'small' | 'medium' | 'large';
  smoothCaret: boolean;
  soundEnabled: boolean;
  catAnimations: boolean;
  bgAnimations: boolean;
}

export interface PlayerData {
  coins: number;
  totalXP: number;
  unlockedThemes: Theme[];
  unlockedCatSkins: CatSkin[];
  activeCatSkin: CatSkin;
  completedGoals: string[];
  totalWordsTyped: number;
  totalTests: number;
  bestWpm: number;
  bestAccuracy: number;
}

export interface Quote {
  text: string;
  author: string;
}

export type View = 'test' | 'results' | 'stats' | 'gallery';
export type TestDuration = 15 | 30 | 60 | 120;
export type WordSet = 'english' | 'english1k' | 'quotes';
export type CatState = 'idle' | 'typing' | 'happy' | 'excited' | 'mindblown' | 'sleepy';

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
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  smoothCaret: boolean;
  soundEnabled: boolean;
  catAnimations: boolean;
  sakuraEnabled: boolean;
}

export interface Quote {
  text: string;
  author: string;
}

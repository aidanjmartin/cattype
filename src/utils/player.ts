import type { TestResult, PlayerData, Theme, CatSkin } from '../types';

export const FREE_THEMES: Theme[] = ['dark', 'light'];

export const DEFAULT_PLAYER: PlayerData = {
  coins: 100,
  totalXP: 0,
  unlockedThemes: ['dark', 'light'],
  unlockedCatSkins: ['default'],
  activeCatSkin: 'default',
  completedGoals: [],
  totalWordsTyped: 0,
  totalTests: 0,
  bestWpm: 0,
  bestAccuracy: 0,
};

export function calculateCoins(result: TestResult): number {
  const base = Math.round(result.wpm * (result.accuracy / 100) * (result.duration / 30) * 3);
  return Math.max(1, base);
}

export interface GoalDef {
  id: string;
  label: string;
  description: string;
  reward: number;
  icon: string;
  // returns [current, target] for progress display
  progress: (result: TestResult, player: PlayerData) => [number, number];
  check: (result: TestResult, player: PlayerData) => boolean;
}

export const GOALS: GoalDef[] = [
  {
    id: 'first_test', label: 'First Steps', description: 'Complete your first test',
    reward: 75, icon: '🐾',
    progress: (_, p) => [Math.min(p.totalTests, 1), 1],
    check: (_, p) => p.totalTests >= 1,
  },
  {
    id: 'tests_5', label: 'Regular Typist', description: 'Complete 5 tests',
    reward: 100, icon: '📝',
    progress: (_, p) => [Math.min(p.totalTests, 5), 5],
    check: (_, p) => p.totalTests >= 5,
  },
  {
    id: 'tests_20', label: 'Dedicated', description: 'Complete 20 tests',
    reward: 300, icon: '💪',
    progress: (_, p) => [Math.min(p.totalTests, 20), 20],
    check: (_, p) => p.totalTests >= 20,
  },
  {
    id: 'tests_50', label: 'Obsessed', description: 'Complete 50 tests',
    reward: 750, icon: '🔥',
    progress: (_, p) => [Math.min(p.totalTests, 50), 50],
    check: (_, p) => p.totalTests >= 50,
  },
  {
    id: 'wpm_30', label: 'Getting Faster', description: 'Reach 30 WPM',
    reward: 100, icon: '⚡',
    progress: (_, p) => [Math.min(p.bestWpm, 30), 30],
    check: (r) => r.wpm >= 30,
  },
  {
    id: 'wpm_50', label: 'Speedy Paws', description: 'Reach 50 WPM',
    reward: 200, icon: '🏃',
    progress: (_, p) => [Math.min(p.bestWpm, 50), 50],
    check: (r) => r.wpm >= 50,
  },
  {
    id: 'wpm_70', label: 'Fast Cat', description: 'Reach 70 WPM',
    reward: 400, icon: '🐆',
    progress: (_, p) => [Math.min(p.bestWpm, 70), 70],
    check: (r) => r.wpm >= 70,
  },
  {
    id: 'wpm_100', label: 'Lightning Cat', description: 'Reach 100 WPM',
    reward: 1000, icon: '⚡🐱',
    progress: (_, p) => [Math.min(p.bestWpm, 100), 100],
    check: (r) => r.wpm >= 100,
  },
  {
    id: 'acc_90', label: 'Careful Paws', description: 'Get 90% accuracy',
    reward: 150, icon: '🎯',
    progress: (_, p) => [Math.min(p.bestAccuracy, 90), 90],
    check: (r) => r.accuracy >= 90,
  },
  {
    id: 'acc_95', label: 'Precision Typist', description: 'Get 95% accuracy',
    reward: 300, icon: '✨',
    progress: (_, p) => [Math.min(p.bestAccuracy, 95), 95],
    check: (r) => r.accuracy >= 95,
  },
  {
    id: 'acc_99', label: 'Purrfect', description: 'Get 99% accuracy',
    reward: 750, icon: '💎',
    progress: (_, p) => [Math.min(p.bestAccuracy, 99), 99],
    check: (r) => r.accuracy >= 99,
  },
  {
    id: 'duration_120', label: 'Endurance', description: 'Complete a 120s test',
    reward: 200, icon: '⏱️',
    progress: (r) => [r.duration >= 120 ? 1 : 0, 1],
    check: (r) => r.duration >= 120,
  },
  {
    id: 'words_500', label: 'Word Collector', description: 'Type 500 total words',
    reward: 200, icon: '📚',
    progress: (_, p) => [Math.min(p.totalWordsTyped, 500), 500],
    check: (_, p) => p.totalWordsTyped >= 500,
  },
  {
    id: 'words_2000', label: 'Novelist', description: 'Type 2000 total words',
    reward: 500, icon: '✍️',
    progress: (_, p) => [Math.min(p.totalWordsTyped, 2000), 2000],
    check: (_, p) => p.totalWordsTyped >= 2000,
  },
];

export interface ShopTheme {
  id: Theme;
  label: string;
  price: number;
  description: string;
  bg: string;
  surface: string;
  accent: string;
  correct: string;
  isLight?: boolean;
}

export interface ShopCatSkin {
  id: CatSkin;
  label: string;
  price: number;
  description: string;
  filter: string;
}

export const SHOP_THEMES: ShopTheme[] = [
  { id: 'matcha',     label: 'matcha',      price: 200, description: 'Green tea serenity',   bg: '#111a0f', surface: '#1b2818', accent: '#8ccd7c', correct: '#a8e090' },
  { id: 'chai',       label: 'chai',        price: 150, description: 'Warm & cozy light',    bg: '#f5e6c8', surface: '#ede0c4', accent: '#c47a2a', correct: '#5a8a40', isLight: true },
  { id: 'strawberry', label: 'strawberry',  price: 300, description: 'Sweet berry vibes',    bg: '#1e0810', surface: '#2e101c', accent: '#ff6b8a', correct: '#ff9fb0' },
  { id: 'galaxy',     label: 'galaxy',      price: 500, description: 'Deep space explorer',  bg: '#060818', surface: '#0c1030', accent: '#9988ff', correct: '#88c0f8' },
  { id: 'sakura',     label: 'sakura',      price: 250, description: 'Cherry blossom light', bg: '#fce8f0', surface: '#f8d4e6', accent: '#d4508a', correct: '#b048a0', isLight: true },
  { id: 'seaside',    label: 'seaside',     price: 350, description: 'Ocean breeze calm',    bg: '#06181e', surface: '#0c2432', accent: '#60d0c8', correct: '#88e0d0' },
  { id: 'school',     label: 'school',      price: 150, description: 'Notebook nostalgia',   bg: '#f8f5e8', surface: '#f0ead4', accent: '#4060d0', correct: '#30a030', isLight: true },
];

export const SHOP_CAT_SKINS: ShopCatSkin[] = [
  { id: 'cosmic',  label: 'Cosmic Cat',   price: 400, description: 'A cat from outer space',    filter: 'hue-rotate(200deg) saturate(1.4)' },
  { id: 'golden',  label: 'Golden Cat',   price: 600, description: 'Worth its weight in gold',  filter: 'sepia(0.9) saturate(2.5) hue-rotate(10deg) brightness(1.1)' },
  { id: 'forest',  label: 'Forest Cat',   price: 300, description: 'One with nature',           filter: 'hue-rotate(110deg) saturate(1.3)' },
  { id: 'sunset',  label: 'Sunset Cat',   price: 350, description: 'Warm twilight hues',        filter: 'hue-rotate(340deg) saturate(1.6) brightness(1.05)' },
];

// Process a completed test: update player data, check goals, return newly completed goals + coins earned
export function processTestResult(
  result: TestResult,
  playerData: PlayerData
): { updatedPlayer: PlayerData; newGoals: GoalDef[]; coinsEarned: number; xpEarned: number } {
  const coinsEarned = calculateCoins(result);
  const xpEarned = coinsEarned;

  const updatedPlayer: PlayerData = {
    ...playerData,
    coins: playerData.coins + coinsEarned,
    totalXP: playerData.totalXP + xpEarned,
    totalTests: playerData.totalTests + 1,
    totalWordsTyped: playerData.totalWordsTyped + result.correctChars / 5, // approx words
    bestWpm: Math.max(playerData.bestWpm, result.wpm),
    bestAccuracy: Math.max(playerData.bestAccuracy, result.accuracy),
  };

  const newGoals: GoalDef[] = [];
  for (const goal of GOALS) {
    if (updatedPlayer.completedGoals.includes(goal.id)) continue;
    if (goal.check(result, updatedPlayer)) {
      newGoals.push(goal);
      updatedPlayer.coins += goal.reward;
      updatedPlayer.completedGoals = [...updatedPlayer.completedGoals, goal.id];
    }
  }

  return { updatedPlayer, newGoals, coinsEarned, xpEarned };
}

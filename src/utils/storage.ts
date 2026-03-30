import type { TestResult, Settings, PlayerData } from '../types';
import { DEFAULT_PLAYER } from './player';

const RESULTS_KEY = 'cattype_results';
const SETTINGS_KEY = 'cattype_settings';
const PLAYER_KEY = 'cattype_player';

export function saveResult(result: TestResult): void {
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function getResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearResults(): void {
  localStorage.removeItem(RESULTS_KEY);
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): Partial<Settings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    // Migrate old sakuraEnabled → bgAnimations
    if ('sakuraEnabled' in parsed && !('bgAnimations' in parsed)) {
      parsed.bgAnimations = parsed.sakuraEnabled;
    }
    return parsed as Partial<Settings>;
  } catch {
    return {};
  }
}

export function savePlayer(player: PlayerData): void {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function loadPlayer(): PlayerData {
  try {
    const raw = localStorage.getItem(PLAYER_KEY);
    if (!raw) return { ...DEFAULT_PLAYER };
    return { ...DEFAULT_PLAYER, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PLAYER };
  }
}

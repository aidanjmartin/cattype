import type { TestResult, Settings } from '../types';

const RESULTS_KEY = 'cattype_results';
const SETTINGS_KEY = 'cattype_settings';

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
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

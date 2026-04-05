import { useState, useEffect } from 'react';
import type { Settings, Theme } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  smoothCaret: true,
  soundEnabled: false,
  catAnimations: true,
  bgAnimations: true,
  musicVolume: 0.3,
};

const ALL_THEMES: Theme[] = ['dark', 'light', 'matcha', 'chai', 'strawberry', 'galaxy', 'sakura', 'seaside', 'school'];

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...defaultSettings,
    ...loadSettings(),
  }));

  useEffect(() => {
    saveSettings(settings);
    const html = document.documentElement;
    ALL_THEMES.forEach(t => html.classList.remove(`theme-${t}`));
    html.classList.add(`theme-${settings.theme}`);
  }, [settings]);

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return { settings, updateSetting };
}

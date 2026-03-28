import { useState, useEffect } from 'react';
import type { Settings } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  smoothCaret: true,
  soundEnabled: false,
  catAnimations: true,
  sakuraEnabled: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...defaultSettings,
    ...loadSettings(),
  }));

  useEffect(() => {
    saveSettings(settings);
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return { settings, updateSetting };
}

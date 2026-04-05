import React from 'react';
import type { Settings as SettingsType, Theme } from '../types';

interface Props {
  settings: SettingsType;
  onUpdate: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void;
  onClose: () => void;
  unlockedThemes: Theme[];
}

interface ThemeSwatch {
  id: Theme;
  label: string;
  bg: string;
  surface: string;
  accent: string;
  correct: string;
  isLight?: boolean;
}

const THEMES: ThemeSwatch[] = [
  { id: 'dark',       label: 'dark',       bg: '#1e1015', surface: '#2b1622', accent: '#f7a8c0', correct: '#98d4b8' },
  { id: 'light',      label: 'light',      bg: '#fff5f8', surface: '#fce9ef', accent: '#d04070', correct: '#2a8a55', isLight: true },
  { id: 'matcha',     label: 'matcha',     bg: '#111a0f', surface: '#1b2818', accent: '#8ccd7c', correct: '#a8e090' },
  { id: 'chai',       label: 'chai ☀️',    bg: '#f5e6c8', surface: '#ede0c4', accent: '#c47a2a', correct: '#4a7830', isLight: true },
  { id: 'strawberry', label: 'strawberry', bg: '#1e0810', surface: '#2e101c', accent: '#ff6b8a', correct: '#ff9fb0' },
  { id: 'galaxy',     label: 'galaxy',     bg: '#060818', surface: '#0c1030', accent: '#9988ff', correct: '#88c0f8' },
  { id: 'sakura',     label: 'sakura ☀️',  bg: '#fce8f0', surface: '#f5d5e8', accent: '#d4508a', correct: '#7a40a0', isLight: true },
  { id: 'seaside',    label: 'seaside',    bg: '#06181e', surface: '#0c2432', accent: '#60d0c8', correct: '#88e0d0' },
  { id: 'school',     label: 'school ☀️',  bg: '#f8f5e8', surface: '#f0ead4', accent: '#4060d0', correct: '#30a030', isLight: true },
];

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm" style={{ color: 'var(--muted)' }}>{label}</span>
    {children}
  </div>
);

export const Settings: React.FC<Props> = ({ settings, onUpdate, onClose, unlockedThemes }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative rounded-2xl p-8 w-full max-w-md animate-slide-up overflow-y-auto"
        style={{ background: 'var(--surface)', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--cream)' }}>settings</h2>
          <button onClick={onClose} style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>theme</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>☀️ = light · 🔒 = buy in shop</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(t => {
                const active = settings.theme === t.id;
                const unlocked = unlockedThemes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => unlocked ? onUpdate('theme', t.id) : undefined}
                    disabled={!unlocked}
                    className="rounded-xl p-2.5 flex flex-col items-center gap-1.5 transition-all duration-150"
                    style={{
                      background: t.bg,
                      border: active ? `2px solid ${t.accent}` : `2px solid transparent`,
                      boxShadow: active ? `0 0 12px ${t.accent}55` : 'none',
                      opacity: unlocked ? 1 : 0.45,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <div className="flex gap-1">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.accent }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.correct }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.surface, border: '1px solid rgba(128,128,128,0.2)' }} />
                    </div>
                    <span style={{ color: t.accent, fontSize: '10px', fontWeight: 600 }}>
                      {unlocked ? t.label : `🔒 ${t.label}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <SettingRow label="font size">
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate('fontSize', s)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={settings.fontSize === s
                    ? { background: 'var(--accent)', color: 'var(--bg)' }
                    : { background: 'rgba(255,255,255,0.07)', color: 'var(--muted)' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Toggles */}
          {[
            { key: 'smoothCaret' as const, label: 'smooth caret' },
            { key: 'soundEnabled' as const, label: 'sound effects' },
            { key: 'catAnimations' as const, label: 'cat animations' },
            { key: 'bgAnimations' as const, label: 'bg animations' },
          ].map(({ key, label }) => (
            <SettingRow key={key} label={label}>
              <button
                onClick={() => onUpdate(key, !settings[key])}
                className="relative w-12 h-6 rounded-full transition-all duration-200"
                style={{ background: settings[key] ? 'var(--accent)' : 'rgba(255,255,255,0.12)' }}
              >
                <div
                  className="absolute w-5 h-5 rounded-full top-0.5 transition-all duration-200"
                  style={{ background: 'white', left: settings[key] ? '26px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                />
              </button>
            </SettingRow>
          ))}
        </div>
      </div>
    </div>
  );
};

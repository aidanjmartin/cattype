import React from 'react';
import type { Settings as SettingsType } from '../types';

interface Props {
  settings: SettingsType;
  onUpdate: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void;
  onClose: () => void;
}

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm" style={{ color: '#7a4d63' }}>{label}</span>
    {children}
  </div>
);

export const Settings: React.FC<Props> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(30,16,21,0.85)', backdropFilter: 'blur(4px)' }}/>
      <div
        className="relative rounded-2xl p-8 w-full max-w-sm animate-slide-up"
        style={{ background: '#2b1622' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#fceef5' }}>settings</h2>
          <button onClick={onClose} style={{ color: '#7a4d63' }} className="hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <SettingRow label="theme">
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onUpdate('theme', t)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={settings.theme === t
                    ? { background: '#f7a8c0', color: '#1e1015' }
                    : { background: 'rgba(247,168,192,0.12)', color: '#7a4d63' }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Font Size */}
          <SettingRow label="font size">
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate('fontSize', s)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={settings.fontSize === s
                    ? { background: '#f7a8c0', color: '#1e1015' }
                    : { background: 'rgba(247,168,192,0.12)', color: '#7a4d63' }
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
            { key: 'sakuraEnabled' as const, label: 'sakura petals' },
          ].map(({ key, label }) => (
            <SettingRow key={key} label={label}>
              <button
                onClick={() => onUpdate(key, !settings[key])}
                className="relative w-12 h-6 rounded-full transition-all duration-200"
                style={{ background: settings[key] ? '#f7a8c0' : 'rgba(122,77,99,0.4)' }}
              >
                <div
                  className="absolute w-5 h-5 rounded-full top-0.5 transition-all duration-200"
                  style={{
                    background: 'white',
                    left: settings[key] ? '26px' : '2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </button>
            </SettingRow>
          ))}
        </div>
      </div>
    </div>
  );
};

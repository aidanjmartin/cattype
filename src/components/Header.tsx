import React from 'react';
import type { View } from '../types';

interface Props {
  onViewChange: (view: View) => void;
  onSettingsOpen: () => void;
  coins: number;
}

export const Header: React.FC<Props> = ({ onViewChange, onSettingsOpen, coins }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 max-w-5xl mx-auto w-full">
      <button onClick={() => onViewChange('test')} className="flex items-center gap-3 group">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="group-hover:scale-110 transition-transform">
          <circle cx="16" cy="15" r="10" fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
          <path d="M8 10 L5 5 L12 9 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M24 10 L27 5 L20 9 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="13" cy="15" r="2" fill="var(--accent)"/>
          <circle cx="19" cy="15" r="2" fill="var(--accent)"/>
          <path d="M13 19 Q16 22 19 19" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <line x1="2" y1="14" x2="8" y2="15" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="24" y1="15" x2="30" y2="14" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M22 24 Q28 22 28 26 Q28 30 24 29" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
        </svg>
        <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Nunito', color: 'var(--accent)' }}>
          CatType
        </span>
      </button>

      <nav className="flex items-center gap-1">
        {/* Coin display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mr-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '14px' }}>🪙</span>
          <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent)' }}>{coins}</span>
        </div>

        {/* Goals */}
        <button
          onClick={() => onViewChange('goals')}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          title="Goals"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        </button>

        {/* Shop */}
        <button
          onClick={() => onViewChange('shop')}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          title="Shop"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>

        {/* Gallery */}
        <button
          onClick={() => onViewChange('gallery')}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          title="Cat Gallery"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>

        {/* Stats */}
        <button
          onClick={() => onViewChange('stats')}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          title="Stats"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="5" height="14" rx="1"/>
            <rect x="9" y="6" width="5" height="10" rx="1"/>
            <rect x="16" y="1" width="5" height="15" rx="1"/>
            <line x1="2" y1="22" x2="22" y2="22"/>
          </svg>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsOpen}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          title="Settings"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </button>
      </nav>
    </header>
  );
};

import React, { useState, useCallback } from 'react';
import type { Soundtrack, Theme } from '../types';
import { SHOP_SOUNDTRACKS } from '../utils/player';

interface Props {
  isPlaying: boolean;
  currentTrack: Soundtrack;
  hasEverPlayed: boolean;
  volume: number;          // 0–1
  theme: Theme;
  onTogglePlay: () => void;
  onSkip: () => void;
  onVolumeChange: (v: number) => void;
}

const LIGHT_THEMES = new Set<Theme>(['light', 'sakura', 'chai', 'school']);

const TRACK_META = Object.fromEntries(
  SHOP_SOUNDTRACKS.map(t => [t.id, { label: t.label, emoji: t.emoji, color: t.accentColor }])
) as Record<Soundtrack, { label: string; emoji: string; color: string }>;

// 5-bar EQ with scaleY animation — more authentic than height-based
function EqBars({ active, color }: { active: boolean; color: string }) {
  return (
    <div
      className="flex items-center gap-px"
      style={{ height: 16, width: 22, alignItems: 'center' }}
    >
      {[0.55, 0.9, 1.0, 0.75, 0.45].map((base, i) => (
        <div
          key={i}
          className={active ? 'eq-bar' : ''}
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: color,
            transformOrigin: 'center',
            transform: active ? undefined : `scaleY(${base * 0.28})`,
            opacity: active ? 0.85 : 0.35,
            animationDelay: `${i * 0.1}s`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export const MiniPlayer: React.FC<Props> = ({
  isPlaying,
  currentTrack,
  hasEverPlayed,
  volume,
  theme,
  onTogglePlay,
  onSkip,
  onVolumeChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const meta = TRACK_META[currentTrack];
  const isLight = LIGHT_THEMES.has(theme);

  const handleVolumeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Glass values differ for light vs dark themes (per research)
  const glassBg     = isLight ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.08)';
  const glassBorder = isLight ? '1px solid rgba(255,255,255,0.60)' : '1px solid rgba(255,255,255,0.18)';
  const glassOuter  = isLight ? '0 8px 24px rgba(0,0,0,0.12)' : '0 8px 32px rgba(0,0,0,0.35)';
  const glassInset  = isLight
    ? 'inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.04)'
    : 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.10)';

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 select-none"
      style={{ transform: 'translateX(-50%)' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Glow halo behind the pill when playing */}
      {isPlaying && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${meta.color}28 0%, transparent 68%)`,
            transform: 'scale(1.5)',
            animation: 'pulse-glow 2.8s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="relative flex items-center gap-3 px-4 py-2.5 rounded-full"
        style={{
          background: glassBg,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: glassBorder,
          boxShadow: `${glassOuter}, ${glassInset}`,
          minWidth: 220,
          maxWidth: expanded ? 348 : 244,
          overflow: 'hidden',
          transition: 'max-width 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Diagonal shimmer overlay — mimics glass catching light */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.04) 100%)',
          }}
        />

        {/* EQ bars */}
        <div className="flex-shrink-0 relative z-10">
          <EqBars active={isPlaying} color={meta.color} />
        </div>

        {/* Track info */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 relative z-10">
          <span style={{ fontSize: 13 }}>{meta.emoji}</span>
          <span
            className="text-xs font-semibold truncate"
            style={{ color: 'var(--cream)', maxWidth: 88 }}
          >
            {!hasEverPlayed ? 'click ▶ to play' : meta.label}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0 relative z-10">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
            style={{
              background: `${meta.color}28`,
              color: meta.color,
              boxShadow: `0 1px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                <rect x="0.5" y="0.5" width="2.5" height="8" rx="1"/>
                <rect x="5.5" y="0.5" width="2.5" height="8" rx="1"/>
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
                <path d="M1.5 1L8 4.5L1.5 8V1Z"/>
              </svg>
            )}
          </button>

          {/* Skip */}
          <button
            onClick={onSkip}
            className="w-6 h-6 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
            style={{ color: 'var(--muted)', opacity: 0.7 }}
            title="Skip"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 1.5L5.5 5L1 8.5V1.5Z"/>
              <rect x="6.5" y="1.5" width="2" height="7" rx="1"/>
            </svg>
          </button>
        </div>

        {/* Volume — slides in on hover */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0 overflow-hidden relative z-10"
          style={{
            maxWidth: expanded ? 96 : 0,
            opacity: expanded ? 1 : 0,
            transition: 'max-width 0.28s ease, opacity 0.2s ease',
          }}
          onClick={handleVolumeClick}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <path d="M1 4h2l3-2.5v9L3 8H1z" fill="currentColor"/>
            {volume > 0.05 && <path d="M7.5 3.5c1 .9 1.5 1.6 1.5 2.5s-.5 1.7-1.5 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none"/>}
            {volume > 0.55 && <path d="M9.5 2c1.3 1.2 2 2.4 2 4s-.7 2.8-2 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none"/>}
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            className="mini-volume-slider"
            style={{ width: 62 }}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { TestResult, CatState, CatSkin } from '../types';
import { WpmChart } from './WpmChart';
import { CatMascot } from './CatMascot';

interface Props {
  result: TestResult;
  onRestart: () => void;
  catAnimations: boolean;
  coinsEarned?: number;
  newGoals?: { label: string; reward: number; icon: string }[];
  catSkin?: CatSkin;
}

function getCatState(wpm: number): CatState {
  if (wpm < 30) return 'sleepy';
  if (wpm < 60) return 'happy';
  if (wpm < 100) return 'excited';
  return 'mindblown';
}

function getWpmComment(wpm: number): string {
  if (wpm < 20) return "Keep practicing, you'll get there!";
  if (wpm < 40) return 'Good effort! Every keystroke counts.';
  if (wpm < 60) return "Nice typing! You're getting faster.";
  if (wpm < 80) return 'Great speed! Above average!';
  if (wpm < 100) return "Impressive! You're a skilled typist!";
  if (wpm < 120) return 'Excellent! You type like a pro!';
  return 'Legendary! Are you even human?!';
}

export const Results: React.FC<Props> = ({ result, onRestart, catAnimations, coinsEarned = 0, newGoals = [], catSkin = 'default' }) => {
  const catState = getCatState(result.wpm);

  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto px-4">
      <div className="rounded-2xl p-8" style={{ background: 'var(--surface)' }}>
        {/* WPM Hero */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>wpm</div>
            <div className="text-7xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
              {result.wpm}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              raw: <span className="font-mono" style={{ color: 'var(--cream)' }}>{result.rawWpm}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <CatMascot state={catState} animated={catAnimations} size={96} skin={catSkin} />
            <p className="text-xs text-right max-w-xs" style={{ color: 'var(--muted)' }}>
              {getWpmComment(result.wpm)}
            </p>
            {coinsEarned > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-pop-in" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '14px' }}>🪙</span>
                <span className="font-bold font-mono text-sm" style={{ color: 'var(--accent)' }}>+{coinsEarned}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>accuracy</div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--correct)' }}>
              {result.accuracy}%
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>consistency</div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--cream)' }}>
              {result.consistency}%
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>characters</div>
            <div className="text-sm font-mono mt-1">
              <span style={{ color: 'var(--correct)' }}>{result.correctChars}</span>
              <span style={{ color: 'var(--muted)' }}>/</span>
              <span style={{ color: 'var(--error)' }}>{result.incorrectChars}</span>
              <span style={{ color: 'var(--muted)' }}>/</span>
              <span style={{ color: 'var(--muted)' }}>{result.extraChars}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>cor/inc/ext</div>
          </div>
        </div>

        {/* Chart */}
        {result.wpmHistory.length > 1 && (
          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>wpm over time</div>
            <WpmChart data={result.wpmHistory} />
          </div>
        )}

        {/* New goals earned */}
        {newGoals.length > 0 && (
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>goals completed!</div>
            <div className="flex flex-col gap-2">
              {newGoals.map((g, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl animate-pop-in" style={{ background: 'rgba(255,255,255,0.06)', animationDelay: `${i * 0.1}s` }}>
                  <span className="text-sm">{g.icon} <span style={{ color: 'var(--cream)' }}>{g.label}</span></span>
                  <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>🪙 +{g.reward}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onRestart}
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            Next Test
          </button>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            or press{' '}
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)' }}>Tab</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)' }}>Enter</kbd>
            {' to restart'}
          </p>
        </div>
      </div>
    </div>
  );
};

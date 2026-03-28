import React from 'react';
import type { TestResult, CatState } from '../types';
import { WpmChart } from './WpmChart';
import { CatMascot } from './CatMascot';

interface Props {
  result: TestResult;
  onRestart: () => void;
  catAnimations: boolean;
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

export const Results: React.FC<Props> = ({ result, onRestart, catAnimations }) => {
  const catState = getCatState(result.wpm);

  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto px-4">
      <div
        className="rounded-2xl p-8"
        style={{ background: '#16213e' }}
      >
        {/* WPM Hero */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a4e69' }}>wpm</div>
            <div className="text-7xl font-bold font-mono" style={{ color: '#f7a8b8' }}>
              {result.wpm}
            </div>
            <div className="text-sm mt-1" style={{ color: '#4a4e69' }}>
              raw: <span className="font-mono" style={{ color: '#f5f0e8' }}>{result.rawWpm}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <CatMascot state={catState} animated={catAnimations} />
            <p className="text-xs text-right max-w-xs" style={{ color: '#4a4e69' }}>
              {getWpmComment(result.wpm)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-4" style={{ background: 'rgba(247,168,184,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a4e69' }}>accuracy</div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#b8e0d2' }}>
              {result.accuracy}%
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(247,168,184,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a4e69' }}>consistency</div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#f5f0e8' }}>
              {result.consistency}%
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(247,168,184,0.05)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a4e69' }}>characters</div>
            <div className="text-sm font-mono mt-1" style={{ color: '#f5f0e8' }}>
              <span style={{ color: '#b8e0d2' }}>{result.correctChars}</span>
              <span style={{ color: '#4a4e69' }}>/</span>
              <span style={{ color: '#ff6b6b' }}>{result.incorrectChars}</span>
              <span style={{ color: '#4a4e69' }}>/</span>
              <span style={{ color: '#4a4e69' }}>{result.extraChars}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: '#4a4e69' }}>cor/inc/ext</div>
          </div>
        </div>

        {/* Chart */}
        {result.wpmHistory.length > 1 && (
          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#4a4e69' }}>wpm over time</div>
            <WpmChart data={result.wpmHistory} />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onRestart}
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: '#f7a8b8', color: '#1a1a2e' }}
          >
            Next Test
          </button>
          <p className="text-xs" style={{ color: '#4a4e69' }}>
            or press{' '}
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#1a1a2e' }}>Tab</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#1a1a2e' }}>Enter</kbd>
            {' to restart'}
          </p>
        </div>
      </div>
    </div>
  );
};

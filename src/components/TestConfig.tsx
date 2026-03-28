import React from 'react';
import type { TestDuration, WordSet } from '../types';

interface Props {
  duration: TestDuration;
  wordSet: WordSet;
  onDurationChange: (d: TestDuration) => void;
  onWordSetChange: (w: WordSet) => void;
}

const DURATIONS: TestDuration[] = [15, 30, 60, 120];
const WORD_SETS: { value: WordSet; label: string }[] = [
  { value: 'english', label: 'english' },
  { value: 'english1k', label: 'english 1k' },
  { value: 'quotes', label: 'quotes' },
];

export const TestConfig: React.FC<Props> = ({ duration, wordSet, onDurationChange, onWordSetChange }) => {
  const pillClass = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-neko-bg font-bold'
        : 'hover:text-neko-cream'
    }`;

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: 'rgba(247,168,184,0.08)' }}>
        {DURATIONS.map(d => (
          <button
            key={d}
            onClick={() => onDurationChange(d)}
            className={pillClass(duration === d)}
            style={duration === d ? { background: '#f7a8b8', color: '#1a1a2e' } : { color: '#4a4e69' }}
          >
            {d}s
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {WORD_SETS.map((ws, i) => (
          <React.Fragment key={ws.value}>
            {i > 0 && <span style={{ color: '#4a4e69' }}>│</span>}
            <button
              onClick={() => onWordSetChange(ws.value)}
              className={`text-sm transition-colors duration-200 ${
                wordSet === ws.value ? 'font-semibold' : ''
              }`}
              style={{ color: wordSet === ws.value ? '#f7a8b8' : '#4a4e69' }}
            >
              {ws.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import type { TestResult } from '../types';
import { getResults } from '../utils/storage';

interface Props {
  onBack: () => void;
}

export const StatsPage: React.FC<Props> = ({ onBack }) => {
  const results = getResults().slice().reverse();
  const recentResults = results.slice(0, 10);

  const bestResult = results.reduce<TestResult | null>((best, r) =>
    !best || r.wpm > best.wpm ? r : best, null);

  const avgWpm = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length)
    : 0;

  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-slide-up w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--cream)' }}>your stats</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'best wpm', value: bestResult ? bestResult.wpm : '--', color: 'var(--accent)' },
          { label: 'avg wpm', value: avgWpm || '--', color: 'var(--correct)' },
          { label: 'tests', value: results.length, color: 'var(--cream)' },
          {
            label: 'time spent',
            value: totalTime >= 3600
              ? `${Math.round(totalTime / 3600)}h`
              : `${Math.round(totalTime / 60)}m`,
            color: 'var(--cream)',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: 'var(--surface)' }}>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>{label}</div>
            <div className="text-3xl font-bold font-mono" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Results Table */}
      {recentResults.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(128,128,128,0.15)' }}>
                {['date', 'wpm', 'accuracy', 'mode', 'time'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < recentResults.length - 1 ? '1px solid rgba(128,128,128,0.08)' : 'none' }}>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{formatDate(r.timestamp)}</td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>{r.wpm}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: 'var(--correct)' }}>{r.accuracy}%</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{r.wordSet}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted)' }}>{r.duration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
          <p className="text-lg mb-2">no tests yet!</p>
          <p className="text-sm">complete a typing test to see your stats here</p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import type { PlayerData, TestResult } from '../types';
import { GOALS } from '../utils/player';

interface Props {
  player: PlayerData;
  lastResult: TestResult | null;
  onBack: () => void;
}

export const Goals: React.FC<Props> = ({ player, lastResult, onBack }) => {
  const completed = player.completedGoals;

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>goals</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {completed.length}/{GOALS.length} completed · earn coins to unlock themes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--surface)' }}>
            <span style={{ fontSize: '18px' }}>🪙</span>
            <span className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{player.coins}</span>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-70"
            style={{ background: 'var(--surface)', color: 'var(--muted)' }}
          >
            ← back
          </button>
        </div>
      </div>

      {/* Progress overview */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{ background: 'var(--surface)' }}>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
            <span>overall progress</span>
            <span>{completed.length} / {GOALS.length}</span>
          </div>
          <div className="rounded-full overflow-hidden h-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(completed.length / GOALS.length) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>{player.totalXP}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>total XP</div>
        </div>
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 gap-3">
        {GOALS.map(goal => {
          const done = completed.includes(goal.id);
          const [cur, target] = lastResult
            ? goal.progress(lastResult, player)
            : [0, 1];
          const pct = Math.min(100, Math.round((cur / target) * 100));

          return (
            <div
              key={goal.id}
              className="rounded-xl p-4 flex items-center gap-4 transition-all"
              style={{
                background: 'var(--surface)',
                opacity: done ? 0.6 : 1,
                border: done ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: done ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.06)' }}
              >
                {done ? '✓' : goal.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: done ? 'var(--muted)' : 'var(--cream)' }}>
                    {goal.label}
                  </span>
                  {done && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--correct)', color: 'var(--bg)', opacity: 0.8 }}>done</span>}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{goal.description}</div>
                {!done && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
                      <span>{cur} / {target}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="font-bold font-mono text-sm" style={{ color: done ? 'var(--muted)' : 'var(--accent)' }}>
                  🪙 {goal.reward}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

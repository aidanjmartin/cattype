import React from 'react';

interface Props {
  wpm: number;
  accuracy: number;
}

export const LiveStats: React.FC<Props> = ({ wpm, accuracy }) => {
  return (
    <div className="flex items-center gap-8 text-sm" style={{ color: '#4a4e69' }}>
      <div className="flex items-center gap-2">
        <span>wpm</span>
        <span className="font-mono font-semibold" style={{ color: '#f7a8b8' }}>
          {wpm || '--'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span>accuracy</span>
        <span className="font-mono font-semibold" style={{ color: '#b8e0d2' }}>
          {wpm > 0 ? `${accuracy}%` : '--%'}
        </span>
      </div>
    </div>
  );
};

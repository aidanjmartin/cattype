import React from 'react';

interface Props {
  wpm: number;
  accuracy: number;
}

export const LiveStats: React.FC<Props> = ({ wpm, accuracy }) => {
  return (
    <div className="flex items-center gap-8 text-sm" style={{ color: '#7a4d63' }}>
      <div className="flex items-center gap-2">
        <span>wpm</span>
        <span className="font-mono font-semibold" style={{ color: '#f7a8c0' }}>
          {wpm || '--'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span>accuracy</span>
        <span className="font-mono font-semibold" style={{ color: '#98d4b8' }}>
          {wpm > 0 ? `${accuracy}%` : '--%'}
        </span>
      </div>
    </div>
  );
};

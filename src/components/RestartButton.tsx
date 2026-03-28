import React from 'react';

interface Props {
  onRestart: () => void;
}

export const RestartButton: React.FC<Props> = ({ onRestart }) => {
  return (
    <button
      onClick={onRestart}
      className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
      style={{ color: '#4a4e69' }}
      title="Restart test (Tab + Enter)"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
      </svg>
    </button>
  );
};

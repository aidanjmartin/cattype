import React from 'react';

interface Props {
  onFocus: () => void;
}

export const FocusOverlay: React.FC<Props> = ({ onFocus }) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer rounded-xl z-10 animate-fade-in"
      style={{ background: 'rgba(30, 16, 21, 0.88)', backdropFilter: 'blur(2px)' }}
      onClick={onFocus}
    >
      <svg width="40" height="40" viewBox="0 0 80 80" fill="none" className="mb-3 opacity-60">
        <circle cx="40" cy="38" r="22" fill="none" stroke="#f7a8c0" strokeWidth="1.5"/>
        <path d="M18 22 L12 8 L28 18 Z" fill="none" stroke="#f7a8c0" strokeWidth="1.5"/>
        <path d="M62 22 L68 8 L52 18 Z" fill="none" stroke="#f7a8c0" strokeWidth="1.5"/>
        <path d="M22 30 Q25 28 28 30" stroke="#f7a8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M32 30 Q35 28 38 30" stroke="#f7a8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
      <p className="text-sm font-medium" style={{ color: '#7a4d63' }}>
        Click here or press any key to focus
      </p>
    </div>
  );
};

import React from 'react';
import type { CatState } from '../types';

interface Props {
  state: CatState;
  animated: boolean;
}

export const CatMascot: React.FC<Props> = ({ state, animated }) => {
  const getExpression = () => {
    switch (state) {
      case 'idle':
        return (
          <g>
            {/* Closed eyes - lines */}
            <path d="M22 30 Q25 28 28 30" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M32 30 Q35 28 38 30" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Tiny smile */}
            <path d="M27 36 Q30 38 33 36" stroke="#f7a8b8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Z Z Z */}
            <text x="42" y="20" fontSize="8" fill="#4a4e69" fontFamily="Nunito">z</text>
            <text x="47" y="14" fontSize="10" fill="#4a4e69" fontFamily="Nunito">z</text>
            <text x="53" y="8" fontSize="12" fill="#4a4e69" fontFamily="Nunito">Z</text>
          </g>
        );
      case 'typing':
        return (
          <g>
            {/* Open eyes */}
            <circle cx="25" cy="30" r="4" fill="#f7a8b8"/>
            <circle cx="35" cy="30" r="4" fill="#f7a8b8"/>
            <circle cx="24" cy="29" r="2" fill="#1a1a2e"/>
            <circle cx="34" cy="29" r="2" fill="#1a1a2e"/>
            {/* Dot pupils */}
            <circle cx="23.5" cy="28.5" r="0.8" fill="white"/>
            <circle cx="33.5" cy="28.5" r="0.8" fill="white"/>
            {/* Focused mouth */}
            <path d="M28 36 Q30 37 32 36" stroke="#f7a8b8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </g>
        );
      case 'happy':
        return (
          <g>
            {/* Happy eyes - curved up */}
            <path d="M21 31 Q25 26 29 31" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M31 31 Q35 26 39 31" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Big smile */}
            <path d="M25 36 Q30 41 35 36" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </g>
        );
      case 'excited':
        return (
          <g>
            {/* Star eyes */}
            <text x="19" y="35" fontSize="12" fill="#f7a8b8">✦</text>
            <text x="31" y="35" fontSize="12" fill="#f7a8b8">✦</text>
            {/* Big happy smile */}
            <path d="M23 39 Q30 45 37 39" stroke="#f7a8b8" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Blush */}
            <ellipse cx="18" cy="38" rx="5" ry="3" fill="#f7a8b8" opacity="0.3"/>
            <ellipse cx="42" cy="38" rx="5" ry="3" fill="#f7a8b8" opacity="0.3"/>
          </g>
        );
      case 'mindblown':
        return (
          <g>
            {/* Spiral/star eyes */}
            <text x="17" y="36" fontSize="14" fill="#f7a8b8">★</text>
            <text x="31" y="36" fontSize="14" fill="#b8e0d2">★</text>
            {/* Open mouth in awe */}
            <ellipse cx="30" cy="41" rx="5" ry="4" fill="#f7a8b8" opacity="0.6"/>
            {/* Sparkles around head */}
            <text x="5" y="15" fontSize="8" fill="#f7a8b8">✧</text>
            <text x="52" y="15" fontSize="8" fill="#b8e0d2">✧</text>
            <text x="48" y="50" fontSize="8" fill="#f7a8b8">✧</text>
          </g>
        );
      case 'sleepy':
        return (
          <g>
            {/* Half-closed eyes */}
            <path d="M21 30 Q25 27 29 30" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <line x1="21" y1="30" x2="29" y2="30" stroke="#f7a8b8" strokeWidth="2" strokeLinecap="round"/>
            <path d="M31 30 Q35 27 39 30" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <line x1="31" y1="30" x2="39" y2="30" stroke="#f7a8b8" strokeWidth="2" strokeLinecap="round"/>
            {/* Unimpressed flat mouth */}
            <line x1="27" y1="37" x2="33" y2="37" stroke="#f7a8b8" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Single z */}
            <text x="44" y="20" fontSize="10" fill="#4a4e69" fontFamily="Nunito">z</text>
          </g>
        );
    }
  };

  const animClass = animated ? (
    state === 'idle' ? 'animate-breathe' :
    state === 'excited' || state === 'mindblown' ? 'animate-bounce-gentle' :
    state === 'typing' ? '' : 'animate-float'
  ) : '';

  return (
    <div className={`inline-block ${animClass}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="40" cy="65" rx="18" ry="12" fill="#16213e" stroke="#f7a8b8" strokeWidth="1.5"/>
        {/* Head */}
        <circle cx="40" cy="38" r="22" fill="#16213e" stroke="#f7a8b8" strokeWidth="1.5"/>
        {/* Left ear */}
        <path d="M18 22 L12 8 L28 18 Z" fill="#16213e" stroke="#f7a8b8" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Inner left ear */}
        <path d="M19 21 L15 11 L26 19 Z" fill="#f7a8b8" opacity="0.4"/>
        {/* Right ear */}
        <path d="M62 22 L68 8 L52 18 Z" fill="#16213e" stroke="#f7a8b8" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Inner right ear */}
        <path d="M61 21 L65 11 L54 19 Z" fill="#f7a8b8" opacity="0.4"/>
        {/* Whiskers left */}
        <line x1="5" y1="36" x2="20" y2="38" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        <line x1="5" y1="40" x2="20" y2="40" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        <line x1="5" y1="44" x2="20" y2="42" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        {/* Whiskers right */}
        <line x1="75" y1="36" x2="60" y2="38" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        <line x1="75" y1="40" x2="60" y2="40" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        <line x1="75" y1="44" x2="60" y2="42" stroke="#4a4e69" strokeWidth="1" strokeLinecap="round"/>
        {/* Nose */}
        <ellipse cx="30" cy="34" rx="1.5" ry="1" fill="#f7a8b8"/>
        {/* Expression */}
        {getExpression()}
        {/* Tail */}
        <path d="M55 70 Q70 60 72 72 Q74 80 65 78" stroke="#f7a8b8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

import React from 'react';
import type { CatState, CatSkin } from '../types';

interface Props {
  state: CatState;
  animated: boolean;
  size?: number;
  skin?: CatSkin;
}

// State → image:
// mistake happening   → CatShock (wide-eyed, shocked)
// no mistakes + great → CatExcited (happy, bouncy)
// otherwise          → CatContent (calm default)
function getImage(state: CatState): string {
  switch (state) {
    case 'mindblown': return '/CatShock.png';    // shocked = making mistakes
    case 'excited':   return '/CatExcited.png';  // excited = doing great, no mistakes
    case 'happy':     return '/CatExcited.png';
    default:          return '/CatContent.png';  // content = idle / normal typing
  }
}

function getAnimClass(state: CatState, animated: boolean): string {
  if (!animated) return '';
  switch (state) {
    case 'mindblown': return 'animate-wiggle';
    case 'excited':   return 'animate-bounce-gentle';
    case 'idle':      return 'animate-breathe';
    default:          return '';
  }
}

function getSkinFilter(skin: CatSkin = 'default'): string {
  const shadow = 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))';
  switch (skin) {
    case 'cosmic':  return `hue-rotate(200deg) saturate(1.4) ${shadow}`;
    case 'golden':  return `sepia(0.9) saturate(2.5) hue-rotate(10deg) brightness(1.1) ${shadow}`;
    case 'forest':  return `hue-rotate(110deg) saturate(1.3) ${shadow}`;
    case 'sunset':  return `hue-rotate(340deg) saturate(1.6) brightness(1.05) ${shadow}`;
    default:        return shadow;
  }
}

export const CatMascot: React.FC<Props> = ({ state, animated, size = 96, skin = 'default' }) => {
  return (
    <div className={`inline-block ${getAnimClass(state, animated)}`} style={{ lineHeight: 0 }}>
      <img
        src={getImage(state)}
        alt="cat"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          filter: getSkinFilter(skin),
        }}
        draggable={false}
      />
    </div>
  );
};

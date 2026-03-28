import React from 'react';

interface CaretPosition {
  top: number;
  left: number;
  height: number;
}

interface Props {
  position: CaretPosition;
  smooth: boolean;
  isActive: boolean;
}

export const Caret: React.FC<Props> = ({ position, smooth, isActive }) => {
  return (
    <div
      className={`absolute w-0.5 ${isActive ? 'animate-blink' : 'opacity-0'}`}
      style={{
        top: position.top,
        left: position.left,
        height: position.height,
        background: '#f7a8b8',
        transition: smooth ? 'top 0.08s ease, left 0.08s ease' : 'none',
        zIndex: 10,
        borderRadius: '1px',
        boxShadow: '0 0 6px #f7a8b8',
      }}
    />
  );
};

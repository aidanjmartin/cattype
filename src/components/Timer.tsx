import React from 'react';

interface Props {
  timeLeft: number;
  isRunning: boolean;
}

export const Timer: React.FC<Props> = ({ timeLeft, isRunning }) => {
  const isLow = timeLeft <= 10;

  return (
    <div
      className={`text-4xl font-bold font-mono transition-colors duration-300 ${
        isLow && isRunning ? 'animate-pulse' : ''
      }`}
      style={{ color: isLow && isRunning ? '#ff6b6b' : '#f7a8b8' }}
    >
      {timeLeft}
    </div>
  );
};

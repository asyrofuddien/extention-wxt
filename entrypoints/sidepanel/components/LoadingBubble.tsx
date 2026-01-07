import React from 'react';

interface LoadingBubbleProps {
  speed?: 'slow' | 'normal' | 'fast';
}

export const LoadingBubble: React.FC<LoadingBubbleProps> = ({ speed = 'normal' }) => {
  const speedMap = {
    slow: 'duration-700',
    normal: 'duration-500',
    fast: 'duration-300',
  };

  return (
    <div className="flex gap-2 p-3 bg-popover border border-border rounded-3xl rounded-bl-sm max-w-fit shadow-md">
      <div
        className={`w-3 h-3 bg-primary rounded-full animate-bounce ${speedMap[speed]}`}
        style={{ animationDelay: '0s' }}
      ></div>
      <div
        className={`w-3 h-3 bg-primary rounded-full animate-bounce ${speedMap[speed]}`}
        style={{ animationDelay: '0.15s' }}
      ></div>
      <div
        className={`w-3 h-3 bg-primary rounded-full animate-bounce ${speedMap[speed]}`}
        style={{ animationDelay: '0.3s' }}
      ></div>
    </div>
  );
};

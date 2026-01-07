import React from 'react';

interface LoadingBubbleProps {
  speed?: 'slow' | 'normal' | 'fast';
}

export const LoadingBubble: React.FC<LoadingBubbleProps> = ({ speed = 'normal' }) => {
  const speedMap = {
    slow: '700ms',
    normal: '500ms',
    fast: '300ms',
  };

  const dotStyle: React.CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#666',
    animation: `bounce ${speedMap[speed]} infinite ease-in-out`,
    display: 'inline-block',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '24px',
        borderBottomLeftRadius: '4px',
        maxWidth: 'fit-content',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-6px); opacity: 0.7; }
        }
      `}</style>
      <div style={{ ...dotStyle, animationDelay: '0s' }}></div>
      <div style={{ ...dotStyle, animationDelay: '0.15s' }}></div>
      <div style={{ ...dotStyle, animationDelay: '0.3s' }}></div>
    </div>
  );
};

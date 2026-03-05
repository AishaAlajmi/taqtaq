import React from 'react';

export const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: [
              "#f97316",
              "#22c55e",
              "#fbbf24",
              "#3b82f6",
              "#ec4899",
            ][i % 5],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

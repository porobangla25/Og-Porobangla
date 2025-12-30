'use client';

import React, { useState, useEffect } from 'react';

const StarlightBackground = () => {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 150 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
      }));
      setStars(newStars);
    };

    generateStars();
    
    // Add a listener to regenerate stars on resize for better responsiveness
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, []);

  return (
    <div className="starlight-bg fixed inset-0 -z-10 h-full w-full overflow-hidden">
      {stars.map((style, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-0 animate-pulse"
          style={style}
        />
      ))}
    </div>
  );
};

export default StarlightBackground;

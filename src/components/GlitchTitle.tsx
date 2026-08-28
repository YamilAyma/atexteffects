import React, { useState, useEffect } from 'react';

interface GlitchTitleProps {
  text?: string;
  className?: string;
}

export const GlitchTitle: React.FC<GlitchTitleProps> = ({
  text = 'atexteffects',
  className = '',
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(text);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const [flickerOpacity, setFlickerOpacity] = useState(1);

  useEffect(() => {
    // Periodic random noise glitch & flicker bursts
    const interval = setInterval(() => {
      // Trigger glitch burst
      setIsGlitching(true);
      const randomOffset = {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 3,
      };
      setGlitchOffset(randomOffset);
      setFlickerOpacity(0.7 + Math.random() * 0.3);

      // Chance to scramble a character slightly during burst
      if (Math.random() > 0.4) {
        const chars = text.split('');
        const scrambleIdx = Math.floor(Math.random() * chars.length);
        const noiseChars = '!/[]<>~*#@';
        chars[scrambleIdx] = noiseChars[Math.floor(Math.random() * noiseChars.length)];
        setGlitchText(chars.join(''));
      }

      // Restore after short burst
      setTimeout(() => {
        setIsGlitching(false);
        setGlitchText(text);
        setGlitchOffset({ x: 0, y: 0 });
        setFlickerOpacity(1);
      }, 120 + Math.random() * 180);
    }, 2800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [text]);

  const handleMouseEnter = () => {
    setIsGlitching(true);
    setFlickerOpacity(0.8);
    const chars = text.split('');
    const scrambleIdx = Math.floor(Math.random() * chars.length);
    chars[scrambleIdx] = '_';
    setGlitchText(chars.join(''));
    setTimeout(() => {
      setIsGlitching(false);
      setGlitchText(text);
      setFlickerOpacity(1);
    }, 250);
  };

  return (
    <div
      className={`relative inline-block select-none cursor-pointer group ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {/* Background Chromatic Aberration Left Ghost */}
      {isGlitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-white/40 pointer-events-none transition-none"
          style={{
            transform: `translate(${glitchOffset.x - 2}px, ${glitchOffset.y}px)`,
            clipPath: 'polygon(0 15%, 100% 15%, 100% 45%, 0 45%)',
            filter: 'blur(0.5px)',
          }}
        >
          {glitchText}
        </span>
      )}

      {/* Background Chromatic Aberration Right Ghost */}
      {isGlitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-white/30 pointer-events-none transition-none"
          style={{
            transform: `translate(${glitchOffset.x + 2}px, ${-glitchOffset.y}px)`,
            clipPath: 'polygon(0 55%, 100% 55%, 100% 85%, 0 85%)',
          }}
        >
          {glitchText}
        </span>
      )}

      {/* Primary Glitch Text */}
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-white transition-opacity"
        style={{
          opacity: flickerOpacity,
          transform: isGlitching
            ? `translate(${glitchOffset.x * 0.4}px, ${glitchOffset.y * 0.4}px)`
            : 'none',
        }}
      >
        {glitchText}
      </h2>

      {/* Scanline Noise overlay during glitch */}
      {isGlitching && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
          }}
        />
      )}
    </div>
  );
};

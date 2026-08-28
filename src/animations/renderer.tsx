import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Effect } from '../types';

interface RendererProps {
  effect: Effect;
  sampleText?: string;
  isModal?: boolean;
  replayKey?: number;
  isPlaying?: boolean;
}

const SCRAMBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>[]{}░▒▓';
const BINARY_CHARS = '01#_/-+*~';
const HEX_CHARS = '0123456789ABCDEF';

export const EffectRenderer: React.FC<RendererProps> = ({
  effect,
  sampleText,
  isModal = false,
  replayKey = 0,
  isPlaying = true,
}) => {
  const text = sampleText || effect.sampleText || 'atext';
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Animation frame ticker when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    let animationId: number;
    let start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      setFrame(elapsed);
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, replayKey]);

  // Handle pointer interactions for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos(null);
  };

  const fontSizeClass = isModal ? 'text-4xl md:text-5xl lg:text-6xl font-semibold' : 'text-2xl sm:text-3xl font-medium';

  // Render specific effect visuals
  const renderVisual = () => {
    const timeSec = frame / 1000;

    switch (effect.id) {
      // --- REVEAL CATEGORY ---
      case 'type-in': {
        const charDuration = 120;
        const totalChars = text.length;
        const cycleTime = (frame % (totalChars * charDuration + 1400));
        const visibleCount = Math.min(totalChars, Math.floor(cycleTime / charDuration) + 1);
        const visibleText = text.slice(0, visibleCount);
        return (
          <div className="relative inline-flex items-center tracking-tight">
            <span>{visibleText}</span>
            <span className="inline-block w-[2px] h-[1.1em] bg-white ml-0.5 animate-caret" />
          </div>
        );
      }

      case 'decode-scramble': {
        const cycle = frame % 2800;
        const chars = text.split('');
        const progress = Math.min(1, cycle / 1400);
        const lockedCount = Math.floor(progress * chars.length);

        const rendered = chars.map((targetChar, idx) => {
          if (idx < lockedCount || cycle > 1800) {
            return (
              <span key={idx} className="transition-colors duration-150 text-white font-mono">
                {targetChar}
              </span>
            );
          }
          const randomChar = SCRAMBLE_CHARS[Math.floor((frame / 50 + idx * 7) % SCRAMBLE_CHARS.length)];
          return (
            <span key={idx} className="text-[#888888] font-mono select-none">
              {randomChar}
            </span>
          );
        });

        return <div className="inline-flex tracking-wider">{rendered}</div>;
      }

      case 'mask-rise': {
        const chars = text.split('');
        return (
          <div className="inline-flex overflow-hidden py-2">
            {chars.map((char, i) => {
              const delay = i * 0.08;
              const t = ((timeSec % 2.4) - delay);
              const progress = Math.max(0, Math.min(1, t * 2.2));
              // easeOutCubic
              const ease = 1 - Math.pow(1 - progress, 3);
              const translateY = (1 - ease) * 120;
              const opacity = ease;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${translateY}%)`,
                    opacity,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'blur-focus': {
        const cycle = (timeSec % 2.5) / 1.5;
        const progress = Math.min(1, cycle);
        const blur = Math.max(0, (1 - progress) * 14);
        const scale = 1.15 - (0.15 * progress);
        const opacity = Math.min(1, progress * 1.5);
        return (
          <div
            className="tracking-tight"
            style={{
              filter: `blur(${blur}px)`,
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {text}
          </div>
        );
      }

      case 'cascade-drop': {
        const chars = text.split('');
        return (
          <div className="inline-flex py-2">
            {chars.map((char, i) => {
              const delay = i * 0.07;
              const t = (timeSec % 2.5) - delay;
              const progress = Math.max(0, Math.min(1, t * 2.5));
              // spring bounce
              const y = (1 - progress) * -35 + Math.sin(progress * Math.PI * 3) * (1 - progress) * 4;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${y}px)`,
                    opacity: Math.min(1, progress * 2),
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'clip-wipe': {
        const progress = (timeSec % 2.6) / 1.4;
        const pct = Math.min(100, progress * 100);
        return (
          <div className="relative inline-block">
            <span className="text-[#222222] select-none">{text}</span>
            <div
              className="absolute inset-0 text-white overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${pct}% 0, ${Math.max(0, pct - 15)}% 100%, 0 100%)`,
              }}
            >
              {text}
            </div>
            {pct < 100 && (
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white opacity-80"
                style={{
                  left: `${pct}%`,
                  transform: 'skewX(-15deg)',
                }}
              />
            )}
          </div>
        );
      }

      case 'rise-and-settle': {
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const delay = i * 0.06;
              const t = Math.max(0, Math.min(1, ((timeSec % 2.2) - delay) * 2.5));
              const ease = 1 - Math.pow(1 - t, 3);
              const y = (1 - ease) * 24;
              const rotate = (1 - ease) * 6;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${y}px) rotate(${rotate}deg)`,
                    opacity: ease,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'blind-fold': {
        const cycle = (timeSec % 2.5) / 1.6;
        const progress = Math.min(1, cycle);
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span className="text-white">{text}</span>
            <div
              className="absolute inset-0 bg-[#050505] pointer-events-none transition-all"
              style={{
                clipPath: `polygon(${Array.from({ length: 6 }).map((_, idx) => {
                  const yStart = idx * 16.66;
                  const slatHeight = 16.66 * (1 - progress);
                  return `0% ${yStart}%, 100% ${yStart}%, 100% ${yStart + slatHeight}%, 0% ${yStart + slatHeight}%`;
                }).join(', ')})`,
              }}
            />
          </div>
        );
      }

      case 'pixel-assemble': {
        const cycle = (timeSec % 2.8) / 1.8;
        const progress = Math.min(1, cycle);
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const charDelay = i * 0.08;
              const charProgress = Math.max(0, Math.min(1, (cycle - charDelay) * 1.8));
              const blur = (1 - charProgress) * 10;
              const opacity = Math.min(1, charProgress * 1.4);
              const scale = 0.6 + charProgress * 0.4;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    filter: `blur(${blur}px)`,
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'stadium-expand': {
        const cycle = (timeSec % 2.6) / 1.6;
        const progress = Math.min(1, cycle);
        const ease = 1 - Math.pow(1 - progress, 3);
        const widthPct = ease * 100;
        return (
          <div className="relative inline-block overflow-hidden py-1 px-3">
            <div
              className="overflow-hidden mx-auto transition-all"
              style={{
                maxWidth: `${widthPct}%`,
                opacity: Math.min(1, progress * 2),
              }}
            >
              <span className="whitespace-nowrap text-white font-bold">{text}</span>
            </div>
          </div>
        );
      }

      case 'curtain-split': {
        const cycle = (timeSec % 2.5) / 1.6;
        const progress = Math.min(1, cycle);
        const ease = 1 - Math.pow(1 - progress, 4);
        const splitPct = (1 - ease) * 50;
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span className="text-white">{text}</span>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${50 - splitPct}% 0, ${50 - splitPct}% 100%, 0 100%, 100% 0, ${50 + splitPct}% 0, ${50 + splitPct}% 100%, 100% 100%)`,
                backgroundColor: '#050505',
              }}
            />
          </div>
        );
      }

      // --- GLITCH CATEGORY ---
      case 'glitch-slice': {
        const isGlitching = (frame % 2200) < 350;
        const shiftX1 = isGlitching ? Math.sin(frame * 0.05) * 6 : 0;
        const shiftX2 = isGlitching ? Math.cos(frame * 0.07) * -5 : 0;
        return (
          <div className="relative inline-block select-none tracking-tight">
            <span className="text-white relative z-10">{text}</span>
            {isGlitching && (
              <>
                <div
                  className="absolute inset-0 text-white select-none z-20 pointer-events-none opacity-90"
                  style={{
                    clipPath: 'inset(25% 0 45% 0)',
                    transform: `translateX(${shiftX1}px)`,
                  }}
                >
                  {text}
                </div>
                <div
                  className="absolute inset-0 text-white select-none z-20 pointer-events-none opacity-90"
                  style={{
                    clipPath: 'inset(60% 0 10% 0)',
                    transform: `translateX(${shiftX2}px)`,
                  }}
                >
                  {text}
                </div>
                <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
              </>
            )}
          </div>
        );
      }

      case 'luma-split': {
        const isBurst = (frame % 2000) < 250;
        const offset = isBurst ? Math.sin(frame * 0.08) * 4 : 0;
        return (
          <div className="relative inline-block">
            <span
              className="text-[#999999] absolute inset-0 select-none mix-blend-screen"
              style={{ transform: `translateX(${-offset}px)` }}
            >
              {text}
            </span>
            <span
              className="text-[#E5E5E5] absolute inset-0 select-none mix-blend-screen"
              style={{ transform: `translateX(${offset}px)` }}
            >
              {text}
            </span>
            <span className="text-white relative z-10 opacity-90">{text}</span>
          </div>
        );
      }

      case 'signal-jitter': {
        const jitterX = Math.sin(frame * 0.12) * (Math.random() > 0.6 ? 2.5 : 0);
        const jitterY = Math.cos(frame * 0.14) * (Math.random() > 0.7 ? 1.5 : 0);
        return (
          <div
            className="inline-block tracking-tight transition-transform duration-75"
            style={{ transform: `translate(${jitterX}px, ${jitterY}px)` }}
          >
            {text}
          </div>
        );
      }

      case 'data-corrupt': {
        const isCorrupted = (frame % 1800) < 300;
        const chars = text.split('').map((c, i) => {
          if (isCorrupted && i % 2 === 1) {
            return '█';
          }
          return c;
        });
        return <div className="inline-block font-mono tracking-wider">{chars.join('')}</div>;
      }

      case 'scanline-shift': {
        const scanlineY = ((frame % 2400) / 2400) * 100;
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span className="text-white">{text}</span>
            <div
              className="absolute left-0 right-0 h-2 bg-white/25 pointer-events-none blur-[1px]"
              style={{ top: `${scanlineY}%` }}
            />
            <div
              className="absolute inset-0 text-white opacity-80 pointer-events-none"
              style={{
                clipPath: `inset(${Math.max(0, scanlineY - 4)}% 0 ${Math.max(0, 100 - scanlineY - 8)}% 0)`,
                transform: 'translateX(3px)',
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'bit-shuffle': {
        const cycle = frame % 2600;
        const progress = Math.min(1, cycle / 1200);
        const chars = text.split('').map((c, i) => {
          if (cycle < 1200 && i > progress * text.length) {
            return BINARY_CHARS[(Math.floor(frame / 60) + i) % BINARY_CHARS.length];
          }
          return c;
        });
        return <div className="inline-block font-mono tracking-wider">{chars.join('')}</div>;
      }

      case 'noise-flicker': {
        const opacity = (frame % 2200 < 400) ? 0.3 + Math.random() * 0.7 : 1;
        return (
          <div className="inline-block tracking-tight" style={{ opacity }}>
            {text}
          </div>
        );
      }

      case 'vhs-tracking': {
        const isTracking = (frame % 2400) < 600;
        const barY = ((frame * 0.15) % 100);
        const skewX = isTracking ? Math.sin(frame * 0.1) * 12 : 0;
        return (
          <div className="relative inline-block select-none">
            <span
              className="text-white inline-block"
              style={{
                transform: `skewX(${skewX}deg)`,
                filter: isTracking ? 'contrast(1.4) brightness(1.2)' : 'none',
              }}
            >
              {text}
            </span>
            {isTracking && (
              <div
                className="absolute inset-x-0 h-2 bg-white/40 mix-blend-screen pointer-events-none"
                style={{ top: `${barY}%` }}
              />
            )}
          </div>
        );
      }

      case 'quantum-ghost': {
        const jitter = Math.sin(timeSec * 8) * 4;
        return (
          <div className="relative inline-block font-mono">
            <span
              className="absolute inset-0 text-white/30 pointer-events-none select-none"
              style={{ transform: `translate(${-jitter}px, ${jitter * 0.5}px)` }}
            >
              {text}
            </span>
            <span
              className="absolute inset-0 text-white/30 pointer-events-none select-none"
              style={{ transform: `translate(${jitter}px, ${-jitter * 0.5}px)` }}
            >
              {text}
            </span>
            <span className="relative z-10 text-white">{text}</span>
          </div>
        );
      }

      case 'ascii-matrix': {
        const chars = text.split('');
        return (
          <div className="inline-flex font-mono">
            {chars.map((c, i) => {
              const isMatrix = (frame + i * 200) % 1200 < 400;
              const matrixChar = SCRAMBLE_CHARS[(Math.floor(frame / 60) + i) % SCRAMBLE_CHARS.length];
              return (
                <span
                  key={i}
                  className={`inline-block ${isMatrix ? 'text-[#888888]' : 'text-white'}`}
                >
                  {isMatrix ? matrixChar : c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'bad-sector': {
        const isCorrupt = (frame % 1800) < 300;
        const chars = text.split('').map((c, i) => {
          if (isCorrupt && (i === 1 || i === 3)) {
            return HEX_CHARS[(Math.floor(frame / 40) + i) % HEX_CHARS.length];
          }
          return c;
        });
        return (
          <div className="inline-block font-mono tracking-wide">
            <span className={isCorrupt ? 'text-[#F5F5F5] bg-white/20 px-0.5' : 'text-white'}>
              {chars.join('')}
            </span>
          </div>
        );
      }

      // --- KINETIC CATEGORY ---
      case 'marquee-loop': {
        const marqueeText = `${text} • ${text} • ${text} • `;
        const offset = -((frame * 0.06) % 180);
        return (
          <div className="overflow-hidden whitespace-nowrap w-full text-center">
            <div
              className="inline-block tracking-widest uppercase font-mono text-sm sm:text-base opacity-90"
              style={{ transform: `translateX(${offset}px)` }}
            >
              {marqueeText}
            </div>
          </div>
        );
      }

      case 'orbit-spin': {
        const angle = (frame * 0.08) % 360;
        return (
          <div
            className="inline-block"
            style={{
              perspective: '600px',
            }}
          >
            <div
              style={{
                transform: `rotateY(${angle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'pendulum-swing': {
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const angle = Math.sin(timeSec * 2.8 + i * 0.3) * 16;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transformOrigin: 'top center',
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'drift-float': {
        const y = Math.sin(timeSec * 1.8) * 6;
        const x = Math.cos(timeSec * 1.2) * 3;
        const tilt = Math.sin(timeSec * 1.4) * 2;
        return (
          <div
            className="inline-block"
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${tilt}deg)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'bounce-settle': {
        const t = (timeSec % 2.5);
        const y = Math.abs(Math.sin(t * 3.5)) * -14 * Math.max(0, 1 - t / 1.8);
        const scaleX = 1 + (y < -0.5 ? -0.05 : 0.12 * Math.max(0, 1 - t / 1.5));
        const scaleY = 1 + (y < -0.5 ? 0.08 : -0.12 * Math.max(0, 1 - t / 1.5));
        return (
          <div
            className="inline-block"
            style={{
              transform: `translateY(${y}px) scale(${scaleX}, ${scaleY})`,
              transformOrigin: 'bottom center',
            }}
          >
            {text}
          </div>
        );
      }

      case 'roll-cycle': {
        const cycle = timeSec % 2.6;
        const chars = text.split('');
        return (
          <div className="inline-flex" style={{ perspective: '500px' }}>
            {chars.map((c, i) => {
              const delay = i * 0.08;
              const t = Math.max(0, Math.min(1, (cycle - delay) * 2.2));
              const rotX = (1 - t) * 90;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `rotateX(${rotX}deg)`,
                    opacity: t,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'word-carousel': {
        const words = ['atext', 'kinetic', 'prompt', 'motion'];
        const wordIndex = Math.floor(timeSec / 1.8) % words.length;
        const subTime = (timeSec % 1.8);
        const y = subTime < 0.35 ? (1 - subTime / 0.35) * 30 : 0;
        const opacity = subTime < 0.35 ? subTime / 0.35 : 1;
        return (
          <div className="inline-block overflow-hidden py-1">
            <span
              className="inline-block"
              style={{
                transform: `translateY(${y}px)`,
                opacity,
              }}
            >
              {words[wordIndex]}
            </span>
          </div>
        );
      }

      case 'gravity-well': {
        const angle = (timeSec * 2.2) % (Math.PI * 2);
        const chars = text.split('');
        return (
          <div className="inline-flex items-center justify-center">
            {chars.map((char, i) => {
              const charAngle = angle + (i * 0.4);
              const r = 8 + Math.sin(timeSec * 3 + i) * 6;
              const x = Math.cos(charAngle) * r;
              const y = Math.sin(charAngle) * r;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'elastic-chords': {
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const phase = timeSec * 3.5 + i * 0.5;
              const bounce = Math.abs(Math.sin(phase)) * -14;
              const scaleY = 1 + Math.sin(phase) * 0.2;
              return (
                <span
                  key={i}
                  className="inline-block origin-bottom"
                  style={{
                    transform: `translateY(${bounce}px) scaleY(${scaleY})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'helix-spiral': {
        const chars = text.split('');
        return (
          <div className="inline-flex" style={{ perspective: '400px' }}>
            {chars.map((char, i) => {
              const rotY = (timeSec * 120 + i * 35) % 360;
              const scale = 0.8 + Math.cos((rotY * Math.PI) / 180) * 0.25;
              const opacity = 0.5 + Math.cos((rotY * Math.PI) / 180) * 0.5;
              return (
                <span
                  key={i}
                  className="inline-block font-bold"
                  style={{
                    transform: `rotateY(${rotY}deg) scale(${scale})`,
                    opacity,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'treadmill-step': {
        const chars = text.split('');
        const step = Math.floor(timeSec * 3) % chars.length;
        return (
          <div className="inline-flex gap-0.5">
            {chars.map((char, i) => {
              const isStep = i === step;
              const y = isStep ? -8 : 0;
              const scale = isStep ? 1.2 : 1.0;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-150 font-mono"
                  style={{
                    transform: `translateY(${y}px) scale(${scale})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      // --- INTERACTIVE CATEGORY ---
      case 'letter-lift': {
        const chars = text.split('');
        return (
          <div className="inline-flex gap-0.5">
            {chars.map((char, i) => {
              const isHoverChar = isHovered && mousePos ? Math.abs((i / chars.length) - (mousePos.x / (containerRef.current?.offsetWidth || 1))) < 0.2 : false;
              const y = isHoverChar ? -10 : Math.sin(timeSec * 2 + i * 0.5) * -3;
              const scale = isHoverChar ? 1.15 : 1;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-200"
                  style={{
                    transform: `translateY(${y}px) scale(${scale})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'magnetic-pull': {
        const pullX = isHovered && mousePos ? (mousePos.x - (containerRef.current?.offsetWidth || 0) / 2) * 0.15 : Math.sin(timeSec * 2) * 4;
        const pullY = isHovered && mousePos ? (mousePos.y - (containerRef.current?.offsetHeight || 0) / 2) * 0.15 : Math.cos(timeSec * 1.5) * 3;
        return (
          <div
            className="inline-block transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${pullX}px, ${pullY}px)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'tilt-depth': {
        const rotX = isHovered && mousePos ? -(mousePos.y - (containerRef.current?.offsetHeight || 0) / 2) * 0.2 : Math.sin(timeSec * 1.5) * 8;
        const rotY = isHovered && mousePos ? (mousePos.x - (containerRef.current?.offsetWidth || 0) / 2) * 0.2 : Math.cos(timeSec * 1.5) * 8;
        return (
          <div style={{ perspective: '600px' }}>
            <div
              className="inline-block transition-transform duration-150"
              style={{
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                textShadow: `${-rotY}px ${rotX}px 12px rgba(255,255,255,0.25)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'spotlight-track': {
        const spotX = mousePos ? mousePos.x : (Math.sin(timeSec * 1.5) * 0.4 + 0.5) * (containerRef.current?.offsetWidth || 200);
        return (
          <div className="relative inline-block">
            <span className="text-[#333333] select-none">{text}</span>
            <div
              className="absolute inset-0 text-white pointer-events-none"
              style={{
                maskImage: `radial-gradient(circle 50px at ${spotX}px 50%, black 0%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 50px at ${spotX}px 50%, black 0%, transparent 100%)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'brush-reveal': {
        const pct = ((timeSec * 40) % 100);
        return (
          <div className="relative inline-block">
            <span className="text-white">{text}</span>
            <div
              className="absolute inset-0 bg-[#0c0c0c] transition-all duration-300 pointer-events-none"
              style={{
                clipPath: `polygon(${pct}% 0, 100% 0, 100% 100%, ${Math.max(0, pct - 20)}% 100%)`,
              }}
            />
          </div>
        );
      }

      case 'underline-sweep': {
        const isAct = isHovered || (frame % 2400) < 1400;
        return (
          <div className="relative inline-block group pb-1">
            <span>{text}</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-300 origin-center"
              style={{
                transform: isAct ? 'scaleX(1)' : 'scaleX(0)',
              }}
            />
          </div>
        );
      }

      case 'scatter-on-hover': {
        const isScatter = isHovered || (frame % 2800) < 1000;
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const angle = (i - chars.length / 2) * 15;
              const shiftX = isScatter ? Math.sin(i * 3) * 14 : 0;
              const shiftY = isScatter ? Math.cos(i * 2) * -12 : 0;
              const rot = isScatter ? angle : 0;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-300"
                  style={{
                    transform: `translate(${shiftX}px, ${shiftY}px) rotate(${rot}deg)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'lens-magnifier': {
        const chars = text.split('');
        return (
          <div className="inline-flex gap-0.5">
            {chars.map((char, i) => {
              const isLens = isHovered && mousePos
                ? Math.abs((i / chars.length) - (mousePos.x / (containerRef.current?.offsetWidth || 1))) < 0.25
                : (Math.floor(timeSec * 2) % chars.length === i);
              const scale = isLens ? 1.45 : 1.0;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-150 font-bold"
                  style={{
                    transform: `scale(${scale})`,
                    textShadow: isLens ? '0 0 12px rgba(255,255,255,0.8)' : 'none',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'gravity-repel': {
        const chars = text.split('');
        return (
          <div className="inline-flex gap-0.5">
            {chars.map((char, i) => {
              const normX = i / (chars.length - 1 || 1);
              const mouseNormX = mousePos ? mousePos.x / (containerRef.current?.offsetWidth || 1) : 0.5;
              const dist = normX - mouseNormX;
              const repelX = isHovered ? Math.sign(dist) * Math.max(0, 1 - Math.abs(dist * 2)) * 18 : 0;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-150"
                  style={{
                    transform: `translateX(${repelX}px)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'elastic-drag': {
        const chars = text.split('');
        const dragLead = isHovered && mousePos ? (mousePos.x - (containerRef.current?.offsetWidth || 0) / 2) * 0.12 : Math.sin(timeSec * 2) * 6;
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const lag = dragLead * (1 - i * 0.15);
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-100"
                  style={{
                    transform: `translateX(${lag}px)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'flashlight-beam': {
        const beamX = isHovered && mousePos ? mousePos.x : (Math.sin(timeSec * 2) * 40 + 50) * ((containerRef.current?.offsetWidth || 200) / 100);
        return (
          <div className="relative inline-block">
            <span className="text-[#333333] font-bold select-none">{text}</span>
            <div
              className="absolute inset-0 text-white font-bold pointer-events-none"
              style={{
                maskImage: `radial-gradient(circle 50px at ${beamX}px 50%, black 30%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 50px at ${beamX}px 50%, black 30%, transparent 100%)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      // --- DISTORTION CATEGORY ---
      case 'sine-wave': {
        const chars = text.split('');
        return (
          <div className="inline-flex items-center">
            {chars.map((c, i) => {
              const y = Math.sin(timeSec * 3.5 + i * 0.6) * 8;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${y}px)`,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'flag-ripple': {
        const chars = text.split('');
        return (
          <div className="inline-flex items-center">
            {chars.map((c, i) => {
              const skew = Math.sin(timeSec * 3 + i * 0.5) * 8;
              const y = Math.cos(timeSec * 3 + i * 0.5) * 5;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${y}px) skewY(${skew}deg)`,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'liquid-melt': {
        const stretchY = 1 + Math.max(0, Math.sin(timeSec * 2)) * 0.4;
        const translateY = Math.max(0, Math.sin(timeSec * 2)) * 8;
        return (
          <div
            className="inline-block origin-top tracking-tight"
            style={{
              transform: `translateY(${translateY}px) scaleY(${stretchY})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'skew-shake': {
        const skew = Math.sin(timeSec * 6) * 16;
        return (
          <div
            className="inline-block"
            style={{
              transform: `skewX(${skew}deg)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'stretch-pulse': {
        const tracking = Math.sin(timeSec * 2.5) * 0.15 + 0.08;
        const scaleX = 1 + Math.cos(timeSec * 2.5) * 0.1;
        return (
          <div
            className="inline-block"
            style={{
              letterSpacing: `${tracking}em`,
              transform: `scaleX(${scaleX})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'vortex-warp': {
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((c, i) => {
              const distFromCenter = Math.abs(i - (chars.length - 1) / 2);
              const angle = Math.sin(timeSec * 2.5) * distFromCenter * 14;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `rotate(${angle}deg) scale(${1 - distFromCenter * 0.05})`,
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'zigzag-run': {
        const chars = text.split('');
        const step = Math.floor(timeSec * 2) % 2;
        return (
          <div className="inline-flex">
            {chars.map((c, i) => {
              const y = (i % 2 === step ? -6 : 6);
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-200"
                  style={{ transform: `translateY(${y}px)` }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'kaleidoscope-mirror': {
        const rot = (timeSec * 30) % 360;
        return (
          <div className="relative inline-flex items-center justify-center p-4">
            <div
              className="inline-block font-mono text-sm tracking-widest text-white/90"
              style={{ transform: `rotate(${rot}deg)` }}
            >
              {text}
            </div>
            <div
              className="absolute inline-block font-mono text-sm tracking-widest text-white/60 pointer-events-none"
              style={{ transform: `rotate(${-rot}deg) scaleX(-1)` }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'black-hole-pull': {
        const chars = text.split('');
        return (
          <div className="inline-flex items-center">
            {chars.map((char, i) => {
              const centerDist = Math.abs(i - (chars.length - 1) / 2);
              const pullScale = 1 - Math.sin(timeSec * 2) * centerDist * 0.12;
              const skewY = Math.sin(timeSec * 2 + centerDist) * (i < chars.length / 2 ? -8 : 8);
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `scale(${Math.max(0.6, pullScale)}) skewY(${skewY}deg)`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      case 'origami-fold': {
        const fold = Math.sin(timeSec * 2.2) * 40;
        return (
          <div style={{ perspective: '500px' }}>
            <div
              className="inline-block font-bold"
              style={{
                transform: `rotateX(${fold}deg) rotateY(${fold * 0.5}deg)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'sonar-pulse': {
        const pulse = (timeSec * 3) % (text.length + 2);
        const chars = text.split('');
        return (
          <div className="inline-flex">
            {chars.map((char, i) => {
              const dist = Math.abs(i - pulse);
              const scaleY = dist < 1.5 ? 1.4 - dist * 0.25 : 1.0;
              return (
                <span
                  key={i}
                  className="inline-block origin-center font-bold"
                  style={{
                    transform: `scaleY(${scaleY})`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      }

      // --- LIGHT CATEGORY ---
      case 'shimmer-sweep': {
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span className="text-[#888888]">{text}</span>
            <div className="absolute inset-0 shimmer-mask mix-blend-overlay pointer-events-none" />
            <span className="absolute inset-0 text-white shimmer-mask bg-clip-text text-transparent">
              {text}
            </span>
          </div>
        );
      }

      case 'shine-pass': {
        const pos = ((frame * 0.08) % 300) - 100;
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span
              className="bg-clip-text text-transparent font-semibold"
              style={{
                backgroundImage: `linear-gradient(110deg, #777 30%, #fff ${pos}%, #777 ${pos + 30}%)`,
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'glow-breathe': {
        const glowOpacity = Math.sin(timeSec * 2) * 0.4 + 0.6;
        return (
          <div
            className="inline-block text-white"
            style={{
              textShadow: `0 0 10px rgba(255,255,255,${glowOpacity}), 0 0 24px rgba(255,255,255,${glowOpacity * 0.6})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'light-leak': {
        const posX = Math.sin(timeSec * 1.2) * 40 + 50;
        return (
          <div className="relative inline-block">
            <span className="text-[#888888]">{text}</span>
            <div
              className="absolute inset-0 text-white pointer-events-none"
              style={{
                maskImage: `radial-gradient(circle 60px at ${posX}% 50%, black, transparent)`,
                WebkitMaskImage: `radial-gradient(circle 60px at ${posX}% 50%, black, transparent)`,
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'mono-gradient-flow': {
        const gradPos = (frame * 0.05) % 200;
        return (
          <div
            className="inline-block bg-clip-text text-transparent font-semibold"
            style={{
              backgroundImage: 'linear-gradient(90deg, #444, #fff, #444, #fff)',
              backgroundSize: '200% 100%',
              backgroundPosition: `${gradPos}% 0`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'candle-flicker': {
        const flick = 0.85 + Math.sin(frame * 0.2) * 0.1 + (Math.random() > 0.8 ? -0.15 : 0.05);
        return (
          <div
            className="inline-block text-white"
            style={{
              opacity: flick,
              textShadow: `0 0 ${flick * 8}px rgba(255,255,255,0.6)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'neon-hum': {
        const isFlicker = (frame % 3000) < 180;
        const opacity = isFlicker ? (Math.random() > 0.5 ? 0.3 : 0.9) : 1;
        return (
          <div
            className="inline-block text-white tracking-wide"
            style={{
              opacity,
              textShadow: isFlicker ? 'none' : '0 0 4px #fff, 0 0 12px rgba(255,255,255,0.8), 0 0 28px rgba(255,255,255,0.4)',
            }}
          >
            {text}
          </div>
        );
      }

      case 'aurora-drift': {
        const drift = Math.sin(timeSec * 1.5) * 20;
        return (
          <div className="relative inline-block py-1">
            <span
              className="absolute inset-0 text-white/40 blur-[6px] pointer-events-none select-none"
              style={{ transform: `translateY(${drift * 0.3}px) skewX(${drift}deg)` }}
            >
              {text}
            </span>
            <span className="relative z-10 text-white font-bold">{text}</span>
          </div>
        );
      }

      case 'photon-flare': {
        const flarePos = ((frame * 0.1) % 120) - 10;
        return (
          <div className="relative inline-block overflow-hidden py-1">
            <span className="text-[#888888] font-bold">{text}</span>
            <span
              className="absolute inset-0 text-white font-bold"
              style={{
                maskImage: `radial-gradient(circle 25px at ${flarePos}% 50%, black, transparent)`,
                WebkitMaskImage: `radial-gradient(circle 25px at ${flarePos}% 50%, black, transparent)`,
                filter: 'drop-shadow(0 0 8px #FFF)',
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'bioluminescent-hum': {
        const pulse = Math.sin(timeSec * 2) * 0.4 + 0.6;
        return (
          <div
            className="inline-block font-bold text-white"
            style={{
              textShadow: `0 0 ${pulse * 14}px rgba(255,255,255,${pulse})`,
              filter: `drop-shadow(0 0 ${pulse * 6}px #FFFFFF)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'solar-corona': {
        const burst = Math.sin(timeSec * 3) * 6 + 10;
        return (
          <div
            className="inline-block font-black text-black bg-[#050505] px-2 py-1"
            style={{
              boxShadow: `0 0 ${burst}px rgba(255,255,255,0.7), inset 0 0 4px rgba(255,255,255,0.8)`,
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            <span className="text-white">{text}</span>
          </div>
        );
      }

      // --- STROKE CATEGORY ---
      case 'draw-stroke': {
        const progress = Math.min(1, (timeSec % 3.0) / 1.8);
        return (
          <div className="relative inline-block">
            <span
              className="text-transparent font-bold select-none"
              style={{
                WebkitTextStroke: '1.5px white',
                opacity: progress > 0.8 ? (progress - 0.8) / 0.2 : 1,
              }}
            >
              {text}
            </span>
            <div
              className="absolute inset-0 text-white font-bold transition-opacity duration-300"
              style={{
                opacity: progress > 0.7 ? (progress - 0.7) / 0.3 : 0,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'fill-sweep': {
        const pct = Math.sin(timeSec * 2.2) * 50 + 50;
        return (
          <div className="relative inline-block">
            <span
              className="text-transparent font-bold select-none"
              style={{ WebkitTextStroke: '1.5px white' }}
            >
              {text}
            </span>
            <div
              className="absolute inset-0 text-white font-bold overflow-hidden"
              style={{
                clipPath: `inset(${100 - pct}% 0 0 0)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'dashed-march': {
        return (
          <div className="relative inline-block font-bold tracking-wider">
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '1.5px white',
                filter: 'drop-shadow(0 0 1px white)',
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'outline-pop': {
        const isHollow = (frame % 1600) < 800;
        return (
          <div
            className="inline-block font-bold transition-all duration-100"
            style={{
              color: isHollow ? 'transparent' : 'white',
              WebkitTextStroke: isHollow ? '1.5px white' : 'none',
            }}
          >
            {text}
          </div>
        );
      }

      case 'double-contour': {
        const expand = (frame % 1800) / 1800 * 8;
        const opacity = 1 - (expand / 8);
        return (
          <div className="relative inline-block font-bold">
            <span className="text-white relative z-10">{text}</span>
            <span
              className="absolute inset-0 text-transparent select-none z-0"
              style={{
                WebkitTextStroke: '1px white',
                transform: `scale(${1 + expand * 0.04})`,
                opacity,
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'trace-on': {
        const pos = ((frame * 0.08) % 100);
        return (
          <div className="relative inline-block font-bold">
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)' }}
            >
              {text}
            </span>
            <div
              className="absolute top-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"
              style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        );
      }

      case 'hollow-drift': {
        const driftX = Math.sin(timeSec * 2) * 5;
        const driftY = Math.cos(timeSec * 2) * 4;
        return (
          <div className="relative inline-block font-bold">
            <span className="text-white">{text}</span>
            <span
              className="absolute inset-0 text-transparent select-none pointer-events-none"
              style={{
                WebkitTextStroke: '1.5px white',
                transform: `translate(${driftX}px, ${driftY}px)`,
                opacity: 0.7,
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'blueprint-sketch': {
        return (
          <div className="relative inline-block font-mono tracking-widest px-2 py-1 border border-white/20">
            <span className="text-white font-bold" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
              {text}
            </span>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
          </div>
        );
      }

      case 'laser-cut-path': {
        const pos = ((frame * 0.1) % 100);
        return (
          <div className="relative inline-block font-bold">
            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>
              {text}
            </span>
            <div
              className="absolute top-1/2 w-3 h-3 -translate-y-1/2 bg-white rounded-full shadow-[0_0_12px_#fff]"
              style={{ left: `${pos}%` }}
            />
          </div>
        );
      }

      case 'ribbon-thread': {
        const dashOffset = (frame * 0.05) % 100;
        return (
          <div className="inline-block font-bold tracking-wider">
            <span
              className="text-white"
              style={{
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
                textDecorationThickness: '2px',
                filter: `drop-shadow(${Math.sin(dashOffset) * 2}px 0 2px #fff)`,
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'crosshatch-fill': {
        return (
          <div className="relative inline-block font-black tracking-wide">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 4px)',
                WebkitTextStroke: '0.8px white',
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      // --- DEPTH CATEGORY ---
      case 'shadow-stack': {
        const depth = Math.sin(timeSec * 2.2) * 6 + 6;
        const shadows = Array.from({ length: 6 })
          .map((_, i) => `${(i + 1) * (depth / 6)}px ${(i + 1) * (depth / 6)}px 0px rgba(255,255,255,${0.15 - i * 0.02})`)
          .join(', ');
        return (
          <div
            className="inline-block text-white font-bold"
            style={{
              textShadow: shadows,
            }}
          >
            {text}
          </div>
        );
      }

      case 'extrude-push': {
        const z = Math.sin(timeSec * 2) * 20;
        return (
          <div style={{ perspective: '500px' }}>
            <div
              className="inline-block font-bold text-white"
              style={{
                transform: `translateZ(${z}px)`,
                textShadow: '0 4px 12px rgba(255,255,255,0.3)',
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'long-shadow-swing': {
        const angle = Math.sin(timeSec * 1.8) * 45 + 45;
        const rad = (angle * Math.PI) / 180;
        const sx = Math.cos(rad) * 16;
        const sy = Math.sin(rad) * 16;
        return (
          <div
            className="inline-block font-bold text-white"
            style={{
              textShadow: `${sx}px ${sy}px 0px rgba(255,255,255,0.15), ${sx * 1.5}px ${sy * 1.5}px 0px rgba(255,255,255,0.08)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'depth-pop': {
        const isPop = (frame % 2200) < 500;
        const scale = isPop ? 1.14 : 1;
        const shadow = isPop ? '0 12px 24px rgba(255,255,255,0.35)' : '0 2px 4px rgba(255,255,255,0.1)';
        return (
          <div
            className="inline-block font-bold text-white transition-all duration-150"
            style={{
              transform: `scale(${scale})`,
              textShadow: shadow,
            }}
          >
            {text}
          </div>
        );
      }

      case 'shadow-lag': {
        const driftX = Math.sin(timeSec * 2.5) * 8;
        const lagX = Math.sin((timeSec - 0.15) * 2.5) * 8;
        return (
          <div className="relative inline-block font-bold">
            <span
              className="absolute inset-0 text-white/30 select-none pointer-events-none blur-[1px]"
              style={{
                transform: `translate(${lagX + 6}px, 6px)`,
              }}
            >
              {text}
            </span>
            <span
              className="relative z-10 text-white"
              style={{
                transform: `translateX(${driftX}px)`,
              }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'emboss-press': {
        const isPressed = (frame % 2400) < 1200;
        const shadow = isPressed
          ? '-1px -1px 0px #000, 1px 1px 0px rgba(255,255,255,0.6)'
          : '1px 1px 0px #000, -1px -1px 0px rgba(255,255,255,0.6)';
        return (
          <div
            className="inline-block font-bold text-[#888888] transition-all duration-300"
            style={{ textShadow: shadow }}
          >
            {text}
          </div>
        );
      }

      case 'parallax-layers': {
        const offset = Math.sin(timeSec * 2) * 10;
        return (
          <div className="relative inline-block font-bold">
            <span
              className="absolute inset-0 text-white/20 select-none pointer-events-none"
              style={{ transform: `translateX(${offset * 0.3}px)` }}
            >
              {text}
            </span>
            <span
              className="absolute inset-0 text-white/50 select-none pointer-events-none"
              style={{ transform: `translateX(${offset * 0.6}px)` }}
            >
              {text}
            </span>
            <span
              className="relative z-10 text-white"
              style={{ transform: `translateX(${offset}px)` }}
            >
              {text}
            </span>
          </div>
        );
      }

      case 'voxel-extrude': {
        const zLayers = 6;
        return (
          <div className="relative inline-block font-black">
            {Array.from({ length: zLayers }).map((_, i) => (
              <span
                key={i}
                className="absolute inset-0 select-none pointer-events-none"
                style={{
                  transform: `translate(${-i * 2}px, ${-i * 2}px)`,
                  color: i === zLayers - 1 ? '#FFFFFF' : '#444444',
                  zIndex: zLayers - i,
                }}
              >
                {text}
              </span>
            ))}
            <span className="invisible">{text}</span>
          </div>
        );
      }

      case 'infinite-mirrors': {
        return (
          <div className="relative inline-block font-bold">
            {Array.from({ length: 5 }).map((_, i) => {
              const scale = 1 - i * 0.15;
              const opacity = 1 - i * 0.2;
              const y = i * 4;
              return (
                <span
                  key={i}
                  className="absolute inset-0 select-none pointer-events-none transition-transform"
                  style={{
                    transform: `translateY(${y}px) scale(${scale})`,
                    opacity,
                    zIndex: 5 - i,
                  }}
                >
                  {text}
                </span>
              );
            })}
            <span className="relative z-10 text-white">{text}</span>
          </div>
        );
      }

      case 'topographic-layers': {
        const contourWave = Math.sin(timeSec * 2) * 4;
        return (
          <div className="relative inline-block font-bold">
            <span
              className="absolute inset-0 text-white/30 select-none pointer-events-none"
              style={{ transform: `translate(${contourWave}px, ${contourWave}px)` }}
            >
              {text}
            </span>
            <span
              className="absolute inset-0 text-white/60 select-none pointer-events-none"
              style={{ transform: `translate(${contourWave * 0.5}px, ${contourWave * 0.5}px)` }}
            >
              {text}
            </span>
            <span className="relative z-10 text-white">{text}</span>
          </div>
        );
      }

      case 'carved-stone': {
        const angle = (timeSec * 90) % 360;
        const rad = (angle * Math.PI) / 180;
        const lx = Math.cos(rad) * 2;
        const ly = Math.sin(rad) * 2;
        return (
          <div
            className="inline-block font-bold text-[#666666]"
            style={{
              textShadow: `${lx}px ${ly}px 1px #000, ${-lx}px ${-ly}px 1px #fff`,
            }}
          >
            {text}
          </div>
        );
      }

      // --- MORPH CATEGORY ---
      case 'weight-morph': {
        const weight = Math.floor(Math.sin(timeSec * 2) * 200 + 500);
        return (
          <div
            className="inline-block transition-all duration-100"
            style={{
              fontWeight: weight,
            }}
          >
            {text}
          </div>
        );
      }

      case 'case-flip': {
        const cycle = timeSec % 2.4;
        const isUpper = cycle > 1.2;
        const rotX = ((cycle % 1.2) / 1.2) * 180;
        const displayText = isUpper ? text.toUpperCase() : text.toLowerCase();
        return (
          <div style={{ perspective: '400px' }}>
            <div
              className="inline-block"
              style={{
                transform: `rotateX(${rotX > 90 ? 180 - rotX : rotX}deg)`,
              }}
            >
              {displayText}
            </div>
          </div>
        );
      }

      case 'tracking-breathe': {
        const tracking = Math.sin(timeSec * 2) * 0.15 + 0.15;
        return (
          <div
            className="inline-block"
            style={{
              letterSpacing: `${tracking}em`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'letter-swap': {
        const chars = text.split('');
        const isSwapped = (frame % 2400) < 1200;
        if (isSwapped && chars.length >= 2) {
          const temp = chars[0];
          chars[0] = chars[1];
          chars[1] = temp;
        }
        return (
          <div className="inline-block font-mono tracking-wider transition-all duration-300">
            {chars.join('')}
          </div>
        );
      }

      case 'size-pump': {
        const isPump = (frame % 800) < 200;
        const scale = isPump ? 1.2 : 1.0;
        return (
          <div
            className="inline-block transition-transform duration-100 font-semibold"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'condense-expand': {
        const scaleX = Math.sin(timeSec * 2.2) * 0.35 + 1.0;
        return (
          <div
            className="inline-block"
            style={{
              transform: `scaleX(${scaleX})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'serif-shift': {
        const isSerif = (frame % 2800) < 1400;
        return (
          <div
            className={`inline-block transition-all duration-300 ${
              isSerif ? 'font-serif italic' : 'font-sans'
            }`}
          >
            {text}
          </div>
        );
      }

      case 'variable-axis-dance': {
        const weight = Math.floor(Math.sin(timeSec * 2) * 300 + 500);
        const slant = Math.sin(timeSec * 2.5) * 12;
        const tracking = Math.sin(timeSec * 1.8) * 0.1 + 0.05;
        return (
          <div
            className="inline-block"
            style={{
              fontWeight: weight,
              transform: `skewX(${slant}deg)`,
              letterSpacing: `${tracking}em`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'bubble-inflate': {
        const inflate = Math.sin(timeSec * 2.5) * 0.25 + 1.05;
        return (
          <div
            className="inline-block font-bold"
            style={{
              transform: `scale(${inflate})`,
              borderRadius: '8px',
            }}
          >
            {text}
          </div>
        );
      }

      case 'origami-tessellate': {
        const skew = Math.sin(timeSec * 2) * 14;
        const rotY = Math.cos(timeSec * 2) * 25;
        return (
          <div style={{ perspective: '400px' }}>
            <div
              className="inline-block font-bold"
              style={{
                transform: `rotateY(${rotY}deg) skewX(${skew}deg)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      }

      case 'pixel-grid-quantize': {
        const isBlocky = (frame % 2000) < 1000;
        return (
          <div
            className={`inline-block font-mono tracking-widest ${
              isBlocky ? 'text-[#888888] font-black scale-95' : 'text-white font-bold'
            }`}
          >
            {text}
          </div>
        );
      }

      // --- AMBIENT CATEGORY ---
      case 'soft-breathe': {
        const opacity = Math.sin(timeSec * 1.5) * 0.15 + 0.85;
        const scale = Math.sin(timeSec * 1.5) * 0.02 + 1.0;
        return (
          <div
            className="inline-block"
            style={{
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'gentle-float': {
        const y = Math.sin(timeSec * 1.2) * 4;
        const x = Math.cos(timeSec * 0.9) * 2;
        return (
          <div
            className="inline-block"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'cursor-blink': {
        return (
          <div className="inline-flex items-center">
            <span>{text}</span>
            <span className="inline-block w-[3px] h-[1.1em] bg-white ml-1 animate-caret" />
          </div>
        );
      }

      case 'slow-fade-cycle': {
        const opacity = Math.sin(timeSec * 0.8) * 0.38 + 0.62;
        return (
          <div className="inline-block" style={{ opacity }}>
            {text}
          </div>
        );
      }

      case 'micro-jitter': {
        const jx = (Math.random() - 0.5) * 0.8;
        const jy = (Math.random() - 0.5) * 0.8;
        return (
          <div
            className="inline-block"
            style={{
              transform: `translate(${jx}px, ${jy}px)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'idle-sway': {
        const rot = Math.sin(timeSec * 1.4) * 1.8;
        return (
          <div
            className="inline-block origin-bottom"
            style={{
              transform: `rotate(${rot}deg)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'grain-shift': {
        return (
          <div className="relative inline-block">
            <span className="text-white">{text}</span>
            <div className="absolute inset-0 opacity-20 mix-blend-screen bg-white/20 pointer-events-none animate-pulse" />
          </div>
        );
      }

      case 'starlight-twinkle': {
        const twinkle = (frame % 600) < 150;
        return (
          <div className="relative inline-block font-bold">
            <span className="text-white">{text}</span>
            {twinkle && (
              <div className="absolute -top-1 right-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
            )}
          </div>
        );
      }

      case 'slow-liquid-tide': {
        const swell = Math.sin(timeSec * 1.0) * 3;
        const scale = 1 + Math.sin(timeSec * 1.0) * 0.03;
        return (
          <div
            className="inline-block"
            style={{
              transform: `translateY(${swell}px) scale(${scale})`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'magnetic-compass': {
        const yaw = Math.sin(timeSec * 1.2) * 0.8;
        return (
          <div
            className="inline-block origin-center"
            style={{
              transform: `rotate(${yaw}deg)`,
            }}
          >
            {text}
          </div>
        );
      }

      case 'subtle-heartbeat': {
        const phase = (timeSec * 1.5) % 1.5;
        const isPulse = phase < 0.15 || (phase > 0.25 && phase < 0.4);
        const scale = isPulse ? 1.04 : 1.0;
        return (
          <div
            className="inline-block font-medium transition-transform duration-75"
            style={{ transform: `scale(${scale})` }}
          >
            {text}
          </div>
        );
      }

      default: {
        return <span className="text-white">{text}</span>;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`w-full h-full flex items-center justify-center select-none ${fontSizeClass}`}
    >
      {renderVisual()}
    </div>
  );
};

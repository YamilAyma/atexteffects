import React, { useMemo, useState } from 'react';

interface CircuitLinesProps {
  className?: string;
}

interface CircuitTrack {
  id: number;
  y: number;
  d: string;
  speed: number;
  dashLength: number;
  dashGap: number;
  delay: number;
  color: string;
  opacity: number;
}

export const CircuitLines: React.FC<CircuitLinesProps> = ({ className = '' }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Define 12 circuit tracks with the distinctive topological hill/arch on the right
  const tracks: CircuitTrack[] = useMemo(() => {
    const width = 1000;
    const count = 12;
    const startY = 15;
    const stepY = 11;

    // The arch center is at 70% of width (x = 700)
    const archCenterX = 700;
    const archWidth = 140;

    return Array.from({ length: count }).map((_, i) => {
      const y = startY + i * stepY;
      // Arch height increases or gracefully peaks based on line index
      const archHeight = 18 + Math.sin((i / (count - 1)) * Math.PI) * 22;

      const x1 = 0;
      const x2 = archCenterX - archWidth / 2;
      const x3 = archCenterX - archWidth / 4;
      const x4 = archCenterX;
      const x5 = archCenterX + archWidth / 4;
      const x6 = archCenterX + archWidth / 2;
      const x7 = width;

      // Smooth cubic bezier S-curve over the bump
      const peakY = y - archHeight;
      const pathD = `M ${x1} ${y} L ${x2} ${y} C ${x3} ${y} ${x3} ${peakY} ${x4} ${peakY} C ${x5} ${peakY} ${x5} ${y} ${x6} ${y} L ${x7} ${y}`;

      const speeds = [14, 18, 22, 16, 20, 24, 15, 19, 23, 17, 21, 25];
      const dashLengths = [28, 45, 60, 35, 50, 70, 30, 40, 65, 55, 38, 48];
      const dashGaps = [260, 320, 280, 350, 300, 400, 270, 340, 310, 380, 290, 360];
      const delays = [0, -4, -8, -2, -6, -10, -3, -7, -1, -5, -9, -11];

      return {
        id: i,
        y,
        d: pathD,
        speed: speeds[i % speeds.length],
        dashLength: dashLengths[i % dashLengths.length],
        dashGap: dashGaps[i % dashGaps.length],
        delay: delays[i % delays.length],
        color: i % 3 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#D1D5DB' : '#9CA3AF',
        opacity: i % 2 === 0 ? 0.9 : 0.75,
      };
    });
  }, []);

  // Perpendicular circuit interconnects / jumper ticks
  const jumpers = useMemo(() => {
    return [
      { x: 180, y1: 15, y2: 48, label: 'BUS_0' },
      { x: 320, y1: 48, y2: 92, label: 'CLK' },
      { x: 460, y1: 26, y2: 70, label: 'DATA' },
      { x: 580, y1: 59, y2: 125, label: 'SYNC' },
      { x: 700, y1: -4, y2: 26, label: 'VREG' },
      { x: 840, y1: 37, y2: 103, label: 'IO_7' },
      { x: 920, y1: 15, y2: 59, label: 'TX' },
    ];
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${className}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 1000,
          y: ((e.clientY - rect.top) / rect.height) * 150,
        });
      }}
      onMouseLeave={() => setMousePos(null)}
    >
      <svg
        viewBox="0 0 1000 150"
        preserveAspectRatio="none"
        className="w-full h-32 sm:h-36 md:h-40 block"
      >
        <defs>
          {/* Subtle horizontal gradient to fade out left & right edges slightly */}
          <linearGradient id="circuitTrackFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.3" />
            <stop offset="10%" stopColor="#242424" stopOpacity="1" />
            <stop offset="90%" stopColor="#242424" stopOpacity="1" />
            <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.3" />
          </linearGradient>

          {/* Pulse Glow Filter */}
          <filter id="pulseGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Static Background Circuit Lines */}
        {tracks.map((track) => (
          <path
            key={`base-${track.id}`}
            d={track.d}
            fill="none"
            stroke="url(#circuitTrackFade)"
            strokeWidth="1.2"
            opacity="0.8"
          />
        ))}

        {/* 2. Perpendicular Vertical Circuit Nodes and Jumpers */}
        {jumpers.map((j, idx) => (
          <g key={`jumper-${idx}`} opacity="0.4">
            <line
              x1={j.x}
              y1={j.y1}
              x2={j.x}
              y2={j.y2}
              stroke="#2E2E2E"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            <circle cx={j.x} cy={j.y1} r="2" fill="#3D3D3D" stroke="#050505" strokeWidth="0.8" />
            <circle cx={j.x} cy={j.y2} r="2" fill="#3D3D3D" stroke="#050505" strokeWidth="0.8" />
          </g>
        ))}

        {/* 3. Animated Circuit Pulse Packets (Traveling Left to Right) */}
        {tracks.map((track) => (
          <path
            key={`pulse-${track.id}`}
            d={track.d}
            fill="none"
            stroke={track.color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray={`${track.dashLength} ${track.dashGap}`}
            filter="url(#pulseGlow)"
            opacity={track.opacity}
            style={{
              animation: `circuitFlow ${track.speed}s linear infinite`,
              animationDelay: `${track.delay}s`,
            }}
          />
        ))}

        {/* 4. Secondary Micro-Spark Particles on Selected Tracks */}
        {tracks.filter((_, i) => i % 3 === 1).map((track) => (
          <path
            key={`spark-${track.id}`}
            d={track.d}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="14 500"
            filter="url(#pulseGlow)"
            opacity="0.95"
            style={{
              animation: `circuitFlow ${track.speed * 0.75}s linear infinite`,
              animationDelay: `${track.delay - 3}s`,
            }}
          />
        ))}

        {/* 5. Interactive Proximity Spark Indicator */}
        {mousePos && (
          <g>
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r="24"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={mousePos.x}
              cy={mousePos.y}
              r="3"
              fill="#FFFFFF"
              filter="url(#pulseGlow)"
            />
          </g>
        )}
      </svg>

      {/* Global CSS animation for smooth SVG dash offset translation */}
      <style>{`
        @keyframes circuitFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};

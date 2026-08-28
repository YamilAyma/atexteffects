import React, { useState } from 'react';
import { Copy, Check, Star, RotateCcw } from 'lucide-react';
import { Effect } from '../types';
import { EffectRenderer } from '../animations/renderer';
import { useIntersection } from '../hooks/useIntersection';

interface EffectCardProps {
  effect: Effect;
  isFavorite: boolean;
  onToggleFavorite: (effectId: string) => void;
  onCopyPrompt: (effect: Effect) => void;
  onOpenModal: (effect: Effect) => void;
  onTagClick?: (tag: string) => void;
  shouldReduceMotion?: boolean;
  isFocused?: boolean;
  isAnyFocused?: boolean;
  onFocusStart?: (effectId: string) => void;
  onFocusEnd?: () => void;
  sampleText?: string;
}

export const EffectCard: React.FC<EffectCardProps> = ({
  effect,
  isFavorite,
  onToggleFavorite,
  onCopyPrompt,
  onOpenModal,
  onTagClick,
  shouldReduceMotion = false,
  isFocused = false,
  isAnyFocused = false,
  onFocusStart,
  onFocusEnd,
  sampleText,
}) => {
  const { isVisible, elementRef } = useIntersection('150px');
  const [copied, setCopied] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const pressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const startPress = () => {
    if (!onFocusStart) return;
    setIsPressing(true);
    pressTimerRef.current = setTimeout(() => {
      onFocusStart(effect.id);
    }, 280);
  };

  const endPress = () => {
    setIsPressing(false);
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (onFocusEnd) {
      onFocusEnd();
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt(effect);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(effect.id);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplayKey((k) => k + 1);
  };

  const isDimmed = isAnyFocused && !isFocused;

  return (
    <div
      ref={elementRef}
      onClick={() => {
        if (!isFocused) {
          onOpenModal(effect);
        }
      }}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 select-none cursor-pointer ${
        isFocused
          ? 'bg-[#111111] border-2 border-white shadow-[0_0_35px_rgba(255,255,255,0.18)] scale-[1.03] z-20 ring-4 ring-white/10'
          : isDimmed
          ? 'bg-[#080808] border border-[#161616] opacity-25 grayscale-[40%] scale-[0.98] pointer-events-none'
          : 'bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#3A3A3A] hover:-translate-y-0.5'
      }`}
    >
      {/* Focus Badge Indicator */}
      {isFocused && (
        <div className="absolute top-2 left-2 z-30 px-2 py-0.5 rounded bg-white text-black font-mono text-[10px] font-bold tracking-wider uppercase shadow-md animate-pulse">
          Focus Mode
        </div>
      )}
      {/* 16:10 Preview Stage */}
      <div className="relative aspect-[16/10] w-full bg-[#050505] border-b border-[#1E1E1E] flex items-center justify-center p-4 overflow-hidden">
        {/* Animated preview */}
        <EffectRenderer
          effect={effect}
          sampleText={sampleText}
          replayKey={replayKey}
          isPlaying={isVisible && !shouldReduceMotion}
        />

        {/* Replay overlay button on hover */}
        <button
          onClick={handleReplay}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-[#121212]/80 backdrop-blur-sm border border-[#1E1E1E] text-[#A1A1A1] hover:text-white hover:border-[#3A3A3A] opacity-0 group-hover:opacity-100 transition-opacity"
          title="Replay animation (r)"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#F5F5F5] group-hover:text-white transition-colors">
            {effect.name}
          </h3>
          <p className="text-xs text-[#A1A1A1] mt-1 line-clamp-1">
            {effect.description}
          </p>
        </div>

        {/* Tag chips + Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {effect.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  if (onTagClick) {
                    e.stopPropagation();
                    onTagClick(tag);
                  }
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-[#161616] text-[#A1A1A1] border border-[#1E1E1E] hover:border-[#3A3A3A] hover:text-white transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Copy prompt button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                copied
                  ? 'bg-white text-black border-white'
                  : 'bg-[#121212] text-[#F5F5F5] border-[#1E1E1E] hover:border-[#3A3A3A] hover:bg-[#161616]'
              }`}
              title="Copy agnostic prompt to clipboard (c)"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span className="hidden sm:inline">copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#A1A1A1]" />
                  <span>copy prompt</span>
                </>
              )}
            </button>

            {/* Favorite star */}
            <button
              onClick={handleFavorite}
              className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-[#161616] text-white border-white'
                  : 'bg-[#121212] text-[#A1A1A1] border-[#1E1E1E] hover:border-[#3A3A3A] hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites (f)'}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-white text-white' : 'text-[#A1A1A1]'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

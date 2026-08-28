import React, { useState, useEffect } from 'react';
import { X, Layers, RotateCcw, Copy, Check, Star } from 'lucide-react';
import { Effect } from '../types';
import { EffectRenderer } from '../animations/renderer';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  effects: Effect[];
  onRemoveEffect: (effectId: string) => void;
  sampleText?: string;
  onCustomTextChange?: (text: string) => void;
  shouldReduceMotion?: boolean;
  onCopyPrompt: (effect: Effect) => void;
  favorites: string[];
  onToggleFavorite: (effectId: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  effects,
  onRemoveEffect,
  sampleText = '',
  onCustomTextChange,
  shouldReduceMotion = false,
  onCopyPrompt,
  favorites,
  onToggleFavorite,
}) => {
  const [globalReplayKey, setGlobalReplayKey] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || effects.length === 0) return null;

  const handleReplayAll = () => {
    setGlobalReplayKey((k) => k + 1);
  };

  const handleCopy = (eff: Effect) => {
    onCopyPrompt(eff);
    setCopiedId(eff.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-[#0D0D0D] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E1E1E] bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white text-black font-semibold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  effects comparison lab
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1C1C1C] text-[#A1A1A1] border border-[#2E2E2E] font-mono">
                  {effects.length} / 3 active
                </span>
              </div>
              <p className="text-xs text-[#888888]">
                side-by-side synchronized preview and prompt inspection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Synchronized Replay */}
            <button
              onClick={handleReplayAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#D4D4D4] bg-[#1A1A1A] hover:bg-[#262626] border border-[#2E2E2E] rounded-lg transition-colors cursor-pointer"
              title="Synchronize & replay all previews"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>sync replay</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1C1C1C] transition-colors cursor-pointer"
              title="Close comparator (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Live Compare Word Input */}
        <div className="px-4 sm:px-6 py-3 bg-[#080808] border-b border-[#1A1A1A] flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-[#737373] shrink-0">
            shared sample text:
          </span>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => onCustomTextChange && onCustomTextChange(e.target.value)}
            placeholder="type custom word for comparison..."
            maxLength={20}
            className="flex-1 max-w-sm h-8 px-3 text-xs bg-[#121212] border border-[#222222] focus:border-[#444444] rounded-md text-white font-mono placeholder-[#555555] outline-none"
          />
        </div>

        {/* Horizontal Columns */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {effects.map((effect) => {
            const isFav = favorites.includes(effect.id);
            const isCopied = copiedId === effect.id;

            return (
              <div
                key={effect.id}
                className="flex flex-col bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl overflow-hidden shadow-lg"
              >
                {/* Header item */}
                <div className="p-3.5 bg-[#121212] border-b border-[#1E1E1E] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#888888] border border-[#262626]">
                      {effect.categoryId}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                      {effect.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onRemoveEffect(effect.id)}
                    className="p-1 rounded text-[#737373] hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Preview Area */}
                <div className="relative aspect-[16/10] w-full bg-[#050505] border-b border-[#1E1E1E] flex items-center justify-center p-4 overflow-hidden">
                  <EffectRenderer
                    effect={effect}
                    sampleText={sampleText || undefined}
                    replayKey={globalReplayKey}
                    isPlaying={!shouldReduceMotion}
                  />
                </div>

                {/* Prompt Info */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[11px] font-mono text-[#737373] mb-1">prompt:</div>
                    <div className="p-2.5 rounded-lg bg-[#0E0E0E] border border-[#1A1A1A] font-mono text-[11px] text-[#D4D4D4] leading-relaxed line-clamp-4 select-text">
                      {effect.prompt}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#161616]">
                    <span className="text-[11px] font-mono text-[#666666]">
                      {effect.durationMs}ms · {effect.animType}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(effect)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-[#141414] text-[#E5E5E5] border-[#222222] hover:border-[#3A3A3A]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-black" />
                            <span>copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#A1A1A1]" />
                            <span>copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onToggleFavorite(effect.id)}
                        className={`p-1 rounded border transition-all cursor-pointer ${
                          isFav
                            ? 'bg-white text-black border-white'
                            : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#3A3A3A] hover:text-white'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Star className={`w-3 h-3 ${isFav ? 'fill-black text-black' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

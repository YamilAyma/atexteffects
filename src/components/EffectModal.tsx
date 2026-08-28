import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Star,
  RotateCcw,
  Share2,
  FileText,
} from 'lucide-react';
import { Effect } from '../types';
import { EffectRenderer } from '../animations/renderer';

interface EffectModalProps {
  effect: Effect | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (effectId: string) => void;
  onCopyPrompt: (effect: Effect) => void;
  onCopyWithDetails: (effect: Effect) => void;
  onCopyPermalink: (effect: Effect) => void;
  shouldReduceMotion?: boolean;
  sampleText?: string;
}

export const EffectModal: React.FC<EffectModalProps> = ({
  effect,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCopyPrompt,
  onCopyWithDetails,
  onCopyPermalink,
  shouldReduceMotion = false,
  sampleText,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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

  if (!isOpen || !effect) return null;

  const handleCopyPrompt = () => {
    onCopyPrompt(effect);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  const handleCopyWithDetails = () => {
    onCopyWithDetails(effect);
    setCopiedDetails(true);
    setTimeout(() => setCopiedDetails(false), 1500);
  };

  const handleCopyLink = () => {
    onCopyPermalink(effect);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#121212] border border-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-[#1E1E1E]/60">
          <div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1C1C1C] text-[#A1A1A1] border border-[#2A2A2A] mb-2">
              {effect.categoryId}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {effect.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
              {effect.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#A1A1A1] hover:text-white hover:bg-[#1C1C1C] transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Large Live Preview Stage */}
          <div className="relative aspect-video w-full rounded-xl bg-[#050505] border border-[#1E1E1E] flex items-center justify-center p-6 overflow-hidden">
            <EffectRenderer
              effect={effect}
              sampleText={sampleText}
              isModal={true}
              replayKey={replayKey}
              isPlaying={!shouldReduceMotion}
            />

            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="absolute top-3 right-3 p-2 rounded-md bg-[#121212]/80 backdrop-blur-sm border border-[#1E1E1E] text-[#A1A1A1] hover:text-white hover:border-[#3A3A3A] transition-colors"
              title="Replay effect animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#A1A1A1] tracking-wider font-mono">
                prompt
              </span>
              <span className="text-[11px] text-[#5C5C5C] font-mono">
                agnostic instruction
              </span>
            </div>

            <div className="relative p-4 rounded-xl bg-[#0C0C0C] border border-[#1E1E1E] text-xs sm:text-sm font-mono text-[#F5F5F5] leading-relaxed select-text">
              {effect.prompt}
            </div>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#A1A1A1]">
            <span className="px-2.5 py-1 rounded bg-[#161616] border border-[#1E1E1E]">
              duration: <strong className="text-white font-mono">{effect.durationMs}ms</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#161616] border border-[#1E1E1E]">
              loop: <strong className="text-white">{effect.loop ? 'seamless' : 'one-shot'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#161616] border border-[#1E1E1E]">
              family: <strong className="text-white font-mono">{effect.animType}</strong>
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 pt-3 bg-[#0E0E0E] border-t border-[#1E1E1E] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Main copy button (Primary White button matching screenshot) */}
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white text-black hover:bg-[#E5E5E5] transition-all cursor-pointer shadow-lg"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>copy prompt</span>
                </>
              )}
            </button>

            {/* Secondary copy with details */}
            <button
              onClick={handleCopyWithDetails}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#161616] text-[#F5F5F5] border border-[#1E1E1E] hover:border-[#3A3A3A] hover:bg-[#1C1C1C] transition-all"
              title="Copy prompt with effect name and duration"
            >
              {copiedDetails ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-[#A1A1A1]" />
              )}
              <span>copy details</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Share link button */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-[#161616] text-[#A1A1A1] hover:text-white border border-[#1E1E1E] hover:border-[#3A3A3A] transition-colors"
              title="Copy shareable permalink"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(effect.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-white text-black border-white'
                  : 'bg-[#161616] text-[#A1A1A1] hover:text-white border-[#1E1E1E] hover:border-[#3A3A3A]'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites (f)'}
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-black text-black' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

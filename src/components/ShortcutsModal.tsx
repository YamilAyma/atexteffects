import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '/', desc: 'focus search bar' },
  { key: 'Esc', desc: 'close modal / clear search / exit focus' },
  { key: 's', desc: 'shuffle effects catalog' },
  { key: 'f', desc: 'toggle favorites view' },
  { key: 'a', desc: 'show all effects' },
  { key: 'Hold Click', desc: 'focus mode (isolate single card preview)' },
  { key: 'c', desc: 'copy prompt of focused effect' },
  { key: 'r', desc: 'replay preview animation' },
  { key: '?', desc: 'open keyboard shortcuts' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#121212] border border-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden p-6 select-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2 text-white">
            <Keyboard className="w-4 h-4 text-[#A1A1A1]" />
            <h3 className="text-base font-semibold">keyboard shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#A1A1A1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#1E1E1E] mt-2">
          {SHORTCUTS.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
              <span className="text-[#A1A1A1]">{sc.desc}</span>
              <kbd className="px-2 py-1 font-mono text-xs text-[#F5F5F5] bg-[#1C1C1C] border border-[#2A2A2A] rounded-md shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#1E1E1E] text-center text-[11px] text-[#5C5C5C]">
          press Esc or click outside to dismiss
        </div>
      </div>
    </div>
  );
};

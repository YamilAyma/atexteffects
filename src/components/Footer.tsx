import React, { useState } from 'react';
import { GlitchTitle } from './GlitchTitle';
import { CircuitLines } from './CircuitLines';
import { FooterModal, FooterModalType } from './FooterModal';
import { Star, CheckCircle, Keyboard, Activity } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onOpenShortcuts?: () => void;
  shouldReduceMotion?: boolean;
  onToggleMotion?: () => void;
  onShowToast?: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenShortcuts,
  shouldReduceMotion = false,
  onToggleMotion,
  onShowToast,
}) => {
  const [modalType, setModalType] = useState<FooterModalType>(null);

  const handleToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  const handleNavClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050505] text-[#A1A1A1] pt-12 pb-10 px-4 sm:px-8 border-t border-[#161616] select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header: Glitch Title + Subtitle + Github Icon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <GlitchTitle text="atexteffects" />
            <p className="text-sm text-[#888888] font-normal tracking-normal max-w-xl">
              open source gallery of animated text effects for designers and developers.
            </p>
          </div>

          {/* GitHub Circular Icon Button */}
          <a
            href="https://github.com/YamilAyma/atexteffects"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="w-12 h-12 rounded-full border border-[#2E2E2E] bg-[#0A0A0A] hover:bg-[#141414] hover:border-white hover:text-white text-[#CCCCCC] transition-all flex items-center justify-center cursor-pointer shadow-lg group shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current transition-transform duration-200 group-hover:scale-110"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>

        {/* Middle Section: Animated Circuit Lines */}
        <div className="py-2">
          <CircuitLines />
        </div>

        {/* Bottom Navigation Rows */}
        <div className="space-y-4 pt-2">
          {/* Row 1 of Links */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#CCCCCC]">
            <button
              onClick={() => handleNavClick('all')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              all effects
            </button>
            <button
              onClick={() => handleNavClick('reveal')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              categories
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              favorites
            </button>
            <button
              onClick={() => setModalType('docs')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              docs
            </button>
            <button
              onClick={() => setModalType('about')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              about
            </button>
            <button
              onClick={() => setModalType('contact')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              contact
            </button>
          </div>

          {/* Row 2 of Links */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#CCCCCC]">
            <button
              onClick={() => setModalType('changelog')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              changelog
            </button>
            <button
              onClick={() => setModalType('license')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              license
            </button>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              privacy
            </button>
            <a
              href="https://github.com/YamilAyma/atexteffects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
            >
              github
            </a>
          </div>
        </div>

        {/* Bottom Sub-Bar: Version · Repo link · Stars · Build Status */}
        <div className="pt-6 border-t border-[#161616] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#737373] font-mono">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[#A1A1A1]">v1.0.0</span>
            <span>•</span>
            <a
              href="https://github.com/YamilAyma/atexteffects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors hover:underline"
            >
              github.com/YamilAyma/atexteffects
            </a>
            <span>•</span>
            <a
              href="https://github.com/YamilAyma/atexteffects/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
              title="Star on GitHub"
            >
              <Star className="w-3.5 h-3.5 text-yellow-400 group-hover:fill-yellow-400 transition-colors" />
              <span>Sent a Star</span>
            </a>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-[#A1A1A1]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline-block" />
              <span>build passing</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
            </div>
          </div>

          {/* Quick Accessibility & Keyboard Shortcut Tools */}
          <div className="flex items-center gap-4 text-xs font-sans">
            {onToggleMotion && (
              <button
                onClick={onToggleMotion}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
                  shouldReduceMotion
                    ? 'bg-[#1C1C1C] text-white border-[#3A3A3A]'
                    : 'text-[#888888] border-transparent hover:text-white'
                }`}
                title="Toggle animation motion reduction"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{shouldReduceMotion ? 'reduced' : 'motion'}</span>
              </button>
            )}

            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>shortcuts (?)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <FooterModal
        type={modalType}
        onClose={() => setModalType(null)}
        onShowToast={handleToast}
      />
    </footer>
  );
};

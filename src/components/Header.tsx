import React, { useRef } from 'react';
import { Search, Shuffle, Star, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShuffle: () => void;
  favoritesCount: number;
  isFavoritesView: boolean;
  onToggleFavoritesView: () => void;
  onResetView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onShuffle,
  favoritesCount,
  isFavoritesView,
  onToggleFavoritesView,
  onResetView,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#050505] border-b border-[#1E1E1E] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Brand logo / wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetView}
          className="flex items-center gap-1.5 text-lg sm:text-xl font-semibold tracking-tight text-[#F5F5F5] hover:text-white transition-colors cursor-pointer"
          title="atexteffects — home"
        >
          <span>atexteffects</span>
          <span className="inline-block w-1.5 h-4 bg-white animate-caret opacity-80" />
        </button>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#5C5C5C] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="search effects, categories, tags..."
            className="w-full h-9 pl-9 pr-16 bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#3A3A3A] focus:border-[#3A3A3A] focus:outline-none rounded-md text-xs sm:text-sm text-[#F5F5F5] placeholder-[#5C5C5C] transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                onSearchChange('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 p-1 text-[#5C5C5C] hover:text-[#F5F5F5] transition-colors"
              title="Clear search (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-[#5C5C5C] bg-[#161616] border border-[#1E1E1E] rounded pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onShuffle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#A1A1A1] hover:text-white hover:bg-[#161616] border border-transparent hover:border-[#1E1E1E] rounded-md transition-all cursor-pointer"
          title="Shuffle catalog (s)"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">shuffle</span>
        </button>

        <button
          onClick={onToggleFavoritesView}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            isFavoritesView
              ? 'bg-white text-black font-semibold'
              : 'text-[#A1A1A1] hover:text-white hover:bg-[#161616] border border-transparent hover:border-[#1E1E1E]'
          }`}
          title="View favorites (f)"
        >
          <Star className={`w-3.5 h-3.5 ${isFavoritesView ? 'fill-black' : ''}`} />
          <span className="hidden sm:inline">favorites</span>
          {favoritesCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isFavoritesView ? 'bg-black text-white' : 'bg-[#1E1E1E] text-white'
              }`}
            >
              {favoritesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

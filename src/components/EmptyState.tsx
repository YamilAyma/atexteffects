import React from 'react';
import { Search, Star, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'favorites';
  searchQuery?: string;
  onClearSearch?: () => void;
  onExploreAll?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onClearSearch,
  onExploreAll,
}) => {
  if (type === 'favorites') {
    return (
      <div className="w-full py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#1E1E1E] flex items-center justify-center mb-4 text-[#A1A1A1]">
          <Star className="w-5 h-5" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F5] mb-1">
          no favorites yet
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1A1] max-w-sm mb-6">
          tap the star icon on any effect card to save it to your personal inspiration library
        </p>
        {onExploreAll && (
          <button
            onClick={onExploreAll}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#161616] text-white border border-[#1E1E1E] hover:border-[#3A3A3A] hover:bg-[#1C1C1C] transition-all cursor-pointer"
          >
            browse all effects
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#1E1E1E] flex items-center justify-center mb-4 text-[#A1A1A1]">
        <Search className="w-5 h-5" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F5] mb-1">
        no effects match &ldquo;{searchQuery}&rdquo;
      </h3>
      <p className="text-xs sm:text-sm text-[#A1A1A1] max-w-sm mb-6">
        try searching by visual tag, animation family, or a different keyword
      </p>
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#161616] text-white border border-[#1E1E1E] hover:border-[#3A3A3A] hover:bg-[#1C1C1C] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>clear search</span>
        </button>
      )}
    </div>
  );
};

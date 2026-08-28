import React from 'react';
import { CATEGORIES } from '../data/categories';

interface MobileCategoryBarProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  favoritesCount: number;
  onSelectFavorites: () => void;
}

export const MobileCategoryBar: React.FC<MobileCategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  favoritesCount,
  onSelectFavorites,
}) => {
  return (
    <div className="lg:hidden w-full overflow-x-auto py-2.5 px-4 bg-[#0C0C0C] border-b border-[#1E1E1E] flex items-center gap-2 no-scrollbar">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
          activeCategory === 'all'
            ? 'bg-white text-black font-semibold'
            : 'bg-[#161616] text-[#A1A1A1] hover:text-white border border-[#1E1E1E]'
        }`}
      >
        all (70)
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            activeCategory === cat.id
              ? 'bg-white text-black font-semibold'
              : 'bg-[#161616] text-[#A1A1A1] hover:text-white border border-[#1E1E1E]'
          }`}
        >
          {cat.name} (7)
        </button>
      ))}

      <button
        onClick={onSelectFavorites}
        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
          activeCategory === 'favorites'
            ? 'bg-white text-black font-semibold'
            : 'bg-[#161616] text-[#A1A1A1] hover:text-white border border-[#1E1E1E]'
        }`}
      >
        favorites ({favoritesCount})
      </button>
    </div>
  );
};

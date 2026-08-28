import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Zap,
  Activity,
  Type,
  Waves,
  Sun,
  MousePointer,
  Layers,
  Maximize2,
  Infinity as LoopIcon,
  Star,
  Code2,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  totalEffectsCount: number;
  categoryCounts: Record<string, number>;
  favoritesCount: number;
  onSelectFavorites: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  Waves: <Waves className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  MousePointer: <MousePointer className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Maximize2: <Maximize2 className="w-4 h-4" />,
  Infinity: <LoopIcon className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  totalEffectsCount,
  categoryCounts,
  favoritesCount,
  onSelectFavorites,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#0C0C0C] border-r border-[#1E1E1E] flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-medium text-[#5C5C5C] px-3 pb-2 tracking-wider">
            categories
          </div>

          <nav className="space-y-0.5">
            {/* All Effects */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-sm transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#161616] text-white font-medium border-l-2 border-white pl-2.5'
                  : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-[#A1A1A1]" />
                <span>all effects</span>
              </div>
              <span className="text-xs text-[#5C5C5C] font-mono">{totalEffectsCount}</span>
            </button>

            {/* 10 Category items */}
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              const count = categoryCounts[category.id] || 7;
              const icon = ICON_MAP[category.icon] || <Sparkles className="w-4 h-4" />;

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#161616] text-white font-medium border-l-2 border-white pl-2.5'
                      : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-[#A1A1A1]'}>{icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-[#5C5C5C] font-mono">{count}</span>
                </button>
              );
            })}

            {/* Favorites item in sidebar list */}
            <button
              onClick={onSelectFavorites}
              className={`w-full flex items-center justify-between px-3 py-2 mt-2 rounded-md text-xs sm:text-sm transition-all cursor-pointer ${
                activeCategory === 'favorites'
                  ? 'bg-[#161616] text-white font-medium border-l-2 border-white pl-2.5'
                  : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star
                  className={`w-4 h-4 ${
                    activeCategory === 'favorites' ? 'fill-white text-white' : 'text-[#A1A1A1]'
                  }`}
                />
                <span>favorites</span>
              </div>
              <span className="text-xs text-[#5C5C5C] font-mono">{favoritesCount}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Promo Card from screenshot */}
      <div className="pt-6 border-t border-[#1E1E1E]">
        <div className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E]">
          <div className="flex items-center gap-2 text-[#F5F5F5] mb-2">
            <Code2 className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold">70 animated text effects</span>
          </div>
          <p className="text-[11px] text-[#A1A1A1] leading-relaxed">
            copy the prompt. generate.
            <br />
            ship something great.
          </p>
        </div>
      </div>
    </aside>
  );
};

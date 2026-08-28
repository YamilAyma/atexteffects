import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_EFFECTS, EFFECTS_MAP } from './data/effects';
import { CATEGORIES } from './data/categories';
import { Effect, ToastInfo } from './types';
import {
  copyEffectPrompt,
  copyEffectWithDetails,
  copyToClipboard,
  copyAllFavoritesPrompts,
} from './services/clipboard';
import { getStoredFavorites, saveStoredFavorites } from './services/favorites';
import { useHashRoute } from './hooks/useHashRoute';
import { useReducedMotion } from './hooks/useReducedMotion';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileCategoryBar } from './components/MobileCategoryBar';
import { EffectCard } from './components/EffectCard';
import { EffectModal } from './components/EffectModal';
import { Toast } from './components/Toast';
import { ShortcutsModal } from './components/ShortcutsModal';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';

export default function App() {
  const { route, navigateCategory, navigateEffect } = useHashRoute();
  const { shouldReduceMotion, setOverride } = useReducedMotion();

  // State
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffleSeed, setShuffleSeed] = useState<number | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Sync hash route with modal or category
  useEffect(() => {
    if (route.effectId) {
      const eff = EFFECTS_MAP.get(route.effectId);
      if (eff) {
        setSelectedEffect(eff);
      }
    }
  }, [route.effectId]);

  // Persist favorites
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveStoredFavorites(next);
      const isNowFav = next.includes(id);
      showToast(isNowFav ? 'saved to favorites' : 'removed from favorites');
      return next;
    });
  }, []);

  // Toast Helper
  const showToast = (message: string, tone: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, tone });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  // Copy Actions
  const handleCopyPrompt = useCallback(async (effect: Effect) => {
    const success = await copyEffectPrompt(effect);
    if (success) {
      showToast('prompt copied to clipboard');
    } else {
      showToast('could not copy prompt', 'error');
    }
  }, []);

  const handleCopyWithDetails = useCallback(async (effect: Effect) => {
    const success = await copyEffectWithDetails(effect);
    if (success) {
      showToast('prompt details copied to clipboard');
    }
  }, []);

  const handleCopyPermalink = useCallback(async (effect: Effect) => {
    const url = `${window.location.origin}${window.location.pathname}#effect/${effect.id}`;
    const success = await copyToClipboard(url);
    if (success) {
      showToast('permalink copied to clipboard');
    }
  }, []);

  const handleCopyAllFavorites = useCallback(async () => {
    const favEffects = ALL_EFFECTS.filter((e) => favorites.includes(e.id));
    if (favEffects.length === 0) return;
    await copyAllFavoritesPrompts(favEffects);
    showToast(`copied ${favEffects.length} favorites to clipboard`);
  }, [favorites]);

  // Shuffle action
  const handleShuffle = useCallback(() => {
    setShuffleSeed(Date.now());
    showToast('shuffled catalog order');
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const eff of ALL_EFFECTS) {
      counts[eff.categoryId] = (counts[eff.categoryId] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtering
  const filteredEffects = useMemo(() => {
    let list = [...ALL_EFFECTS];

    // Category filter
    if (route.category === 'favorites') {
      list = list.filter((e) => favorites.includes(e.id));
    } else if (route.category !== 'all') {
      list = list.filter((e) => e.categoryId === route.category);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.categoryId.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Shuffle
    if (shuffleSeed !== null) {
      list.sort((a, b) => {
        const hashA = (a.id + shuffleSeed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = (b.id + shuffleSeed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hashA % 100) - (hashB % 100);
      });
    }

    return list;
  }, [route.category, favorites, searchQuery, shuffleSeed]);

  // Active Category Info
  const activeCategoryObj = CATEGORIES.find((c) => c.id === route.category);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          setSearchQuery('');
          (target as HTMLInputElement).blur();
        }
        return;
      }

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      } else if (e.key === 's') {
        e.preventDefault();
        handleShuffle();
      } else if (e.key === 'f') {
        e.preventDefault();
        navigateCategory(route.category === 'favorites' ? 'all' : 'favorites');
      } else if (e.key === 'a') {
        e.preventDefault();
        navigateCategory('all');
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShuffle, navigateCategory, route.category]);

  const handleOpenModal = (effect: Effect) => {
    setSelectedEffect(effect);
    navigateEffect(effect.id, route.category);
  };

  const handleCloseModal = () => {
    setSelectedEffect(null);
    navigateEffect(null, route.category);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col selection:bg-white/20 selection:text-white">
      {/* Header (64px fixed) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShuffle={handleShuffle}
        favoritesCount={favorites.length}
        isFavoritesView={route.category === 'favorites'}
        onToggleFavoritesView={() =>
          navigateCategory(route.category === 'favorites' ? 'all' : 'favorites')
        }
        onResetView={() => {
          setSearchQuery('');
          setShuffleSeed(null);
          navigateCategory('all');
        }}
      />

      {/* Mobile Category Bar */}
      <MobileCategoryBar
        activeCategory={route.category}
        onSelectCategory={(catId) => {
          setSearchQuery('');
          navigateCategory(catId);
        }}
        favoritesCount={favorites.length}
        onSelectFavorites={() => navigateCategory('favorites')}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (260px) */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar
            activeCategory={route.category}
            onSelectCategory={(catId) => {
              setSearchQuery('');
              navigateCategory(catId);
            }}
            totalEffectsCount={ALL_EFFECTS.length}
            categoryCounts={categoryCounts}
            favoritesCount={favorites.length}
            onSelectFavorites={() => navigateCategory('favorites')}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {route.category === 'all'
                      ? 'all effects'
                      : route.category === 'favorites'
                      ? 'favorites'
                      : activeCategoryObj?.name || route.category}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#161616] text-[#A1A1A1] border border-[#1E1E1E] font-mono">
                    {filteredEffects.length} of {ALL_EFFECTS.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1A1] mt-1">
                  {route.category === 'all'
                    ? '70 curated animated text effects with agnostic prompts for any stack'
                    : route.category === 'favorites'
                    ? 'your saved personal typography inspiration collection'
                    : activeCategoryObj?.description || 'curated animation specimens'}
                </p>
              </div>

              {/* Favorites action (Copy all favorites) */}
              {route.category === 'favorites' && filteredEffects.length > 0 && (
                <button
                  onClick={handleCopyAllFavorites}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-[#E5E5E5] transition-all cursor-pointer shadow"
                >
                  copy all favorites ({filteredEffects.length})
                </button>
              )}
            </div>

            {/* Effects Grid */}
            {filteredEffects.length === 0 ? (
              <EmptyState
                type={route.category === 'favorites' ? 'favorites' : 'search'}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                onExploreAll={() => navigateCategory('all')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredEffects.map((effect) => (
                  <EffectCard
                    key={effect.id}
                    effect={effect}
                    isFavorite={favorites.includes(effect.id)}
                    onToggleFavorite={toggleFavorite}
                    onCopyPrompt={handleCopyPrompt}
                    onOpenModal={handleOpenModal}
                    onTagClick={(tag) => setSearchQuery(tag)}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Global Bottom Circuit Footer */}
      <Footer
        onSelectCategory={navigateCategory}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        shouldReduceMotion={shouldReduceMotion}
        onToggleMotion={() => setOverride(!shouldReduceMotion)}
        onShowToast={(msg) => showToast(msg)}
      />

      {/* Modal View */}
      <EffectModal
        effect={selectedEffect}
        isOpen={Boolean(selectedEffect)}
        onClose={handleCloseModal}
        isFavorite={Boolean(selectedEffect && favorites.includes(selectedEffect.id))}
        onToggleFavorite={toggleFavorite}
        onCopyPrompt={handleCopyPrompt}
        onCopyWithDetails={handleCopyWithDetails}
        onCopyPermalink={handleCopyPermalink}
        shouldReduceMotion={shouldReduceMotion}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

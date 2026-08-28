import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  category: string; // 'all' | 'favorites' | categoryId
  effectId: string | null;
}

export function useHashRoute() {
  const parseHash = useCallback((): RouteState => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      return { category: 'all', effectId: null };
    }

    if (hash === 'favorites') {
      return { category: 'favorites', effectId: null };
    }

    if (hash.startsWith('category/')) {
      const cat = hash.replace('category/', '');
      return { category: cat || 'all', effectId: null };
    }

    if (hash.startsWith('effect/')) {
      const eff = hash.replace('effect/', '');
      return { category: 'all', effectId: eff || null };
    }

    return { category: 'all', effectId: null };
  }, []);

  const [route, setRoute] = useState<RouteState>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseHash]);

  const navigateCategory = useCallback((category: string) => {
    if (category === 'all') {
      window.location.hash = '';
    } else if (category === 'favorites') {
      window.location.hash = 'favorites';
    } else {
      window.location.hash = `category/${category}`;
    }
  }, []);

  const navigateEffect = useCallback((effectId: string | null, fallbackCategory = 'all') => {
    if (!effectId) {
      if (fallbackCategory === 'all') {
        window.location.hash = '';
      } else if (fallbackCategory === 'favorites') {
        window.location.hash = 'favorites';
      } else {
        window.location.hash = `category/${fallbackCategory}`;
      }
    } else {
      window.location.hash = `effect/${effectId}`;
    }
  }, []);

  return { route, navigateCategory, navigateEffect };
}

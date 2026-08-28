import { useState, useEffect } from 'react';

const REDUCED_MOTION_KEY = 'atexteffects:reduced-motion-override';

export function useReducedMotion() {
  const [systemPreference, setSystemPreference] = useState(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(() => {
    try {
      const stored = localStorage.getItem(REDUCED_MOTION_KEY);
      return stored !== null ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPreference(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setOverride = (val: boolean | null) => {
    setManualOverride(val);
    try {
      if (val === null) {
        localStorage.removeItem(REDUCED_MOTION_KEY);
      } else {
        localStorage.setItem(REDUCED_MOTION_KEY, JSON.stringify(val));
      }
    } catch (err) {
      console.warn('Failed to save reduced motion override', err);
    }
  };

  const shouldReduceMotion = manualOverride !== null ? manualOverride : systemPreference;

  return {
    shouldReduceMotion,
    manualOverride,
    systemPreference,
    setOverride,
  };
}

const FAVORITES_KEY = 'atexteffects:favorites';

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === 'string');
    }
  } catch (err) {
    console.warn('Could not read favorites from localStorage', err);
  }
  return [];
}

export function saveStoredFavorites(favorites: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.warn('Could not write favorites to localStorage', err);
  }
}

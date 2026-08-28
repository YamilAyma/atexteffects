export type AnimFamily =
  | 'per-char-stagger'
  | 'scramble-cycle'
  | 'transform-loop'
  | 'clip-mask'
  | 'blur-optical'
  | 'luminance-sweep'
  | 'flicker'
  | 'slice-offset'
  | 'pointer-reactive'
  | 'shadow-layer'
  | 'variable-axis'
  | 'swap-cycle';

export type Difficulty = 'simple' | 'medium' | 'intricate';

export interface Effect {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  prompt: string;
  tags: string[];
  animType: AnimFamily;
  loop: boolean;
  durationMs: number;
  sampleText: string;
  difficulty: Difficulty;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  order: number;
}

export interface ToastInfo {
  id: string;
  message: string;
  tone?: 'success' | 'info' | 'error';
}

export interface FilterState {
  activeCategory: string; // 'all' | 'favorites' | categoryId
  searchQuery: string;
  shuffleSeed: number | null;
}

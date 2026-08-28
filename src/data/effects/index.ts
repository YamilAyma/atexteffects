import { Effect } from '../../types';
import { REVEAL_EFFECTS } from './reveal';
import { GLITCH_EFFECTS } from './glitch';
import { KINETIC_EFFECTS } from './kinetic';
import { INTERACTIVE_EFFECTS } from './interactive';
import { DISTORTION_EFFECTS } from './distortion';
import { LIGHT_EFFECTS } from './light';
import { STROKE_EFFECTS } from './stroke';
import { DEPTH_EFFECTS } from './depth';
import { MORPH_EFFECTS } from './morph';
import { AMBIENT_EFFECTS } from './ambient';

export const ALL_EFFECTS: Effect[] = [
  ...REVEAL_EFFECTS,
  ...GLITCH_EFFECTS,
  ...KINETIC_EFFECTS,
  ...INTERACTIVE_EFFECTS,
  ...DISTORTION_EFFECTS,
  ...LIGHT_EFFECTS,
  ...STROKE_EFFECTS,
  ...DEPTH_EFFECTS,
  ...MORPH_EFFECTS,
  ...AMBIENT_EFFECTS,
];

// Verify 110 items
if (ALL_EFFECTS.length !== 110) {
  console.warn(`Expected 110 effects, found ${ALL_EFFECTS.length}`);
}

export const EFFECTS_MAP = new Map<string, Effect>(
  ALL_EFFECTS.map((eff) => [eff.id, eff])
);

export const EFFECTS_BY_CATEGORY: Record<string, Effect[]> = {
  reveal: REVEAL_EFFECTS,
  glitch: GLITCH_EFFECTS,
  kinetic: KINETIC_EFFECTS,
  interactive: INTERACTIVE_EFFECTS,
  distortion: DISTORTION_EFFECTS,
  light: LIGHT_EFFECTS,
  stroke: STROKE_EFFECTS,
  depth: DEPTH_EFFECTS,
  morph: MORPH_EFFECTS,
  ambient: AMBIENT_EFFECTS,
};

import { DifficultyModifier } from '../types';

export const NEW_HEX_COUNT_INITIAL = 3 as const;
export const HEX_HIGH_VALUE_PROBABILITY = 50 as const;
export const GAME_DIFFICULTY_THRESHOLD = 80 as const;
export const HEX_COUNT_RADIUS_1 = 1 as const;
export const SMALL_HEX_BASE_COUNT = 1 as const;
export const LARGE_HEX_BASE_COUNT = 2 as const;
export const DIFFICULTY_MODIFIER: DifficultyModifier = {
  1: 0,
  2: 10,
  3: 15,
} as const;
export const HEX_COUNT_MODIFIER: DifficultyModifier = {
  1: 0,
  2: 0,
  3: 1,
  4: 2,
} as const;

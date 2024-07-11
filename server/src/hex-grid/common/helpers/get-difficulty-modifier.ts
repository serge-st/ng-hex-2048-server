import { DIFFICULTY_MODIFIER } from '../constants';

export const getDifficultyModifier = (radius: number): number => {
  if (radius < 1) return DIFFICULTY_MODIFIER[1];
  const difficultyModifierKey = radius < 3 ? radius : 3;
  return DIFFICULTY_MODIFIER[difficultyModifierKey];
};

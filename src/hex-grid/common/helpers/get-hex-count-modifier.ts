import { HEX_COUNT_MODIFIER } from '../constants';

export const getHexCountModifier = (radius: number): number => {
  if (radius < 1) return HEX_COUNT_MODIFIER[1];
  const hexCountModifierKey = radius < 4 ? radius : 4;
  return HEX_COUNT_MODIFIER[hexCountModifierKey];
};

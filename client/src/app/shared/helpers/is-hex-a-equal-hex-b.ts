import { HexData } from '@app/shared/interfaces';
import { HexDataKey } from '../types';

export const isHexAEqualHexB = (hexA: HexData, hexB: HexData, checkValue = false): boolean => {
  if (!hexA || !hexB) return false;
  const keysToCompare: HexDataKey[] = ['q', 's', 'r'];
  if (checkValue) keysToCompare.push('value');
  const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
  return !hasMismatch;
};

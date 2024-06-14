import { HexCoord, HexData } from '@app/shared/interfaces';
import { HexCoordKey, HexDataKey } from '../types';
import { isHexData } from './is-hex-data';

export const isHexAEqualHexB = (hexA: HexData, hexB: HexData, checkValue = false): boolean => {
  if (!hexA || !hexB) return false;
  const keysToCompare: HexDataKey[] = ['q', 's', 'r'];
  if (checkValue) keysToCompare.push('value');
  const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
  return !hasMismatch;
};

export const isHexAEqualHexBNew = (hexA: HexCoord | HexData, hexB: HexCoord | HexData): boolean => {
  if (!hexA || !hexB) return false;

  const compareValue = isHexData(hexA) && isHexData(hexB);
  const hexCoordKeys: HexCoordKey[] = ['q', 's', 'r'];

  let hasMismatch: boolean;

  if (compareValue) {
    const hexDataKeys = [...hexCoordKeys, 'value'] as HexDataKey[];
    hasMismatch = hexDataKeys.some((key) => hexA[key] !== hexB[key]);
  } else {
    hasMismatch = hexCoordKeys.some((key) => hexA[key] !== hexB[key]);
  }

  return !hasMismatch;
};

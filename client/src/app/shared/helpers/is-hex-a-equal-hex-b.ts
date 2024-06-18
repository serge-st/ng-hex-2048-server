import { HexCoord, HexData } from '@app/shared/interfaces';
import { HexCoordKey, HexDataKey } from '../types';
import { isHexData } from './is-hex-data';

export const isHexAEqualHexB = (hexA: HexCoord | HexData, hexB: HexCoord | HexData): boolean => {
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

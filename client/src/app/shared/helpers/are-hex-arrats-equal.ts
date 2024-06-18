import { HexCoord, HexData } from '../interfaces';
import { isHexAEqualHexBNew } from './is-hex-a-equal-hex-b';

export const areHexArraysEqual = (prev: HexCoord[] | HexData[], curr: HexCoord[] | HexData[]): boolean => {
  const hasMismatch = curr.some((currentHex, i) => !isHexAEqualHexBNew(currentHex, prev[i]));
  return !hasMismatch;
};

import { HexCoord, HexData } from '../interfaces';
import { isHexAEqualHexB } from './is-hex-a-equal-hex-b';

export const areHexArraysEqual = (prev: HexCoord[] | HexData[], curr: HexCoord[] | HexData[]): boolean => {
  const hasMismatch = curr.some((currentHex, i) => !isHexAEqualHexB(currentHex, prev[i]));
  return !hasMismatch;
};

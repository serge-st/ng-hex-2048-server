import { isHexAEqualHexB } from './is-hex-a-equal-hex-b';
import { HexCoord, HexData } from '../interfaces';

export const isSameHexArray = (prev: HexCoord[] | HexData[], curr: HexCoord[] | HexData[]): boolean => {
  if (prev.length !== curr.length) return false;

  const hasMismatch = curr.some((currentHex, index) => {
    return !isHexAEqualHexB(currentHex, prev[index]);
  });

  return !hasMismatch;
};

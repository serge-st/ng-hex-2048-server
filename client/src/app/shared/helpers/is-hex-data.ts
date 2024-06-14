import { HexCoord, HexData } from '../interfaces';

export const isHexData = (hex: HexCoord | HexData): hex is HexData => {
  return 'value' in hex;
};

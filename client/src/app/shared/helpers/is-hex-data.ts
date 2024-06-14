import { HexCoord, HexDataNew } from '../interfaces';

export const isHexData = (hex: HexCoord | HexDataNew): hex is HexDataNew => {
  return 'value' in hex;
};

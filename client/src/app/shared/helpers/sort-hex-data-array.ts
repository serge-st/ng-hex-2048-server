import { HexData } from '../interfaces';

export const sortHexDataArray = (hexDataArray: HexData[]): HexData[] => {
  return hexDataArray.sort((el1, el2) => {
    if (el1.q !== el2.q) return el1.q - el2.q;
    if (el1.r !== el2.r) return el1.r - el2.r;
    if (el1.s !== el2.s) return el1.s - el2.s;
    return el1.value - el2.value;
  });
};

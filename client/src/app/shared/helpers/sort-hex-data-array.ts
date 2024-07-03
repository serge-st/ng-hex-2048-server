import { HexData } from '../interfaces';

export const sortHexDataArray = (hexDataArray: HexData[]): HexData[] => {
  return hexDataArray.sort((el1, el2) => el1.id - el2.id);
};

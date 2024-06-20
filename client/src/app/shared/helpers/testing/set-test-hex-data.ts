import { HexData } from '@app/shared/interfaces';

export const getTestHexData = (radius: number = 3): HexData[] => {
  const hexData: HexData[] = [
    { q: 1, r: 1, s: -2, value: 4, id: 1 },
    { q: -1, r: -1, s: 2, value: 3, id: 2 },
    { q: 1, r: -1, s: 0, value: 3, id: 3 },
    { q: 0, r: 1, s: -1, value: 1, id: 4 },
    { q: 2, r: -1, s: -1, value: 3, id: 5 },
    { q: 3, r: -1, s: -2, value: 3, id: 6 },
  ].filter((el) => Math.abs(el.q) <= radius && Math.abs(el.r) <= radius && Math.abs(el.s) <= radius);

  return hexData.sort(() => Math.random() - 0.5);
};

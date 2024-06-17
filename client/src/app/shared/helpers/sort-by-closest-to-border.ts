import { HexData } from '../interfaces';

type SortCallback = (el1: HexData, el2: HexData) => number;

export const sortByClosestToBorder: SortCallback[] = [
  // PLUS_S
  (el1, el2) => el2.s - el1.s,
  // MINUS_R
  (el1, el2) => el1.r - el2.r,
  // PLUS_Q
  (el1, el2) => el2.q - el1.q,
  // MINUS_Q
  (el1, el2) => el1.q - el2.q,
  // PLUS_R
  (el1, el2) => el2.r - el1.r,
  // MINUS_S
  (el1, el2) => el1.s - el2.s,
];

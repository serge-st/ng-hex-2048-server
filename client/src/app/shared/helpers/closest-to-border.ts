import { HexData } from '../interfaces';
import { Direction } from '../types';

type ArraySortCallback = (el1: HexData, el2: HexData) => number;

export const CLOSEST_TO_BORDER: Record<Direction, ArraySortCallback> = {
  PLUS_S_COORD: (el1, el2) => el2.s - el1.s,
  MINUS_R_COORD: (el1, el2) => el1.r - el2.r,
  PLUS_Q_COORD: (el1, el2) => el2.q - el1.q,
  MINUS_Q_COORD: (el1, el2) => el1.q - el2.q,
  PLUS_R_COORD: (el1, el2) => el2.r - el1.r,
  MINUS_S_COORD: (el1, el2) => el1.s - el2.s,
} as const;

import { HexCoord } from '../interfaces';

export const DIRECTION = {
  PLUS_S: 0,
  MINUS_R: 1,
  PLUS_Q: 2,
  MINUS_Q: 3,
  PLUS_R: 4,
  MINUS_S: 5,
} as const;

export const DIRECTIONS: HexCoord[] = [
  // PLUS_S
  // Q clicked -> move +s, r stays the same
  { q: -1, r: 0, s: 1 },
  // MINUS_R
  // W clicked -> move -r, q stays the same
  { q: 0, r: -1, s: 1 },
  // PLUS_Q
  // E clicked -> move +q, s stays the same
  { q: 1, r: -1, s: 0 },
  // MINUS_Q
  // A clicked -> move -q, s stays the same
  { q: -1, r: 1, s: 0 },
  // PLUS_R
  // S clicked -> move +r, q stays the same
  { q: 0, r: 1, s: -1 },
  // MINUS_S
  // D clicked -> move -s, r stays the same
  { q: 1, r: 0, s: -1 },
] as const;

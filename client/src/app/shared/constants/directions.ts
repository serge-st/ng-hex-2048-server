import { HexCoord } from '../interfaces';
import { Direction } from '../types';

export const DIRECTION = {
  Q: 'PLUS_S_COORD',
  W: 'MINUS_R_COORD',
  E: 'PLUS_Q_COORD',
  A: 'MINUS_Q_COORD',
  S: 'PLUS_R_COORD',
  D: 'MINUS_S_COORD',
} as const;

export const DIRECTIONS: Record<Direction, HexCoord> = {
  // Q clicked -> move +s, r stays the same
  PLUS_S_COORD: { q: -1, r: 0, s: 1 },
  // W clicked -> move -r, q stays the same
  MINUS_R_COORD: { q: 0, r: -1, s: 1 },
  // E clicked -> move +q, s stays the same
  PLUS_Q_COORD: { q: 1, r: -1, s: 0 },
  // A clicked -> move -q, s stays the same
  MINUS_Q_COORD: { q: -1, r: 1, s: 0 },
  // S clicked -> move +r, q stays the same
  PLUS_R_COORD: { q: 0, r: 1, s: -1 },
  // D clicked -> move -s, r stays the same
  MINUS_S_COORD: { q: 1, r: 0, s: -1 },
} as const;

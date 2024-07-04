import { DirectionKey } from '../types';

export const KEY_DIRECTION_MAPPING: Record<KeyboardEvent['code'], DirectionKey> = {
  KeyQ: 'Q',
  KeyW: 'W',
  KeyE: 'E',
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
} as const;

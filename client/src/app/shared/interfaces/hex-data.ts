import { HexAnimation } from '../types';
import { HexCoordWithValue } from './hex-coord-with-value';

export interface HexData extends HexCoordWithValue {
  id: number;
  animation?: HexAnimation;
}

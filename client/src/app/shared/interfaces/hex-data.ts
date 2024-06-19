import { HexAnimation } from '../types';
import { HexCoord } from './hex-coord';

export interface HexData extends HexCoord {
  value: number;
  animation?: HexAnimation;
  id?: number;
}

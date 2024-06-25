import { HexCoord } from './hex-coord';

export interface HexCoordWithValue extends HexCoord {
  value: number;
}

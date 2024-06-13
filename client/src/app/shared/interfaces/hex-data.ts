import { HexCoord } from './hex-coord';

export interface HexData extends HexCoord {
  value?: number;
}

export interface HexDataNew extends HexCoord {
  value: number;
}

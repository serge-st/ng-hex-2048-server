import { HexCoord, HexData } from '@app/shared/interfaces';

export interface HexManagementState {
  hexData: HexData[];
  hexesToDelete: HexData[];
  backgroundHexCoords: HexCoord[];
  isAnimatingOrTransitioning: boolean;
}

export type HexManagementStateKey = keyof HexManagementState;

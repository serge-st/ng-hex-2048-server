import { HexData } from '@app/shared/interfaces';

export interface HexManagementState {
  hexData: HexData[];
  backgroundHexData: HexData[];
}

export type HexManagementStateKey = keyof HexManagementState;

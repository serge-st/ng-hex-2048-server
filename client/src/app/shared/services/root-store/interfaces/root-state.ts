import { GameSetupState } from '@app/shared/services/game-setup';
import { HexManagementState } from '@app/shared/services/hex-management';

export interface RootState {
  gameSetup: GameSetupState;
  hexManagement: HexManagementState;
}

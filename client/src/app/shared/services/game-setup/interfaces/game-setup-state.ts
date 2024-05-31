import { GameState } from '@app/shared/types';

export interface GameSetupState {
  radius: number;
  gap: number;
  hexWidth: number;
  gameState: GameState;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameSetupState } from './interfaces/game-setup-state';
import { GameState } from '@app/shared/types';

const initialState: GameSetupState = {
  radius: 2,
  gap: 4,
  hexWidth: 100,
  gameState: 'setup',
};

@Injectable({
  providedIn: 'root',
})
export class GameSetupService {
  private readonly state = new BehaviorSubject<GameSetupState>(initialState);

  readonly state$: Observable<GameSetupState> = this.state.asObservable();

  private getState(): GameSetupState {
    return this.state.value;
  }

  // TODO: remove whereFrom after testing
  private setState(newState: Partial<GameSetupState>, whereFrom?: string): void {
    this.state.next({ ...this.getState(), ...newState });
    // TODO remove afer testing
    console.log(`New state: ${whereFrom}`, this.getState());
  }

  setRadius(radius: number, whereFrom?: string): void {
    this.setState({ radius }, whereFrom);
  }

  setGap(gap: number, whereFrom?: string): void {
    this.setState({ gap }, whereFrom);
  }

  setHexWidth(hexWidth: number, whereFrom?: string): void {
    this.setState({ hexWidth }, whereFrom);
  }

  setGameState(gameState: GameState, whereFrom?: string): void {
    this.setState({ gameState }, whereFrom);
  }

  getGameState(): GameState {
    return this.getState().gameState;
  }
}

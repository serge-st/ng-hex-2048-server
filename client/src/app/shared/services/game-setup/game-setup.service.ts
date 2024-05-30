import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameSetupState } from './interfaces/game-setup-state';

const initialState: GameSetupState = {
  radius: 1,
  gap: 4,
  hexWidth: 200,
  isGameInProgress: false,
};

@Injectable({
  providedIn: 'root',
})
export class GameSetupService {
  private state = new BehaviorSubject<GameSetupState>(initialState);

  state$: Observable<GameSetupState> = this.state.asObservable();

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

  setIsGameInProgress(isGameInProgress: boolean, whereFrom?: string): void {
    this.setState({ isGameInProgress }, whereFrom);
  }
}

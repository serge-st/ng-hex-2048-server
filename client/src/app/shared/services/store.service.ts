import { Injectable } from '@angular/core';
import { State } from './state';
import { BehaviorSubject, Observable } from 'rxjs';

const initialState: State = {
  radius: 1,
  gap: 4,
  hexWidth: 200,
  isGameInProgress: false,
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private state = new BehaviorSubject<State>(initialState);

  state$: Observable<State> = this.state.asObservable();

  getState(): State {
    return this.state.value;
  }

  // TODO: remove whereFrom after testing
  private setState(newState: Partial<State>, whereFrom?: string): void {
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

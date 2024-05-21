import { Injectable } from '@angular/core';
import { State } from './state';
import { BehaviorSubject, Observable } from 'rxjs';

const initialState: State = {
  radius: 1,
  gap: 0,
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

  setState(newState: Partial<State>): void {
    this.state.next({ ...this.getState(), ...newState });
    // !! TODO: remove after testing
    console.log('new state', this.state.value);
  }

  setRadius(radius: number): void {
    this.setState({ radius });
  }

  setGap(gap: number): void {
    this.setState({ gap });
  }
}

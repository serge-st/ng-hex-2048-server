import { Injectable } from '@angular/core';
import { State } from './state';
import { BehaviorSubject, Observable } from 'rxjs';

const initialState: State = {
  radius: 1,
  gap: 0,
  hexWidth: 200,
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

  private setState(newState: Partial<State>): void {
    this.state.next({ ...this.getState(), ...newState });
    // !! TODO remove afer testing
    console.log('New state:', this.getState());
  }

  setRadius(radius: number): void {
    this.setState({ radius });
  }

  setGap(gap: number): void {
    this.setState({ gap });
  }

  setHexWidth(hexWidth: number): void {
    this.setState({ hexWidth });
  }
}

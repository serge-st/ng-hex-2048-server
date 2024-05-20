import { Injectable } from '@angular/core';
import { State } from './state';

const initialState: State = {
  radius: 1,
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  state: State = initialState;
}

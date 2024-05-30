import { Injectable } from '@angular/core';
import { RootState } from './interfaces/root-state';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { HexData } from '@app/shared/interfaces';
import { GameSetupService } from '../game-setup';
import { HexManagementService } from '../hex-management';

@Injectable({
  providedIn: 'root',
})
export class RootStoreService {
  constructor(
    private gameSetupService: GameSetupService,
    private hexManagementService: HexManagementService,
  ) {}
  // TODO: implement this
  // private state = new BehaviorSubject<RootState>(merge(this.gameSetupService.state$, this.hexManagementService.state$));
  // state$: Observable<RootState> = this.state.asObservable();
}

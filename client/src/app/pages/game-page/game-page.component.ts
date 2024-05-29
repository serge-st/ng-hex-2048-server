import { Component } from '@angular/core';
import { GridComponent } from '@app/grid/grid.component';
import { GameSetupComponent } from '@app/game-setup';
import { GameControlComponent } from '@app/game-control';
import { StoreService } from '@app/shared/services';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent, GameSetupComponent, GameControlComponent, AsyncPipe, NgIf],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {
  isGameInProgress$!: Observable<boolean>;

  constructor(readonly storeService: StoreService) {
    this.isGameInProgress$ = this.storeService.state$.pipe(map((state) => state.isGameInProgress));
  }
}

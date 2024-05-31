import { Component } from '@angular/core';
import { GridComponent } from '@app/grid';
import { GameSetupComponent } from '@app/game-setup';
import { GameControlComponent } from '@app/game-control';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { GameSetupService } from '@app/shared/services/game-setup';
import { GameState } from '@app/shared/types';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent, GameSetupComponent, GameControlComponent, AsyncPipe, NgIf],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {
  gameState$!: Observable<GameState>;

  constructor(readonly gameSetupService: GameSetupService) {
    this.gameState$ = this.gameSetupService.state$.pipe(map((state) => state.gameState));
  }
}

import { Component } from '@angular/core';
import { GridComponent } from '@app/grid';
import { GameControlComponent } from '@app/game-control';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { GameSetupService } from '@app/shared/services/game-setup';
import { GameState } from '@app/shared/types';
import { GameOverControlComponent } from '@app/game-over-control/game-over-control.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HexManagementService } from '@app/shared/services/hex-management';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent, GameControlComponent, GameOverControlComponent, AsyncPipe, NgIf, JsonPipe],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {
  gameState$!: Observable<GameState>;

  error: any;

  constructor(
    private readonly gameSetupService: GameSetupService,
    private readonly hexManagementService: HexManagementService,
  ) {
    this.gameState$ = this.gameSetupService.state$.pipe(map((state) => state.gameState));

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => prev.error === curr.error))
      .subscribe((state) => {
        this.error = state.error;
      });
  }

  get isInProgress$(): Observable<boolean> {
    return this.gameState$.pipe(map((state) => state === 'in-progress'));
  }

  get isGameOver$(): Observable<boolean> {
    return this.gameState$.pipe(map((state) => state === 'game-over'));
  }

  get isWin$(): Observable<boolean> {
    return this.gameState$.pipe(map((state) => state === 'win'));
  }
}

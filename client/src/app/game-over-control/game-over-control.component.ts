import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';

@Component({
  selector: 'app-game-over-control',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-over-control.component.html',
  styleUrl: './game-over-control.component.scss',
})
export class GameOverControlComponent {
  constructor(
    private readonly gameSetupService: GameSetupService,
    private readonly hexManagementService: HexManagementService,
  ) {}

  // TODO: Fix, if restart is pressed and server returns [] -> game over status is not set
  restartGame(): void {
    this.hexManagementService.setHexData([], `GameOverControlComponent.restartGame(`);
    this.gameSetupService.setGameState('in-progress', `GameOverControlComponent.restartGame()`);
  }
}

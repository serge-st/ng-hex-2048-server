import { Component } from '@angular/core';
import { GameControlComponent } from '@app/game-control';
import { GridComponent } from '@app/grid';
import { GameSetupService } from '@app/shared/services/game-setup';

@Component({
  selector: 'app-testing-contol-page',
  standalone: true,
  imports: [GridComponent, GameControlComponent],
  templateUrl: './testing-contol-page.component.html',
  styleUrls: ['../pages-styles.scss', './testing-contol-page.component.scss'],
})
export class TestingContolPageComponent {
  constructor(private readonly gameSetupService: GameSetupService) {
    this.gameSetupService.setGameState('setup', 'TestingContolPageComponent');
    this.gameSetupService.setRadius(3, 'TestingContolPageComponent');
    this.gameSetupService.setHexWidth(100, 'TestingContolPageComponent');

    setTimeout(() => {
      this.gameSetupService.setGameState('in-progress', 'TestingContolPageComponent');
    }, 20);
  }
}

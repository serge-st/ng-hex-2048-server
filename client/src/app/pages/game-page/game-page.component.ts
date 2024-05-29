import { Component } from '@angular/core';
import { GridComponent } from '@app/grid/grid.component';
import { GameSetupComponent } from '@app/game-setup';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent, GameSetupComponent],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {}

import { Component } from '@angular/core';
import { GridComponent } from '@app/grid/grid.component';
import { GameSetupFormComponent } from '@app/game-setup-form';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent, GameSetupFormComponent],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {}

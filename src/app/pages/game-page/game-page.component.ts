import { Component } from '@angular/core';
import { GridComponent } from '../../grid/grid.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [GridComponent],
  templateUrl: './game-page.component.html',
  styleUrls: ['../pages-styles.scss', './game-page.component.scss'],
})
export class GamePageComponent {

}

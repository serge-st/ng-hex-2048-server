import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HexagonComponent } from './hexagon/hexagon.component';
import { GamePageComponent } from './pages/game-page/game-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HexagonComponent, GamePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-hex-2048';
}

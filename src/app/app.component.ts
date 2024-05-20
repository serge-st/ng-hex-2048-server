import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamePageComponent } from '@app/pages';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GamePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-hex-2048';
}

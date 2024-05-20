import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '@app/shared/services';

@Component({
  selector: 'app-game-setup-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game-setup-form.component.html',
  styleUrl: './game-setup-form.component.scss',
})
export class GameSetupFormComponent {
  public radius: string;
  constructor(public storeService: StoreService) {
    this.radius = this.storeService.state.radius.toString();
  }

  setRadius(radius: string) {
    this.storeService.state.radius = Number(radius);
  }
}

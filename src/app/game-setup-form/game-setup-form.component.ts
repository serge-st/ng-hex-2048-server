import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService } from '@app/shared/services';
import { State } from '@app/shared/services/state';

@Component({
  selector: 'app-game-setup-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game-setup-form.component.html',
  styleUrl: './game-setup-form.component.scss',
})
export class GameSetupFormComponent implements OnInit {
  currentState!: State;

  constructor(private storeService: StoreService) {}

  setRadius(radius: string): void {
    this.storeService.setRadius(Number(radius));
  }

  setGap(gap: string): void {
    this.storeService.setGap(Number(gap));
  }

  ngOnInit(): void {
    this.storeService.state$.subscribe((state) => {
      this.currentState = state;
    });
  }

  // !! TODO Remove after testing
  ngDoCheck(): void {
    console.log('GameSetupForm component rendered', Math.random());
  }
}

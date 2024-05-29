import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberInputComponent } from '@app/number-input/number-input.component';
import { StoreService } from '@app/shared/services';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-game-setup-form',
  standalone: true,
  imports: [FormsModule, NumberInputComponent, NgIf, AsyncPipe],
  templateUrl: './game-setup-form.component.html',
  styleUrl: './game-setup-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupFormComponent {
  radius$!: Observable<number>;
  gap$!: Observable<number>;
  hexWidth$!: Observable<number>;
  isGameInProgress$!: Observable<boolean>;

  constructor(readonly storeService: StoreService) {
    this.radius$ = this.storeService.state$.pipe(map((state) => state.radius));
    this.gap$ = this.storeService.state$.pipe(map((state) => state.gap));
    this.hexWidth$ = this.storeService.state$.pipe(map((state) => state.hexWidth));
    this.isGameInProgress$ = this.storeService.state$.pipe(map((state) => state.isGameInProgress));
  }

  startGame() {
    this.storeService.setIsGameInProgress(true);
  }
}

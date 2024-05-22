import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@app/input/input.component';
import { StoreService } from '@app/shared/services';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-game-setup-form',
  standalone: true,
  imports: [FormsModule, InputComponent, AsyncPipe],
  templateUrl: './game-setup-form.component.html',
  styleUrl: './game-setup-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupFormComponent {
  radius$!: Observable<number>;
  gap$!: Observable<number>;

  constructor(private storeService: StoreService) {
    this.radius$ = this.storeService.state$.pipe(map((state) => state.radius));
    this.gap$ = this.storeService.state$.pipe(map((state) => state.gap));
  }

  setRadius(radius: string): void {
    this.storeService.setRadius(Number(radius));
  }

  setGap(gap: string): void {
    this.storeService.setGap(Number(gap));
  }
}

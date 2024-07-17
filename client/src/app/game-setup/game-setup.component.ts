import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent, NumberInputComponent } from '@app/shared/components/UI';
import { LinkComponent } from '@app/shared/components/UI/link/link.component';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { GameState } from '@app/shared/types';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [FormsModule, NumberInputComponent, AsyncPipe, RouterLink, ButtonComponent, LinkComponent],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupComponent implements OnInit {
  radius$!: Observable<number>;
  gap$!: Observable<number>;
  hexWidth$!: Observable<number>;
  gameState$!: Observable<GameState>;

  constructor(
    readonly gameSetupService: GameSetupService,
    private readonly hexManagementService: HexManagementService,
  ) {
    this.radius$ = this.gameSetupService.state$.pipe(map((state) => state.radius));
    this.gap$ = this.gameSetupService.state$.pipe(map((state) => state.gap));
    this.hexWidth$ = this.gameSetupService.state$.pipe(map((state) => state.hexWidth));
    this.gameState$ = this.gameSetupService.state$.pipe(map((state) => state.gameState));
  }

  ngOnInit(): void {
    if (this.gameSetupService.getGameState() !== 'setup') {
      this.gameSetupService.setGameState('setup', 'GameSetupComponent.ngOnInit()');
    }

    if (this.hexManagementService.getHexData().length > 0) {
      this.hexManagementService.setHexData([], 'GameSetupComponent.ngOnInit()');
    }
  }

  startGame(): void {
    this.gameSetupService.setGameState('in-progress', `GameSetupComponent.startGame: setIsGameInProgress`);
  }
}

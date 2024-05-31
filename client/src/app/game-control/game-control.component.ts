import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HexData } from '@app/shared/interfaces';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-game-control',
  standalone: true,
  imports: [],
  templateUrl: './game-control.component.html',
  styleUrl: './game-control.component.scss',
})
export class GameControlComponent implements OnInit {
  radius!: number;

  constructor(
    private gameSetupService: GameSetupService,
    private hexManagementService: HexManagementService,
  ) {
    this.gameSetupService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.radius = state.radius;
      });
  }

  ngOnInit(): void {
    this.setNextTurnHexData();
  }

  // TODO: remove after testing, temporaty method
  nextMove() {
    console.log('nextMove clicked');
    this.setNextTurnHexData();
  }

  isHexAEqualHexB(hexA: HexData, hexB: HexData) {
    const keysToCompare = ['q', 's', 'r'];
    const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
    return !hasMismatch;
  }

  setNextTurnHexData() {
    const localHexData = this.hexManagementService.getHexData().filter((hex) => Boolean(hex.value));

    this.hexManagementService.getNewHexCoords(this.radius, localHexData).subscribe((newHexCoords) => {
      this.hexManagementService.setHexData(
        localHexData.concat(newHexCoords),
        'GameControlComponent.setNextTurnHexData()',
      );

      if (newHexCoords.length === 0)
        this.gameSetupService.setGameState('game-over', 'GameControlComponent.setNextTurnHexData()');
    });

    // this.hexManagementService.getNewHexCoords(this.radius, localHexData).subscribe((newHexCoords) => {
    //   localHexData
    //     .map((hex) => {
    //       const indexWithValue = newHexCoords.findIndex((newHex) => this.isHexAEqualHexB(hex, newHex));
    //       if (indexWithValue !== -1) hex.value = newHexCoords[indexWithValue].value;
    //       return hex;
    //     })
    //     .filter((hex) => Boolean(hex.value));

    //   this.hexManagementService.setHexData(localHexData, 'game-control');
    // });
  }
}

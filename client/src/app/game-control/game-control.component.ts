import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HexData } from '@app/shared/interfaces';
import { GameSetupService } from '@app/shared/services/game-setup';
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
  hexData!: HexData[];

  constructor(private gameSetupService: GameSetupService) {
    this.gameSetupService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.radius = state.radius;
        // this.hexData = state.hexData;
      });
  }

  ngOnInit(): void {
    // this.setNextTurnHexData();
  }

  // TODO: remove after testing, temporaty method
  nextMove() {
    console.log('nextMove clicked');
    // this.setNextTurnHexData();
  }

  isHexAEqualHexB(hexA: HexData, hexB: HexData) {
    const keysToCompare = ['q', 's', 'r'];
    const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
    return !hasMismatch;
  }

  // setNextTurnHexData(): void {
  //   const activeHexes = this.hexData.filter((hex) => Boolean(hex.value));

  //   this.hexManagementService
  //     .getNewHexCoords(this.radius, activeHexes)
  //     .pipe(distinctUntilChanged<HexData[]>())
  //     .subscribe((newHexCoords) => {
  //       const nextMoveHexData = this.hexData
  //         .map((hex) => {
  //           const indexWithValue = newHexCoords.findIndex((newHex) => this.isHexAEqualHexB(hex, newHex));
  //           if (indexWithValue !== -1) hex.value = newHexCoords[indexWithValue].value;
  //           return hex;
  //         })
  //         .filter((hex) => Boolean(hex.value));

  //       this.gameSetupService.setHexData(nextMoveHexData, 'game-control');
  //     });
  // }
}

import { Component } from '@angular/core';
import { HexagonComponent } from '@app/hexagon';
import { StyleVariables, Position, HexData } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { GameState } from '@app/shared/types';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent, NgFor],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent extends GridUtilityComponent {
  trackByCoord(_index: number, hexCoord: HexData): string {
    return `${hexCoord.q},${hexCoord.r},${hexCoord.s}`;
  }

  radius!: number;
  gap!: number;
  hexWidth!: number;
  gameState!: GameState;
  hexData: HexData[] = [];
  backgroundHexData: HexData[] = [];

  constructor(
    private gameSetupService: GameSetupService,
    private hexManagementService: HexManagementService,
  ) {
    super();
    this.gameSetupService.state$.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.radius = state.radius;
      this.gap = state.gap;
      this.hexWidth = state.hexWidth;
      this.gameState = state.gameState;

      this.updateProperies();
    });

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(
        distinctUntilChanged((prev, curr) => {
          // TODO: remove console.log
          console.log(
            `\n\nprev hexData: ${JSON.stringify(prev.hexData)} \n\ncurr hexData: ${JSON.stringify(curr.hexData)}`,
          );

          const hasMismatch = curr.hexData.some((currentHex, index) => {
            return !this.isHexAEqualHexB(currentHex, prev.hexData[index], true);
          });
          if (!hasMismatch) console.log('>> no mismatch found, skipping hexData update');
          return !hasMismatch;
        }),
      )
      .subscribe((state) => {
        this.hexData = state.hexData;
      });
  }

  hexHeight!: number;
  gridWidth!: number;
  gridHeight!: number;
  offset!: Position;
  styleVariables!: StyleVariables;

  HEX_HORIZONTAL_SPAN_RATIO = 0.75 as const;

  setGridWidth(): void {
    const hexesWidth = this.hexWidth + this.hexWidth * this.radius * this.HEX_HORIZONTAL_SPAN_RATIO * 2;
    const gapCompensation = this.radius * this.HEX_HORIZONTAL_SPAN_RATIO * 2 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridWidth = hexesWidth + padding;
  }

  setGridHeight(): void {
    const hexesHeight = this.hexHeight * (2 * this.radius + 1);
    const gapCompensation = this.radius * this.coordToPixel.f3 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridHeight = hexesHeight + padding;
  }

  setOffset(): void {
    this.offset = {
      x: this.gridWidth / 2 - this.hexWidth / 2,
      y: this.gridHeight / 2 - this.hexHeight / 2,
    };
  }

  updateProperies(): void {
    if (!this.hexWidth) return;
    console.log('>>> setting primitive properties');

    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setStyleVariables(this.gridWidth, this.gridHeight);

    if (this.gameState === 'setup') this.setHexCoords();
  }

  setHexCoords(): void {
    console.log('>>> settings coordinates');
    const localHexData = [];

    for (let q = -this.radius; q <= this.radius; q++) {
      for (let r = Math.max(-this.radius, -q - this.radius); r <= Math.min(this.radius, -q + this.radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        localHexData.push({ q, r, s });
      }
    }

    if (this.gameState === 'setup') this.backgroundHexData = localHexData;

    // TODO: maybe there is no need to set hexData if backgroundHexData is implemented
    // backgroundHexes can change color during setup phase
    this.hexManagementService.setHexData(localHexData, 'GridComponent.setHexCoords');
  }

  isHexAEqualHexB(hexA: HexData, hexB: HexData, checkValue = false) {
    if (!hexA || !hexB) return false;
    const keysToCompare = ['q', 's', 'r'];
    if (checkValue) keysToCompare.push('value');
    const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
    return !hasMismatch;
  }

  // getNextTurnHexData(): void {
  //   const activeHexes = this.hexData.filter((hex) => Boolean(hex.value));

  //   this.hexManagementService
  //     .getNewHexCoords(this.radius, activeHexes)
  //     .pipe(distinctUntilChanged<HexData[]>())
  //     .subscribe((newHexCoords) => {
  //       this.hexData.map((hex) => {
  //         const indexWithValue = newHexCoords.findIndex((newHex) => this.isHexAEqualHexB(hex, newHex));
  //         if (indexWithValue !== -1) hex.value = newHexCoords[indexWithValue].value;
  //         return hex;
  //       });
  //     });
  // }
}

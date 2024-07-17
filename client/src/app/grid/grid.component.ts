import { Component, HostBinding } from '@angular/core';
import { HexagonComponent } from '@app/shared/components/UI';
import { GridUtilStyleVariables, Position, HexData, HexCoord } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, distinctUntilChanged, map, pairwise } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { GameState } from '@app/shared/types';
import { getCSSVariableString, isHexAEqualHexB, isSameHexArray } from '@app/shared/helpers';

// TODO: remove console.log
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent, NgFor, NgIf, AsyncPipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent extends GridUtilityComponent {
  trackByCoord(_index: number, hexCoord: HexCoord): string {
    return `${hexCoord.q},${hexCoord.r},${hexCoord.s}`;
  }

  trackByID(_index: number, hex: HexData): number {
    return hex.id;
  }

  radius!: number;
  gap!: number;
  hexWidth!: number;
  gameState!: GameState;
  previousHexData: HexData[] = [];
  hexData: HexData[] = [];
  hexesToDelete: HexData[] = [];
  backgroundHexCoords: HexCoord[] = [];

  constructor(
    private readonly gameSetupService: GameSetupService,
    private readonly hexManagementService: HexManagementService,
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
      .pipe(distinctUntilChanged((prev, curr) => isSameHexArray(prev.hexData, curr.hexData)))
      .pipe(pairwise())
      .subscribe(([prevState, currState]) => {
        this.previousHexData = prevState.hexData;
        const hexDataWithAnimations = this.setAnimations(currState.hexData);
        this.hexesToDelete = currState.hexesToDelete;
        this.hexData = hexDataWithAnimations;
      });

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => isSameHexArray(prev.backgroundHexCoords, curr.backgroundHexCoords)))
      .subscribe((state) => {
        console.log(`>>> GridComponent backgroundHexCoords changed`);
        this.backgroundHexCoords = state.backgroundHexCoords;
      });
  }

  @HostBinding('style') get cssVariables() {
    return getCSSVariableString(this.styleVariables);
  }

  get isSetup$(): Observable<boolean> {
    return this.gameSetupService.state$.pipe(map((state) => state.gameState === 'setup'));
  }

  hexHeight!: number;
  gridWidth!: number;
  gridHeight!: number;
  offset!: Position;
  styleVariables!: GridUtilStyleVariables;

  readonly HEX_HORIZONTAL_SPAN_RATIO = 0.75;

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

    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setStyleVariables(this.gridWidth, this.gridHeight);

    if (this.gameState === 'setup') this.setBackgroundHexCoords();
  }

  setBackgroundHexCoords(): void {
    const localHexCoords: HexCoord[] = [];

    for (let q = -this.radius; q <= this.radius; q++) {
      for (let r = Math.max(-this.radius, -q - this.radius); r <= Math.min(this.radius, -q + this.radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        localHexCoords.push({ q, r, s });
      }
    }

    if (localHexCoords.length === this.backgroundHexCoords.length) return;

    if (this.gameState === 'setup')
      this.hexManagementService.setBackgroundHexCoords(
        localHexCoords,
        'GridComponent.setHexCoords setBackgroundHexCoords',
      );
  }

  // TODO: refactor the method
  setAnimations(currState: HexData[]): HexData[] {
    return currState.map((hex) => {
      const isNewHex = !this.previousHexData.some((oldHex) => oldHex.id === hex.id);
      if (isNewHex) {
        const newHex: HexData = { ...hex, animation: 'zoom-in' };

        return newHex;
      } else {
        const oldHex = this.previousHexData.find((oldHex) => oldHex.id === hex.id);

        if (!oldHex) return hex;
        if (isHexAEqualHexB(oldHex, hex)) return hex;

        const didMerge = oldHex.value !== hex.value;

        const nexHex: HexData = { ...hex, animation: didMerge ? 'merge' : 'move' };

        return nexHex;
      }
    });
  }
}

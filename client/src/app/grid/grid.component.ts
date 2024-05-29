import { Component } from '@angular/core';
import { HexagonComponent } from '@app/hexagon';
import { StyleVariables, Position, HexData } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgFor } from '@angular/common';
import { HexManagementService, StoreService } from '@app/shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent, NgFor],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent extends GridUtilityComponent {
  radius!: number;
  gap!: number;
  hexWidth!: number;
  isGameInProgress!: boolean;

  constructor(
    private storeService: StoreService,
    private hexManagementService: HexManagementService,
  ) {
    super();
    this.storeService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.radius = state.radius;
        this.gap = state.gap;
        this.hexWidth = state.hexWidth;
        this.isGameInProgress = state.isGameInProgress;

        this.updateProperies();
      });
  }

  hexHeight!: number;
  gridWidth!: number;
  gridHeight!: number;
  offset!: Position;
  hexData!: HexData[];
  styleVariables!: StyleVariables;

  setGridWidth(): void {
    const hexesWidth = this.hexWidth + this.hexWidth * this.radius * 0.75 * 2;
    const gapCompensation = this.radius * 0.75 * 2 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridWidth = hexesWidth + padding;
  }

  setGridHeight(): void {
    const hexesHeight = this.hexHeight * (2 * this.radius + 1);
    const gapCompensation = this.radius * Math.sqrt(3) * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridHeight = hexesHeight + padding;
  }

  setOffset(): void {
    this.offset = {
      x: this.gridWidth / 2 - this.hexWidth / 2,
      y: this.gridHeight / 2 - this.hexHeight / 2,
    };
  }

  setHexCoords(): void {
    this.hexData = [];

    for (let q = -this.radius; q <= this.radius; q++) {
      for (let r = Math.max(-this.radius, -q - this.radius); r <= Math.min(this.radius, -q + this.radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        this.hexData.push({ q, r, s });
      }
    }
  }

  trackByCoord(_index: number, hexCoord: HexData): string {
    return `${hexCoord.q},${hexCoord.r},${hexCoord.s}`;
  }

  isHexAEqualHexB(hexA: HexData, hexB: HexData) {
    const keysToCompare = ['q', 's', 'r'];
    const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexData] !== hexB[key as keyof HexData]);
    return !hasMismatch;
  }

  updateProperies(): void {
    if (!this.hexWidth) return;
    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setHexCoords();

    this.setStyleVariables(this.gridWidth, this.gridHeight);

    if (!this.isGameInProgress) return;

    const activeHexes = this.hexData.filter((hex) => Boolean(hex.value));

    this.hexManagementService.getNewHexCoords(this.radius, activeHexes).subscribe((newHexCoords) => {
      console.log('calling api');
      console.log(JSON.stringify(newHexCoords));
      this.hexData.map((hex) => {
        const shouldAssignValue = newHexCoords.some((newHex) => this.isHexAEqualHexB(hex, newHex));
        if (shouldAssignValue) hex.value = 2;
        return hex;
      });
    });
  }
}

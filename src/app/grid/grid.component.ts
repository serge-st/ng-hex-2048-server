import { Component } from '@angular/core';
import { HexagonComponent } from '@app/hexagon';
import { StyleVariables, Position, HexCoord } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgFor } from '@angular/common';
import { StoreService } from '@app/shared/services';
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
  constructor(private storeService: StoreService) {
    super();
    this.storeService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.radius = state.radius;
        this.gap = state.gap;
        this.hexWidth = state.hexWidth;

        this.updateProperies();
      });
  }

  hexHeight!: number;
  gridWidth!: number;
  gridHeight!: number;
  offset!: Position;
  hexCoords!: HexCoord[];
  styleVariables!: StyleVariables;

  setGridWidth(): void {
    const hexesWidth = this.hexWidth + this.hexWidth * this.radius * 0.75 * 2;
    const gapCompensation = this.radius * 0.75 * 2 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridWidth = hexesWidth + padding;
  }

  setGridHeight(): void {
    const hexesHeight = this.hexHeight * (2 * this.radius + 1);
    const gapCompoensation = this.radius * Math.sqrt(3) * this.gap;
    const padding = this.gap * 2 + gapCompoensation;
    this.gridHeight = hexesHeight + padding;
  }

  setOffset(): void {
    this.offset = {
      x: this.gridWidth / 2 - this.hexWidth / 2,
      y: this.gridHeight / 2 - this.hexHeight / 2,
    };
  }

  setHexCoords(): void {
    this.hexCoords = [];

    for (let q = -this.radius; q <= this.radius; q++) {
      for (let r = Math.max(-this.radius, -q - this.radius); r <= Math.min(this.radius, -q + this.radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        this.hexCoords.push({ q, r, s });
      }
    }
  }

  trackByCoord(_index: number, hexCoord: HexCoord): string {
    return `${hexCoord.q},${hexCoord.r},${hexCoord.s}`;
  }

  updateProperies(): void {
    if (!this.hexWidth) return;
    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setHexCoords();

    this.setStyleVariables(this.gridWidth, this.gridHeight);
  }
}

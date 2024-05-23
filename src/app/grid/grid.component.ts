import { Component, Input, OnInit } from '@angular/core';
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
export class GridComponent extends GridUtilityComponent implements OnInit {
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

  ngOnInit(): void {
    this.updateProperies();
  }

  setGridWidth(): void {
    // this.hexWidth + this.hexWidth * 1.5 * this.radius + (this.gap * 6 * this.radius) / this.coordToPixel.f0;
    this.gridWidth = this.hexWidth + this.hexWidth * 1.5 * this.radius;
    console.log(`hex width: ${this.hexWidth}; grid width: ${this.gridWidth}`);
  }

  setGridHeight(): void {
    this.gridHeight = this.hexHeight + this.hexHeight * 2 * this.radius;
    console.log(`hex height: ${this.hexHeight}; grid height: ${this.gridHeight}`);
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

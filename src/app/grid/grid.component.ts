import { Component, Input, OnChanges } from '@angular/core';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { StyleVariables } from '../shared/interfaces/style-variables';
import { GridUtilityComponent } from '../shared/grid-utility-component';
import { Position } from '../shared/interfaces/position';
import { HexCoord } from '../shared/interfaces/hex-coord';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent, NgFor],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent extends GridUtilityComponent implements OnChanges {
  @Input({ required: true }) radius!: number;
  @Input({ required: true }) hexWidth!: number;
  hexHeight: number = 0;

  gridWidth!: number;
  gridHeight!: number;

  setGridWidth(): void {
    this.gridWidth = this.hexWidth + (this.hexWidth * 1.5 * this.radius)
  }

  setGridHeight(): void {
    this.gridHeight = this.hexHeight + (this.hexHeight * 2 * this.radius)
  }

  offset!: Position;

  setOffset(): void {
    this.offset = {
      x: (this.gridWidth / 2) - (this.hexWidth / 2),
      y: (this.gridHeight / 2) - (this.hexHeight / 2)
    };
  }

  hexCoords!: HexCoord[];

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

  styleVariables!: StyleVariables;

  ngOnChanges(): void {
    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setHexCoords();

    this.setStyleVariables(this.gridWidth, this.gridHeight);
  }
}

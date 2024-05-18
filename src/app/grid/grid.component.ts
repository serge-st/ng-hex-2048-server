import { Component, Input, OnChanges } from '@angular/core';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { StyleVariables } from '../shared/interfaces/style-variables';
import { GridUtilityComponent } from '../shared/grid-utility-component';
import { Position } from '../shared/interfaces/position';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent],
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
      x: this.gridWidth / 2,
      y: this.gridWidth * this.coordToPixel.f2 / 2
    };
  }

  styleVariables!: StyleVariables;

  ngOnChanges(): void {
    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setStyleVariables(this.gridWidth, this.gridHeight);
  }
}

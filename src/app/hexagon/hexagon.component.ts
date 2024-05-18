import { Component, Input, OnChanges } from '@angular/core';
import { StyleVariables } from '../shared/interfaces/style-variables';
import { HexCoord } from '../shared/interfaces/hex-coord';
import { GridUtilityComponent } from '../shared/grid-utility-component';
import { Position } from '../shared/interfaces/position';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent extends GridUtilityComponent implements OnChanges {
  @Input({ required: true }) coord!: HexCoord;
  validateHexCoordinates() {
    if (Math.round(this.coord.q + this.coord.r + this.coord.s) !== 0) {
      const badCoord = JSON.stringify({ q: this.coord.q, r: this.coord.r, s: this.coord.s });
      throw new Error(`Invalid hex coordinates: ${badCoord}; q + r + s must equal 0`);
    }
  }

  @Input({ required: true }) hexWidth!: number;
  hexHeight!: number;
  styleVariables!: StyleVariables;

  @Input({ required: true }) offset!: Position;

  pixelCoord!: Position;

  setPixelCoords(): void {
    const hexRadius = this.hexWidth / 2
    const x = (this.coordToPixel.f0 * this.coord.q + this.coordToPixel.f1 * this.coord.r) * hexRadius;
    const y = (this.coordToPixel.f2 * this.coord.q + this.coordToPixel.f3 * this.coord.r) * hexRadius;
    // Offset is needed to center the hexagon { q: 0, r: 0, s: 0 } in the grid
    // and the following hexagons around it
    const xWithOffset = x + this.offset.x;
    const yWithOffset = y + this.offset.y;
    this.pixelCoord = {
      x: xWithOffset,
      y: yWithOffset,
    };
  }

  ngOnChanges() {
    this.validateHexCoordinates();
    this.setHexHeight();
    this.setPixelCoords();
    this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  }
}

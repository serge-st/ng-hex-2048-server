import { Component, Input, OnChanges } from '@angular/core';
import { StyleVariables } from '../shared/interfaces/style-variables';
import { HexCoord } from './hex-coord';
import { GridUtilityComponent } from '../shared/grid-utility-component';

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
    if (this.coord.q + this.coord.r + this.coord.s !== 0) {
      const badCoord = JSON.stringify({ q: this.coord.q, r: this.coord.r, s: this.coord.s });
      throw new Error(`Invalid hex coordinates: ${badCoord}; q + r + s must equal 0`);
    }
  }

  @Input({ required: true }) hexWidth!: number;
  hexHeight!: number;
  styleVariables!: StyleVariables;

  ngOnChanges() {
    this.validateHexCoordinates();
    this.setHexHeight();
    this.setStyleVariables(this.hexWidth, this.hexHeight);
  }
}

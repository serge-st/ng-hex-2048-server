import { Component, Input, OnChanges } from '@angular/core';
import { StyleVariables } from './style-variables';
import { HexCoord } from './hex-coord';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent implements OnChanges {
  @Input({ required: true }) coord!: HexCoord;

  validateHexCoordinates() {
    if (this.coord.q + this.coord.s + this.coord.r !== 0) {
      throw new Error('Invalid hex coordinates: q + r + s must equal 0');
    }
  }

  @Input({ required: true }) hexWidth!: number;
  hexHeight!: number;

  styleVariables!: StyleVariables;

  private addPixel(value: number): string {
    return value + 'px';
  }

  ngOnChanges() {
    this.validateHexCoordinates();

    this.hexHeight = (Math.sqrt(3) * (this.hexWidth / 2));

    this.styleVariables = {
      width: this.addPixel(this.hexWidth),
      height: this.addPixel(this.hexHeight),
    };

  }
}

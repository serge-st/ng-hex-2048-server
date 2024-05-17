import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HexagonComponent } from '../hexagon/hexagon.component';
import { StyleVariables } from '../hexagon/style-variables';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnChanges {
  @Input({ required: true }) radius!: number;
  @Input({ required: true }) hexWidth!: number;

  gridWidth!: number;
  gridHeight!: number;

  setGridWidth(): void {
    this.gridWidth = this.hexWidth + (this.hexWidth * 1.5 * this.radius)
  }

  styleVariables!: StyleVariables;

  private getPixelString(value: number): string {
    return value + 'px';
  }

  ngOnChanges(): void {
    this.setGridWidth();

    // MOCK VALUE
    this.gridHeight = 200;

    this.styleVariables = {
      width: this.getPixelString(this.gridWidth),
      height: this.getPixelString(this.gridHeight)
    }

  }
}

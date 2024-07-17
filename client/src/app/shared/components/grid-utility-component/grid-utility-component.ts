import { Component } from '@angular/core';
import { GridUtilStyleVariables, CoordToPixel } from '@app/shared/interfaces';

@Component({
  selector: '',
  template: '',
})
export abstract class GridUtilityComponent {
  abstract hexWidth: number;
  abstract hexHeight: number;
  abstract styleVariables: GridUtilStyleVariables;

  readonly coordToPixel: CoordToPixel = {
    f0: 3.0 / 2.0, // 1.5
    f1: 0.0,
    f2: Math.sqrt(3.0) / 2.0, // 0.86602540378
    f3: Math.sqrt(3.0), // 1.73205080757
  } as const;

  getPixelString(value: number): string {
    return value.toFixed(3) + 'px';
  }

  setHexHeight(): void {
    this.hexHeight = Math.sqrt(3) * (this.hexWidth / 2);
  }

  setStyleVariables(width: number, height: number, xCoord?: number, yCoord?: number): void {
    this.styleVariables = {
      width: this.getPixelString(width),
      height: this.getPixelString(height),
      'x-coord': xCoord ? this.getPixelString(xCoord) : '',
      'y-coord': yCoord ? this.getPixelString(yCoord) : '',
    };
  }
}

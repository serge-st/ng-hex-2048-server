import { Component } from '@angular/core';
import { StyleVariables } from './interfaces/style-variables';

@Component({
    selector: '',
    template: '',
})
export abstract class GridUtilityComponent {
    abstract hexWidth: number;
    abstract hexHeight: number;
    abstract styleVariables: StyleVariables

    coordToPixel = {
        f0: 3.0 / 2.0,
        f1: 0.0,
        f2: Math.sqrt(3.0) / 2.0,
        f3: Math.sqrt(3.0),
    }

    getPixelString(value: number): string {
        return value + 'px';
    }

    setHexHeight(): void {
        this.hexHeight = (Math.sqrt(3) * (this.hexWidth / 2));
    }

    setStyleVariables(width: number, height: number, xCoord?: number, yCoord?: number): void {
        this.styleVariables = {
            width: this.getPixelString(width),
            height: this.getPixelString(height),
            xCoord: xCoord ? this.getPixelString(xCoord) : '',
            yCoord: yCoord ? this.getPixelString(yCoord) : '',
        };
    }
}

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

    getPixelString(value: number): string {
        return value + 'px';
    }

    setHexHeight(): void {
        this.hexHeight = (Math.sqrt(3) * (this.hexWidth / 2));
    }

    setStyleVariables(width: number, height: number): void {
        this.styleVariables = {
            width: this.getPixelString(width),
            height: this.getPixelString(height),
        };
    }
}

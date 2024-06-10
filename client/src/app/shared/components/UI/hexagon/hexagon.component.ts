import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { StyleVariables, HexData, Position } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent extends GridUtilityComponent implements OnChanges {
  @Input({ required: true }) hexData!: HexData;
  @Input({ required: true }) offset!: Position;
  @Input({ required: true }) gap!: number;
  @Input({ required: true }) hexWidth!: number;
  @Input() isBackgroundHex = false;
  @Input() isSetup = false;

  @HostBinding('class.background-hex') get backgroundHexClass() {
    return this.isBackgroundHex;
  }
  @HostBinding('class.setup') get setupClass() {
    return this.isSetup;
  }
  @HostBinding('style') get cssVariables() {
    return `--width: ${this.styleVariables.width}; --height: ${this.styleVariables.height}; --x-coord: ${this.styleVariables.xCoord}; --y-coord: ${this.styleVariables.yCoord}`;
  }
  @HostBinding('attr.data-q') get q() {
    return this.hexData.q;
  }
  @HostBinding('attr.data-r') get r() {
    return this.hexData.r;
  }
  @HostBinding('attr.data-s') get s() {
    return this.hexData.s;
  }
  @HostBinding('attr.data-value') get dataValue() {
    return this.value;
  }

  hexHeight!: number;
  pixelCoord!: Position;
  styleVariables!: StyleVariables;
  get value(): number {
    return this.hexData.value || 0;
  }

  ngOnChanges(): void {
    this.validateHexCoordinates();
    this.updateProperies();
  }

  validateHexCoordinates() {
    if (Math.round(this.hexData.q + this.hexData.r + this.hexData.s) !== 0) {
      const badCoord = JSON.stringify({ q: this.hexData.q, r: this.hexData.r, s: this.hexData.s });
      throw new Error(`Invalid hex coordinates: ${badCoord}; q + r + s must equal 0`);
    }
  }

  setPixelCoords(): void {
    const hexRadius = this.hexWidth / 2;
    const gapCoefficient = hexRadius + this.gap / 2;
    const x = (this.coordToPixel.f0 * this.hexData.q + this.coordToPixel.f1 * this.hexData.r) * gapCoefficient;
    const y = (this.coordToPixel.f2 * this.hexData.q + this.coordToPixel.f3 * this.hexData.r) * gapCoefficient;

    // Offset is needed to place the hexagon { q: 0, r: 0, s: 0 } in the center of the grid
    // and the following hexagons around it
    const xWithOffset = x + this.offset.x;
    const yWithOffset = y + this.offset.y;
    this.pixelCoord = {
      x: xWithOffset,
      y: yWithOffset,
    };
  }

  updateProperies(): void {
    if (!this.hexData) return;
    this.setHexHeight();
    this.setPixelCoords();
    this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  }
}

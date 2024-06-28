import { Component, HostBinding, HostListener, Input, OnChanges } from '@angular/core';
import { StyleVariables, Position, HexCoord, HexData } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgIf } from '@angular/common';
import { isHexData } from '@app/shared/helpers';
import { HexAnimation } from '@app/shared/types';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent extends GridUtilityComponent implements OnChanges {
  colors: string[] = [
    '#fff678', // Muted Yellow
    '#ffdf73',
    '#ffc96e',
    '#ffb369',
    '#ff9d64',
    '#ff875f',
    '#ff715a',
    '#ff5b55',
    '#ff454f',
    '#ff2f4a',
    '#eb674f', // Muted Red
  ];

  @Input({ required: true }) hexDetails!: HexCoord | HexData;
  @Input({ required: true }) offset!: Position;
  @Input({ required: true }) gap!: number;
  @Input({ required: true }) hexWidth!: number;
  @Input() isSetup = false;
  get value(): number | undefined {
    return isHexData(this.hexDetails) ? this.hexDetails.value : undefined;
  }
  get animation(): HexAnimation | undefined {
    return isHexData(this.hexDetails) ? this.hexDetails?.animation : undefined;
  }

  // TODO: remove after testing
  get hexData(): string | undefined {
    return isHexData(this.hexDetails) ? JSON.stringify({ id: this.hexDetails.id }, null, 2) : undefined;
  }

  @HostBinding('class.background-hex') get backgroundHexClass() {
    return Boolean(!this.value);
  }
  @HostBinding('class.setup') get setupClass() {
    return this.isSetup;
  }
  @HostBinding('class.zoom-in') get zoomInClass() {
    return this.animation === 'zoom-in';
  }
  @HostBinding('class.move') get moveClass() {
    return this.animation === 'move';
  }
  @HostBinding('class.merge') get mergeClass() {
    return this.animation === 'merge';
  }
  @HostBinding('class.delete') get deleteClass() {
    return this.animation === 'delete';
  }
  @HostBinding('style') get cssVariables() {
    return `--width: ${this.styleVariables.width}; --height: ${this.styleVariables.height}; --x-coord: ${this.styleVariables.xCoord}; --y-coord: ${this.styleVariables.yCoord}`;
  }
  @HostBinding('style.--background-color') get backgroundColor() {
    return isHexData(this.hexDetails) ? this.colors[Math.log2(this.hexDetails.value)] : undefined;
  }
  @HostBinding('attr.data-q') get q() {
    return this.hexDetails.q;
  }
  @HostBinding('attr.data-r') get r() {
    return this.hexDetails.r;
  }
  @HostBinding('attr.data-s') get s() {
    return this.hexDetails.s;
  }
  @HostBinding('attr.data-value') get dataValue() {
    return this.value;
  }

  @HostListener('animationend')
  onAnimationend(): void {
    if (isHexData(this.hexDetails)) {
      if (this.hexDetails.animation === 'delete') return;
      this.hexDetails.animation = 'none';
    }
  }
  @HostListener('transitionend')
  onTransitionend(): void {
    if (isHexData(this.hexDetails)) {
      this.hexDetails.animation = 'none';
    }
  }

  hexHeight!: number;
  pixelCoord!: Position;
  styleVariables!: StyleVariables;

  ngOnChanges(): void {
    this.validateHexCoordinates();
    this.updateProperies();
  }

  validateHexCoordinates(): void {
    if (Math.round(this.hexDetails.q + this.hexDetails.r + this.hexDetails.s) !== 0) {
      const badCoord = JSON.stringify({ q: this.hexDetails.q, r: this.hexDetails.r, s: this.hexDetails.s });
      throw new Error(`Invalid hex coordinates: ${badCoord}; q + r + s must equal 0`);
    }
  }

  setPixelCoords(): void {
    const hexRadius = this.hexWidth / 2;
    const gapCoefficient = hexRadius + this.gap / 2;
    const x = (this.coordToPixel.f0 * this.hexDetails.q + this.coordToPixel.f1 * this.hexDetails.r) * gapCoefficient;
    const y = (this.coordToPixel.f2 * this.hexDetails.q + this.coordToPixel.f3 * this.hexDetails.r) * gapCoefficient;

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
    if (!this.hexDetails) return;
    this.setHexHeight();
    this.setPixelCoords();
    this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  }
}

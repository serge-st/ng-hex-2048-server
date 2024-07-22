import { Component, HostBinding, HostListener, Input, OnChanges } from '@angular/core';
import { GridUtilStyleVariables, Position, HexCoord, HexData } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { NgIf } from '@angular/common';
import { getCSSVariableString, isHexData } from '@app/shared/helpers';
import { HexAnimation } from '@app/shared/types';
import { HexManagementService } from '@app/shared/services/hex-management';
import { HEX_COLORS } from './constants';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [NgIf],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent extends GridUtilityComponent implements OnChanges {
  private colors = HEX_COLORS;

  constructor(private hexManagementService: HexManagementService) {
    super();
  }

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
    return getCSSVariableString(this.styleVariables);
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

  @HostListener('animationstart')
  onAnimationstart(): void {
    this.hexManagementService.setIsAnimatingOrTransitioning(true);
  }

  @HostListener('transitionstart')
  onTransitionstart(): void {
    this.hexManagementService.setIsAnimatingOrTransitioning(true);
  }

  @HostListener('animationend')
  onAnimationend(): void {
    if (!isHexData(this.hexDetails)) return;
    if (this.hexDetails.animation === 'delete') return;
    this.hexDetails.animation = 'none';
    this.hexManagementService.setIsAnimatingOrTransitioning(false);
  }

  @HostListener('transitionend')
  onTransitionend(): void {
    if (!isHexData(this.hexDetails)) return;
    this.hexDetails.animation = 'none';
    this.hexManagementService.setIsAnimatingOrTransitioning(false);
  }

  hexHeight!: number;
  pixelCoord!: Position;
  styleVariables!: GridUtilStyleVariables;

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

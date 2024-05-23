import { Component, Input, OnChanges } from '@angular/core';
import { StyleVariables, HexCoord, Position } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { StoreService } from '@app/shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-hexagon',
  standalone: true,
  imports: [],
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.scss',
})
export class HexagonComponent extends GridUtilityComponent implements OnChanges {
  gap!: number;
  hexWidth!: number;
  constructor(private storeService: StoreService) {
    super();
    this.storeService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.gap = state.gap;
        this.hexWidth = state.hexWidth;

        this.updateProperies();
      });
  }

  @Input({ required: true }) coord!: HexCoord;
  @Input({ required: true }) offset!: Position;
  hexHeight!: number;
  pixelCoord!: Position;
  styleVariables!: StyleVariables;

  ngOnChanges(): void {
    this.validateHexCoordinates();
    this.updateProperies();
  }

  updateProperies(): void {
    if (!this.coord) return;
    this.setHexHeight();
    this.setPixelCoords();
    this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  }

  validateHexCoordinates() {
    if (Math.round(this.coord.q + this.coord.r + this.coord.s) !== 0) {
      const badCoord = JSON.stringify({ q: this.coord.q, r: this.coord.r, s: this.coord.s });
      throw new Error(`Invalid hex coordinates: ${badCoord}; q + r + s must equal 0`);
    }
  }

  setPixelCoords(): void {
    const hexRadius = this.hexWidth / 2;
    // implementation of the coordinate calculation for every radius withoud gap
    const x = (this.coordToPixel.f0 * this.coord.q + this.coordToPixel.f1 * this.coord.r) * hexRadius;
    const y = (this.coordToPixel.f2 * this.coord.q + this.coordToPixel.f3 * this.coord.r) * hexRadius;
    // !! (TESTING GAP) TODO remove after testing
    // const x = (this.coordToPixel.f0 * this.coord.q + this.coordToPixel.f1 * this.coord.r) * (hexRadius + this.gap);
    // const y = (this.coordToPixel.f2 * this.coord.q + this.coordToPixel.f3 * this.coord.r) * (hexRadius + this.gap);

    // Offset is needed to place the hexagon { q: 0, r: 0, s: 0 } in the center of the grid
    // and the following hexagons around it
    const xWithOffset = x + this.offset.x;
    const yWithOffset = y + this.offset.y;
    this.pixelCoord = {
      x: xWithOffset,
      y: yWithOffset,
    };
  }

  // ngOnChanges() {
  //   this.validateHexCoordinates();
  //   this.setHexHeight();
  //   this.setPixelCoords();
  //   this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  // !! TODO remove after testing
  // this.route.queryParams.subscribe((params) => {
  //   this.gap = Number(params['gap']);
  //   this.setPixelCoords();
  //   this.setStyleVariables(this.hexWidth, this.hexHeight, this.pixelCoord.x, this.pixelCoord.y);
  //   if (this.coord.s === this.storeService.state.radius && this.coord.r === -this.storeService.state.radius) {
  //     console.log('topmost hex:', this.styleVariables);
  //   }
  //   if (this.coord.s === this.storeService.state.radius && this.coord.q === -this.storeService.state.radius) {
  //     console.log('GAP:', params['gap'], 'RADIUS:', this.storeService.state.radius);
  //     console.log('leftmost hex:', this.styleVariables);
  //   }
  // });
  // }
}

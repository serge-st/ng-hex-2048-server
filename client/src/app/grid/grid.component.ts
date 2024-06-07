import { Component, HostBinding } from '@angular/core';
import { HexagonComponent } from '@app/hexagon';
import { StyleVariables, Position, HexData } from '@app/shared/interfaces';
import { GridUtilityComponent } from '@app/shared/components';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { GameState } from '@app/shared/types';
import { compareHexData } from '@app/shared/helpers';

// TODO: remove console.log
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HexagonComponent, NgFor, NgIf, AsyncPipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent extends GridUtilityComponent {
  trackByCoord(_index: number, hexCoord: HexData): string {
    return `${hexCoord.q},${hexCoord.r},${hexCoord.s}`;
  }

  radius!: number;
  gap!: number;
  hexWidth!: number;
  gameState!: GameState;
  hexData: HexData[] = [];
  backgroundHexData: HexData[] = [];

  constructor(
    private gameSetupService: GameSetupService,
    private hexManagementService: HexManagementService,
  ) {
    super();
    this.gameSetupService.state$.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.radius = state.radius;
      this.gap = state.gap;
      this.hexWidth = state.hexWidth;
      this.gameState = state.gameState;

      this.updateProperies();
    });

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => compareHexData(prev, curr, 'hexData')))
      .subscribe((state) => {
        this.hexData = state.hexData;
      });

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => compareHexData(prev, curr, 'backgroundHexData')))
      .subscribe((state) => {
        this.backgroundHexData = state.backgroundHexData;
      });
  }

  @HostBinding('style') get cssVariables() {
    return `--width: ${this.styleVariables.width}; --height: ${this.styleVariables.height};`;
  }

  get isSetup$(): Observable<boolean> {
    return this.gameSetupService.state$.pipe(map((state) => state.gameState === 'setup'));
  }

  hexHeight!: number;
  gridWidth!: number;
  gridHeight!: number;
  offset!: Position;
  styleVariables!: StyleVariables;

  readonly HEX_HORIZONTAL_SPAN_RATIO = 0.75;

  setGridWidth(): void {
    const hexesWidth = this.hexWidth + this.hexWidth * this.radius * this.HEX_HORIZONTAL_SPAN_RATIO * 2;
    const gapCompensation = this.radius * this.HEX_HORIZONTAL_SPAN_RATIO * 2 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridWidth = hexesWidth + padding;
  }

  setGridHeight(): void {
    const hexesHeight = this.hexHeight * (2 * this.radius + 1);
    const gapCompensation = this.radius * this.coordToPixel.f3 * this.gap;
    const padding = this.gap * 2 + gapCompensation;
    this.gridHeight = hexesHeight + padding;
  }

  setOffset(): void {
    this.offset = {
      x: this.gridWidth / 2 - this.hexWidth / 2,
      y: this.gridHeight / 2 - this.hexHeight / 2,
    };
  }

  updateProperies(): void {
    if (!this.hexWidth) return;
    console.log('>>> setting primitive properties');

    this.setHexHeight();

    this.setGridWidth();
    this.setGridHeight();

    this.setOffset();

    this.setStyleVariables(this.gridWidth, this.gridHeight);

    if (this.gameState === 'setup') this.setHexCoords();
  }

  setHexCoords(): void {
    console.log('>>> settings coordinates');
    const localHexData = [];

    for (let q = -this.radius; q <= this.radius; q++) {
      for (let r = Math.max(-this.radius, -q - this.radius); r <= Math.min(this.radius, -q + this.radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        localHexData.push({ q, r, s });
      }
    }

    if (this.gameState === 'setup')
      this.hexManagementService.setBackGroundHexData(localHexData, 'GridComponent.setHexCoords backgroundHexData');
  }
}

import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { DIRECTION, DIRECTIONS } from '@app/shared/constants';
import { isSameHexArray, isHexAEqualHexB, CLOSEST_TO_BORDER, sortHexDataArray } from '@app/shared/helpers';
import { HexCoord, HexData } from '@app/shared/interfaces';
import { Direction, HexCoordKey, ValueQuantityMap, ValueQuantityPair } from '@app/shared/types';

@Component({
  selector: 'app-game-control',
  standalone: true,
  imports: [],
  templateUrl: './game-control.component.html',
  styleUrl: './game-control.component.scss',
})
export class GameControlComponent implements OnInit, OnDestroy {
  private unlisten: null | (() => void) = null;
  radius!: number;
  hexData!: HexData[];

  constructor(
    private readonly renderer: Renderer2,
    private readonly gameSetupService: GameSetupService,
    private readonly hexManagementService: HexManagementService,
  ) {
    this.gameSetupService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => prev.radius === curr.radius))
      .subscribe((state) => {
        this.radius = state.radius;
      });

    this.hexManagementService.state$
      .pipe(takeUntilDestroyed())
      .pipe(distinctUntilChanged((prev, curr) => isSameHexArray(prev.hexData, curr.hexData)))
      .subscribe((state) => {
        this.hexData = state.hexData;

        if (state.hexData.length === 0) this.setNextTurnHexData();
      });
  }

  get maxHexCount(): number {
    return 1 + 3 * this.radius * (this.radius + 1);
  }

  ngOnInit(): void {
    this.unlisten = this.renderer.listen('document', 'keydown', (event) => {
      switch (event.code) {
        case 'KeyQ': {
          this.moveQ();
          break;
        }
        case 'KeyW': {
          this.moveW();
          break;
        }
        case 'KeyE': {
          this.moveE();
          break;
        }
        case 'KeyA': {
          this.moveA();
          break;
        }
        case 'KeyS': {
          this.moveS();
          break;
        }
        case 'KeyD': {
          this.moveD();
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  canMove(direction: Direction, hexDataArray: HexData[]): boolean {
    return hexDataArray.some((hex) => {
      const neighborCoord = this.getNeighborCoord(hex, direction);
      return this.isHexInRange(neighborCoord) && !this.getHex(neighborCoord, hexDataArray);
    });
  }

  getNeighborCoord(hexA: HexCoord | HexData, direction: Direction): HexCoord {
    return this.addHexCoord(hexA, DIRECTIONS[direction]);
  }

  addHexCoord(hexA: HexCoord | HexData, hexB: HexCoord | HexData): HexCoord {
    return {
      q: hexA.q + hexB.q,
      r: hexA.r + hexB.r,
      s: hexA.s + hexB.s,
    };
  }

  isHexInRange(hex: HexCoord | HexData): boolean {
    const hexCoordKeys: HexCoordKey[] = ['q', 's', 'r'];
    const hasViolatedRange = hexCoordKeys.some((key) => Math.abs(hex[key]) > this.radius);

    return !hasViolatedRange;
  }

  getHex(hexCoord: HexCoord | HexData, hexDataArray: HexData[]): HexData | undefined {
    return hexDataArray.find((hexData) => {
      return isHexAEqualHexB(hexData, hexCoord);
    });
  }

  processMove(direction: Direction, hexDataArray: HexData[]): HexData[] {
    if (!this.canMove(direction, hexDataArray)) return hexDataArray;

    const processedHexes: HexData[] = [];

    return this.processMove(
      direction,
      hexDataArray.map((hex, i, initialArray) => {
        const comparisonArray = processedHexes.concat(initialArray.slice(i));

        let newHex: HexData = { ...hex };

        while (true) {
          const neighborCoord = this.getNeighborCoord(newHex, direction);
          const isInRange = this.isHexInRange(neighborCoord);

          if (!isInRange) break;

          const neighbor = this.getHex(neighborCoord, comparisonArray);

          if (neighbor) break;

          newHex = { ...newHex, ...neighborCoord };
        }

        processedHexes.push(newHex);
        return newHex;
      }),
    );
  }

  processMerge(direction: Direction, hexDataArray: HexData[]): HexData[] {
    const mergedHexes: HexData[] = [];
    const result: HexData[] = [];

    hexDataArray.sort(CLOSEST_TO_BORDER[direction]).forEach((hex, i, initialArray) => {
      const comparisonArray = result.concat(initialArray.slice(i));

      let newHex: HexData = { ...hex };

      const neighborCoord = this.getNeighborCoord(newHex, direction);
      const neighbor = this.getHex(neighborCoord, comparisonArray);

      if (!neighbor) return result.push(newHex);

      const isSameValue = newHex.value === neighbor.value;

      if (!isSameValue) return result.push(newHex);

      newHex = { ...newHex, value: newHex.value * 2 };
      mergedHexes.push(neighbor);

      return result.push(newHex);
    });

    return result.filter((hex) => !mergedHexes.includes(hex));
  }

  getDuplicateHexValues(): HexData['value'][] {
    return Array.from<ValueQuantityPair>(
      this.hexData.reduce<ValueQuantityMap>((acc, currHex) => {
        if (acc.has(currHex.value)) {
          acc.set(currHex.value, acc.get(currHex.value)! + 1);
        } else {
          acc.set(currHex.value, 1);
        }
        return acc;
      }, new Map<number, number>()),
    ).flatMap((vqPair) => (vqPair[1] > 1 ? vqPair[0] : []));
  }

  isGameOver(): void {
    if (this.hexData.length !== this.maxHexCount) return;

    const duplicateHexValues = this.getDuplicateHexValues();

    if (!duplicateHexValues.length) return this.gameSetupService.setGameState('game-over');

    const potentialMergeHexes = this.hexData.filter((hex) => duplicateHexValues.includes(hex.value));

    const canMerge = potentialMergeHexes.some((hex) => {
      const neighborCoords = Object.values(DIRECTION)
        .map((direction) => this.getNeighborCoord(hex, direction))
        .filter((hex) => this.isHexInRange(hex));

      const neighbors = neighborCoords
        .map((neighborCoord) => this.getHex(neighborCoord, potentialMergeHexes))
        .filter((el) => el !== undefined);

      return neighbors.some((neighbor) => neighbor && neighbor.value === hex.value);
    });

    if (!canMerge) return this.gameSetupService.setGameState('game-over');
  }

  performMove(direction: Direction): void {
    let localHexData = [...this.hexData];

    localHexData = this.processMove(direction, localHexData);
    localHexData = this.processMerge(direction, localHexData);
    localHexData = this.processMove(direction, localHexData);
    localHexData = sortHexDataArray(localHexData);

    const isSameHexData = isSameHexArray(localHexData, this.hexData);

    if (isSameHexData) return;

    this.setNextTurnHexData(localHexData);
  }

  setNextTurnHexData(thisTurnHexData: HexData[] = []): void {
    this.hexManagementService.getNewHexCoords(this.radius, thisTurnHexData).subscribe((newHexData) => {
      if (newHexData.length === 0) return this.gameSetupService.setGameState('game-over');

      this.hexManagementService.setHexData(
        thisTurnHexData.concat(newHexData),
        'GameControlComponent.setNextTurnHexData()',
      );

      this.isGameOver();
    });
  }

  moveQ(): void {
    this.performMove(DIRECTION.Q);
  }

  moveW(): void {
    this.performMove(DIRECTION.W);
  }

  moveE(): void {
    this.performMove(DIRECTION.E);
  }

  moveA(): void {
    this.performMove(DIRECTION.A);
  }

  moveS(): void {
    this.performMove(DIRECTION.S);
  }

  moveD(): void {
    this.performMove(DIRECTION.D);
  }
}

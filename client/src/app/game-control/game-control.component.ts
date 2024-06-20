import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { DIRECTION, DIRECTIONS } from '@app/shared/constants';
import {
  compareHexManagementStateKey,
  isHexAEqualHexB,
  CLOSEST_TO_BORDER,
  areHexArraysEqual,
  sortHexDataArray,
} from '@app/shared/helpers';
import { HexCoord, HexData } from '@app/shared/interfaces';
import { Direction, HexCoordKey } from '@app/shared/types';

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
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return compareHexManagementStateKey(prev, curr, 'hexData');
        }),
      )
      .subscribe((state) => {
        this.hexData = state.hexData;
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

    this.setNextTurnHexData();
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

  performMove(direction: Direction): void {
    let localHexData = [...this.hexData];

    localHexData = this.processMove(direction, localHexData);
    localHexData = this.processMerge(direction, localHexData);
    localHexData = this.processMove(direction, localHexData);
    localHexData = sortHexDataArray(localHexData);

    const isSameHexData = areHexArraysEqual(localHexData, this.hexData);

    // TODO: implement something that checks if it is possible to merge when all cells are occupied
    if (localHexData.length === this.maxHexCount) {
      alert('max hex count');
      // !Object.values(DIRECTION).some((d) => this.canMove(d, localHexData))
    }

    if (isSameHexData) return;

    this.hexManagementService.setHexData(localHexData, 'GameControlComponent.performMove()');
    this.setNextTurnHexData();
  }

  moveQ() {
    this.performMove(DIRECTION.Q);
  }

  moveW() {
    this.performMove(DIRECTION.W);
  }

  moveE() {
    this.performMove(DIRECTION.E);
  }

  moveA() {
    this.performMove(DIRECTION.A);
  }

  moveS() {
    this.performMove(DIRECTION.S);
  }

  moveD() {
    this.performMove(DIRECTION.D);
  }

  setNextTurnHexData() {
    // TODO:
    // 1. receive an array of updated data ✅ -> done in this.performMove
    // 2. SORT the updated data ✅ -> done in this.performMove
    // 3. check if the new array is the same as the previous ✅ -> done in this.performMove
    // 4. if the same -> do nothing ✅ -> done in this.performMove
    // 5. animation of moving merging?
    // 6. update state?
    // 7. fetch new hex data
    // 8. SORT new data (✅ this is done in service when updating the state)
    // 9. arrival animation
    // 10. update state again?

    /* --------- */
    const localHexData = this.hexManagementService.getHexData();
    this.hexManagementService.getNewHexCoords(this.radius, localHexData).subscribe((newHexCoords) => {
      this.hexManagementService.setHexData(
        localHexData.concat(newHexCoords.map((hex) => ({ ...hex, animation: 'zoom-in' }))),
        'GameControlComponent.setNextTurnHexData()',
      );

      // TODO: Implement proper error handling for case when server did not reply
      if (newHexCoords.length === 0) return this.gameSetupService.setGameState('game-over');
    });
  }
}

import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { DIRECTION, DIRECTIONS } from '@app/shared/constants';
import { compareHexManagementStateKey, isHexAEqualHexBNew } from '@app/shared/helpers';
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
          console.log('GameControlComponent hexData distinctUntilChanged');
          return compareHexManagementStateKey(prev, curr, 'hexData');
        }),
      )
      .subscribe((state) => {
        this.hexData = state.hexData;
      });
  }

  setTESTNextTurnHexData() {
    if (this.radius === 1) {
      this.hexManagementService.setHexData(
        [
          { q: 0, r: 1, s: -1, value: 1 },
          { q: 1, r: 0, s: -1, value: 2 },
          { q: -1, r: 0, s: 1, value: 3 },
        ],
        'GameControlComponent.setTextNextTurnHexData()',
      );
    } else {
      // const testHexData = [
      //   { q: 1, r: 1, s: -2, value: 4 },
      //   { q: -1, r: -1, s: 2, value: 3 },
      //   { q: 1, r: -1, s: 0, value: 3 },
      //   { q: 0, r: 1, s: -1, value: 1 },
      //   { q: 2, r: -1, s: -1, value: 3 },
      //   { q: 3, r: -1, s: -2, value: 3 },
      // ].sort(() => Math.random() - 0.5);
      const testHexData: HexData[] = [
        { q: 0, r: 1, s: -1, value: 1 },
        { q: 1, r: 1, s: -2, value: 4 },
      ];

      this.hexManagementService.setHexData(testHexData, 'GameControlComponent.setTextNextTurnHexData()');
    }
  }

  ngOnInit(): void {
    this.setTESTNextTurnHexData();
    // this.setNextTurnHexData();
    this.unlisten = this.renderer.listen('document', 'keydown', (event) => {
      switch (event.code) {
        case 'KeyQ': {
          this.movePlusS();
          break;
        }
        case 'KeyW': {
          this.moveMinusR();
          break;
        }
        case 'KeyE': {
          this.movePlusQ();
          break;
        }
        case 'KeyA': {
          this.moveMinusQ();
          break;
        }
        case 'KeyS': {
          this.movePlusR();
          break;
        }
        case 'KeyD': {
          this.moveMinusS();
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

  getNeighborHex(hex: HexData, comparisonArray: HexData[], direction: Direction): HexData | undefined {
    const neighborCoords = this.getNeighborCoord(hex, direction);
    return comparisonArray.find((hexData) => {
      return isHexAEqualHexBNew(hexData, neighborCoords);
    });
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
      return isHexAEqualHexBNew(hexData, hexCoord);
    });
  }

  processMove(direction: Direction, hexDataArray: HexData[]): HexData[] {
    let canMove = this.canMove(direction, hexDataArray);

    if (!canMove) return hexDataArray;

    const processedHexes: HexData[] = [];

    return this.processMove(
      direction,
      hexDataArray.map((hex, i, initialArray) => {
        let newHex: HexData = { ...hex };

        const comparisonArray = processedHexes.concat(initialArray.slice(i));

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

    hexDataArray
      .sort((el1, el2) => el2.s - el1.s)
      .forEach((hex, i, initialArray) => {
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

  movePlusS() {
    let localHexData = [...this.hexData];

    localHexData = this.processMove(DIRECTION.PLUS_S, localHexData);
    // localHexData = this.processMerge(DIRECTION.PLUS_S, localHexData);
    // localHexData = this.processMove(DIRECTION.PLUS_S, localHexData);

    this.hexManagementService.setHexData(localHexData, 'GameControlComponent.processMove()');

    // TODO: implement fetching hexData after move animation complete

    // newHexData = this.processMove(DIRECTION.PLUS_S, this.hexData, false);
    // this.hexManagementService.setHexData(newHexData, 'GameControlComponent.processMove()');
  }

  moveMinusR() {
    console.log('W clicked -> move -r,\n\nq stays the same');

    // this.processMove(DIRECTION.MINUS_R);
  }

  movePlusQ() {
    console.log('E clicked -> move +q,\n\ns stays the same');

    // this.processMove(DIRECTION.PLUS_Q);
  }

  moveMinusQ() {
    console.log('A clicked -> move -q,\n\ns stays the same');

    // this.processMove(DIRECTION.MINUS_Q);
  }

  movePlusR() {
    console.log('S clicked -> move +r,\n\nq stays the same');

    // this.processMove(DIRECTION.PLUS_R);
  }

  moveMinusS() {
    console.log('D clicked -> move -s,\n\nr stays the same');
    // this.processMove(DIRECTION.MINUS_S);
  }

  // TODO: move state change to service
  setNextTurnHexData() {
    const localHexData = this.hexManagementService.getHexData().filter((hex) => Boolean(hex.value));

    this.hexManagementService.getNewHexCoords(this.radius, localHexData).subscribe((newHexCoords) => {
      this.hexManagementService.setHexData(
        localHexData.concat(newHexCoords),
        'GameControlComponent.setNextTurnHexData()',
      );

      if (newHexCoords.length === 0)
        this.gameSetupService.setGameState('game-over', 'GameControlComponent.setNextTurnHexData()');
    });
  }
}

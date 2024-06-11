import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { GameSetupService } from '@app/shared/services/game-setup';
import { HexManagementService } from '@app/shared/services/hex-management';
import { DIRECTION, DIRECTIONS } from '@app/shared/constants';
import { compareHexData, isHexAEqualHexB } from '@app/shared/helpers/';
import { HexData } from '@app/shared/interfaces';
import { Direction, RequiredHexDataKey } from '@app/shared/types';

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
      .pipe(distinctUntilChanged((prev, curr) => compareHexData(prev, curr, 'hexData')))
      .subscribe((state) => {
        this.hexData = state.hexData;
      });
  }

  setTextNextTurnHexData() {
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
      this.hexManagementService.setHexData(
        [
          // { q: -2, r: 1, s: 1, value: 1 },
          // { q: 2, r: 0, s: -2, value: 2 },
          // { q: 0, r: -1, s: 1, value: 3 },
          { q: 1, r: 1, s: -2, value: 4 },
          { q: -1, r: -1, s: 2, value: 3 },
          { q: 1, r: -1, s: 0, value: 3 },
          { q: 0, r: 1, s: -1, value: 1 },
          // test
          // { q: -2, r: -1, s: 3, value: 6 },
          // { q: -3, r: 1, s: 2, value: 5 },
          // { q: -2, r: 1, s: 1, value: 4 },
        ],
        'GameControlComponent.setTextNextTurnHexData()',
      );
    }
  }

  ngOnInit(): void {
    this.setTextNextTurnHexData();
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

  processMove(direction: Direction, hexDataArray: HexData[], shouldMerge = false): HexData[] {
    return hexDataArray.reduce<HexData[]>((acc, currenthHex, i, initialArray) => {
      const comparisonArray = acc.concat(initialArray.slice(i));

      while (true) {
        const potentialNewHexValue = this.getNeighborCoords(currenthHex, direction);
        const neighbor = this.getNeighborHex(currenthHex, comparisonArray, direction);

        const isInRange = this.isHexInRange(potentialNewHexValue);

        if (!isInRange) break;

        if (neighbor !== undefined) {
          const isSameValue = currenthHex.value === neighbor.value;

          if (!isSameValue || !shouldMerge) break;

          potentialNewHexValue.value! *= 2;
          acc = acc.filter((hexData) => !isHexAEqualHexB(hexData, neighbor));
        }
        currenthHex = potentialNewHexValue;
      }

      acc.push(currenthHex);
      return acc;
    }, []);
  }

  getNeighborCoords(hexA: HexData, direction: Direction): HexData {
    return this.addHex(hexA, DIRECTIONS[direction]);
  }

  addHex(hexA: HexData, hexB: HexData): HexData {
    return {
      q: hexA.q + hexB.q,
      r: hexA.r + hexB.r,
      s: hexA.s + hexB.s,
      value: hexA.value,
    };
  }

  getNeighborHex(hex: HexData, comparisonArray: HexData[], direction: Direction): HexData | undefined {
    const neighborCoords = this.getNeighborCoords(hex, direction);
    return comparisonArray.find((hexData) => {
      return isHexAEqualHexB(hexData, neighborCoords);
    });
  }

  isHexInRange(hex: HexData): boolean {
    const requiredHexDataKeys: RequiredHexDataKey[] = ['q', 's', 'r'];
    const hasViolatedRange = requiredHexDataKeys.some((key) => Math.abs(hex[key]) > this.radius);

    return !hasViolatedRange;
  }

  canMove(hexDataArray: HexData[], direction: Direction): boolean {
    return hexDataArray.some((hex) => {
      return (
        this.isHexInRange(this.getNeighborCoords(hex, direction)) && !this.getNeighborHex(hex, hexDataArray, direction)
      );
    });
  }

  movePlusS() {
    let localHexData = this.hexData;

    let canMove = this.canMove(localHexData, DIRECTION.PLUS_S);
    let firstLoop = true;

    while (canMove) {
      localHexData = this.processMove(DIRECTION.PLUS_S, localHexData, firstLoop);
      firstLoop = false;
      canMove = this.canMove(localHexData, DIRECTION.PLUS_S);
    }

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

  subtractHex(hexA: HexData, hexB: HexData): HexData {
    return {
      q: hexA.q - hexB.q,
      r: hexA.r - hexB.r,
      s: hexA.s - hexB.s,
      value: hexA.value,
    };
  }

  len(hex: HexData): number {
    return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2;
  }

  distance(hexA: HexData, hexB: HexData): number {
    return this.len(this.subtractHex(hexA, hexB));
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

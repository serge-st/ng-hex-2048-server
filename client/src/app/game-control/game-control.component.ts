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
    return hexDataArray.reduce<HexData[]>((acc, hex, i, initialArray) => {
      console.log(`>>>>> INITIATING MOVE FOR HEX: ${hex.value}`);

      const comparisonArray = acc.concat(initialArray.slice(i));

      let move = true;

      while (move) {
        const neighbor = this.getNeighborHex(hex, comparisonArray, direction);
        const potentialNewHexValue = this.neighbor(hex, direction);

        const isInRange = this.isHexInRange(potentialNewHexValue);

        console.log(`!!!>>> isInRange: ${isInRange}`);

        if (!isInRange) {
          move = false;
          console.log(`>>>>> is not in range NOT MOVING!`);
          break;
        }

        console.log(`!!!>>> isEmptyTest: ${!neighbor}`);

        // isNotEmpty
        if (neighbor !== undefined) {
          const isSameValue = hex.value === neighbor.value;

          console.log(`!!!>>> isSameValue: ${isSameValue}`);

          if (!isSameValue || !shouldMerge) {
            move = false;
            console.log(`>>>>> is not empty NOT MOVING!`);
            break;
          }

          potentialNewHexValue.value! *= 2;
          console.log(`!!!>>> merging!`);
          console.log(`!!!>>> neighbor: ${JSON.stringify(neighbor)}`);
          console.log(`!!!>>> acc: ${JSON.stringify(acc)}`);
          acc = acc.filter((hexData) => !isHexAEqualHexB(hexData, neighbor));
        }
        console.log(`!!!>>> moving!`);
        hex = potentialNewHexValue;
      }

      console.log(`!!!>>> pushing hex: ${JSON.stringify(hex)}`);
      acc.push(hex);
      return acc;
    }, []);
  }

  isHexInRange(hex: HexData): boolean {
    const requiredHexDataKeys: RequiredHexDataKey[] = ['q', 's', 'r'];
    const hasViolatedRange = requiredHexDataKeys.some((key) => Math.abs(hex[key]) > this.radius);

    return !hasViolatedRange;
  }

  getNeighborHex(hex: HexData, comparisonArray: HexData[], direction: Direction): HexData | undefined {
    const neighborCoords = this.neighbor(hex, direction);
    return comparisonArray.find((hexData) => {
      // console.log(`BBB comparing hex from array: ${JSON.stringify(hexData)}`);
      // console.log(`BBB with neighborCoords: ${JSON.stringify(neighborCoords)}`);
      // console.log(`BBB isHexAEqualHexB: ${isHexAEqualHexB(hexData, neighborCoords)}`);
      return isHexAEqualHexB(hexData, neighborCoords);
    });
  }

  canMove(hexDataArray: HexData[], direction: Direction): boolean {
    return hexDataArray.some((hex) => {
      console.log(`CCC IMPORTANT >>> potentialNextHex: ${JSON.stringify(hex)}`);
      console.log(`AAA >>> isHexInRange: ${this.isHexInRange(hex)}`);
      console.log(`AAA >>> comparisonArray: ${JSON.stringify(hexDataArray)}`);
      console.log(`AAA >>> neighbor hex: ${JSON.stringify(this.getNeighborHex(hex, hexDataArray, direction))}`);
      console.log(`AAA >>> neighbor hex is empty: ${!this.getNeighborHex(hex, hexDataArray, direction)}`);
      console.log(
        `AAA >>> canItMove: ${this.isHexInRange(this.neighbor(hex, direction)) && !this.getNeighborHex(hex, hexDataArray, direction)}`,
      );

      return this.isHexInRange(this.neighbor(hex, direction)) && !this.getNeighborHex(hex, hexDataArray, direction);
    });
  }

  movePlusS() {
    console.log('Q clicked -> move +s,\n\nr stays the same');
    console.log(`hexData: ${JSON.stringify(this.hexData)},\n\nradius: ${this.radius}`);

    let localHexData = this.hexData;

    let canMove = this.canMove(localHexData, DIRECTION.PLUS_S);
    let firstLoop = true;

    console.log(`canMove: ${canMove}`);

    let itter = 0;

    while (canMove) {
      localHexData = this.processMove(DIRECTION.PLUS_S, localHexData, firstLoop);
      console.log(`AAA localHexData: ${JSON.stringify(localHexData)}`);
      firstLoop = false;
      canMove = this.canMove(localHexData, DIRECTION.PLUS_S);
      console.log(`canMove: ${canMove}`);
      if (itter > 2) canMove = false;
      // itter++;
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

  addHex(hexA: HexData, hexB: HexData): HexData {
    return {
      q: hexA.q + hexB.q,
      r: hexA.r + hexB.r,
      s: hexA.s + hexB.s,
      value: hexA.value,
    };
  }

  subtractHex(hexA: HexData, hexB: HexData): HexData {
    return {
      q: hexA.q - hexB.q,
      r: hexA.r - hexB.r,
      s: hexA.s - hexB.s,
      value: hexA.value,
    };
  }

  neighbor(hexA: HexData, direction: Direction): HexData {
    return this.addHex(hexA, DIRECTIONS[direction]);
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

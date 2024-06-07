import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class GameControlComponent implements OnInit {
  radius!: number;
  hexData!: HexData[];

  constructor(
    private gameSetupService: GameSetupService,
    private hexManagementService: HexManagementService,
    private renderer: Renderer2,
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
        ],
        'GameControlComponent.setTextNextTurnHexData()',
      );
    }
  }

  ngOnInit(): void {
    this.setTextNextTurnHexData();
    // this.setNextTurnHexData();
    this.renderer.listen('document', 'keydown', (event) => {
      switch (event.key.toLowerCase()) {
        case 'q': {
          this.movePlusS();
          break;
        }
        case 'w': {
          this.moveMinusR();
          break;
        }
        case 'e': {
          this.movePlusQ();
          break;
        }
        case 'a': {
          this.moveMinusQ();
          break;
        }
        case 's': {
          this.movePlusR();
          break;
        }
        case 'd': {
          this.moveMinusS();
          break;
        }
      }
    });
  }

  // TODO: have 2 variants with merge and without merge
  processMove(direction: Direction) {
    const newHexData = this.hexData.reduce<HexData[]>((acc, hex, i, initialArray) => {
      console.log(`>>>>> INITIATING MOVE FOR HEX: ${hex.value}`);

      const comparisonArray = acc.concat(initialArray.slice(i));

      let move = true;

      while (move) {
        const neighborCoords = this.neighbor(hex, direction);
        const neighborTest = comparisonArray.find((hexData) => isHexAEqualHexB(hexData, neighborCoords));

        const requiredHexDataKeys: RequiredHexDataKey[] = ['q', 's', 'r'];

        const isInRangeTest = !requiredHexDataKeys.some((key) => Math.abs(neighborCoords[key]) > this.radius);

        console.log(`!!!>>> isInRangeTest: ${isInRangeTest}`);

        if (!isInRangeTest) {
          move = false;
          console.log(`>>>>> is not in range NOT MOVING!`);
          break;
        }

        console.log(`!!!>>> isEmptyTest: ${!neighborTest}`);

        // isNotEmpty
        if (neighborTest !== undefined) {
          const isSameValue = hex.value === neighborTest.value;

          console.log(`!!!>>> isSameValue: ${isSameValue}`);

          if (!isSameValue) {
            move = false;
            console.log(`>>>>> is not empty NOT MOVING!`);
            break;
          }

          neighborCoords.value! *= 2;
          console.log(`!!!>>> merging!`);
          console.log(`!!!>>> neighborTest: ${JSON.stringify(neighborTest)}`);
          console.log(`!!!>>> acc: ${JSON.stringify(acc)}`);
          // todo remove neighborTest from acc
          acc = acc.filter((hexData) => !isHexAEqualHexB(hexData, neighborTest));
        }
        console.log(`!!!>>> moving!`);
        hex = neighborCoords;
      }

      console.log(`!!!>>> pushing hex: ${JSON.stringify(hex)}`);
      acc.push(hex);
      return acc;
    }, []);

    // todo: extract saving into movePlus/minus methods
    this.hexManagementService.setHexData(newHexData, 'GameControlComponent.processMove()');
    // TODO: implement fetching hexData after move animation complete
  }

  movePlusS() {
    console.log('Q clicked -> move +s,\n\nr stays the same');
    console.log(`hexData: ${JSON.stringify(this.hexData)},\n\nradius: ${this.radius}`);
    this.processMove(DIRECTION.PLUS_S);

    // todo: if after first merge there are hexes with empty neighbors
    // run processMove again without merge till there are no empty neighbors
  }

  moveMinusR() {
    console.log('W clicked -> move -r,\n\nq stays the same');

    this.processMove(DIRECTION.MINUS_R);
  }

  movePlusQ() {
    console.log('E clicked -> move +q,\n\ns stays the same');

    this.processMove(DIRECTION.PLUS_Q);
  }

  moveMinusQ() {
    console.log('A clicked -> move -q,\n\ns stays the same');

    this.processMove(DIRECTION.MINUS_Q);
  }

  movePlusR() {
    console.log('S clicked -> move +r,\n\nq stays the same');

    this.processMove(DIRECTION.PLUS_R);
  }

  moveMinusS() {
    console.log('D clicked -> move -s,\n\nr stays the same');
    this.processMove(DIRECTION.MINUS_S);
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

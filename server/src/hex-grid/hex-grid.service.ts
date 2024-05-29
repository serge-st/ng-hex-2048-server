import { Injectable } from '@nestjs/common';
import { HexCoordDTO } from './common/dto';
import {
  GAME_DIFFICULTY_THRESHOLD,
  HEX_HIGH_VALUE_PROBABILITY,
  NEW_HEX_COUNT_INITIAL,
} from './common/constants/constants';

@Injectable()
export class HexGridService {
  calculateNextMoveCoords(radius: number, userCoords: HexCoordDTO[]): HexCoordDTO[] {
    const availableHexCoords = this.getAvailableHexCoords(radius, userCoords);
    if (availableHexCoords.length === 0) return [];

    const userCoordCount = userCoords.length;

    const newHexCount = this.getNewHexCount(availableHexCoords.length, userCoordCount);

    const hexValue = this.getHexValue(userCoordCount);

    return this.getRandomHexCoords(availableHexCoords, newHexCount).map((hexCoord) => {
      hexCoord.value = hexValue;
      return hexCoord;
    });
  }

  getAvailableHexCoords(radius: number, userCoords: HexCoordDTO[]) {
    if (userCoords.length === 0) return this.getHexGrid(radius);

    return this.getHexGrid(radius).filter((hexCoord) => {
      // Array.prototype.some() stops as soon as it finds a match
      const isCoordTaken = userCoords.some((userCoord) => {
        return this.isHexAEqualHexB(hexCoord, userCoord);
      });

      return !isCoordTaken;
    });
  }

  getHexGrid(radius: number): HexCoordDTO[] {
    const result: HexCoordDTO[] = [];

    for (let q = -radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        result.push({ q, r, s });
      }
    }
    return result;
  }

  isHexAEqualHexB = (hexA: HexCoordDTO, hexB: HexCoordDTO) => {
    const keysToCompare = ['q', 's', 'r'];
    const hasMismatch = keysToCompare.some((key) => hexA[key as keyof HexCoordDTO] !== hexB[key as keyof HexCoordDTO]);
    return !hasMismatch;
  };

  getNewHexCount(availableCoordCount: number, userCoordCount: number): number {
    if (userCoordCount === 0) return NEW_HEX_COUNT_INITIAL;

    return Math.min(availableCoordCount, this.getPercentage() > GAME_DIFFICULTY_THRESHOLD ? 2 : 1);
  }

  getPercentage(): number {
    return Math.ceil(Math.random() * 100);
  }

  getHexValue(userCoordCount: number): number {
    if (userCoordCount === 0) return 2;
    return this.getPercentage() > HEX_HIGH_VALUE_PROBABILITY ? 4 : 2;
  }

  getRandomHexCoords(availableHexCoords: HexCoordDTO[], coordCount: number): HexCoordDTO[] {
    return availableHexCoords
      .map((hexCoord) => ({
        order: this.getPercentage(),
        value: hexCoord,
      }))
      .sort((a, b) => a.order - b.order)
      .map((a) => a.value)
      .splice(0, coordCount);
  }
}

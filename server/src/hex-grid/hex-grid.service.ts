import { Injectable } from '@nestjs/common';
import { HexDataDTO, HexCoordDTO } from './common/dto';
import {
  GAME_DIFFICULTY_THRESHOLD,
  HEX_HIGH_VALUE_PROBABILITY,
  NEW_HEX_COUNT_INITIAL,
} from './common/constants/constants';
import { RequiredHexCoordKey } from './common/types';

@Injectable()
export class HexGridService {
  calculateNextMoveCoords(radius: number, userHexData: HexDataDTO[]): HexDataDTO[] {
    const availableHexCoords = this.getAvailableHexCoords(radius, userHexData);
    if (availableHexCoords.length === 0) return [];

    const userCoordCount = userHexData.length;

    const newHexCount = this.getNewHexCount(availableHexCoords.length, userCoordCount);

    const hexValue = this.getHexValue(userCoordCount);

    return this.getRandomHexCoords(availableHexCoords, newHexCount).map((hexCoord): HexDataDTO => {
      return { ...hexCoord, value: hexValue };
    });
  }

  getAvailableHexCoords(radius: number, userCoords: HexCoordDTO[]): HexCoordDTO[] {
    if (userCoords.length === 0) return this.getHexGrid(radius);

    return this.getHexGrid(radius).filter((hexCoord) => {
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

  isHexAEqualHexB = (hexA: HexCoordDTO, hexB: HexCoordDTO): boolean => {
    const hexCoordKeys: RequiredHexCoordKey[] = ['q', 's', 'r'];

    const hasMismatch = hexCoordKeys.some((key) => hexA[key] !== hexB[key]);
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

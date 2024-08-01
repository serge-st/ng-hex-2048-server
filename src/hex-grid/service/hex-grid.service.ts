import { Injectable } from '@nestjs/common';
import { HexDataDTO, HexCoordDTO } from '../common/dto';
import {
  GAME_DIFFICULTY_THRESHOLD,
  HEX_COUNT_RADIUS_1,
  HEX_HIGH_VALUE_PROBABILITY,
  LARGE_HEX_BASE_COUNT,
  NEW_HEX_COUNT_INITIAL,
  SMALL_HEX_BASE_COUNT,
} from '../common/constants';
import { RequiredHexCoordKey } from '../common/types';
import { getDifficultyModifier, getHexCountModifier } from '../common/helpers';

@Injectable()
export class HexGridService {
  calculateNextMoveCoords(radius: number, userHexData: HexDataDTO[]): HexDataDTO[] {
    const availableHexCoords = this.getAvailableHexCoords(radius, userHexData);
    if (availableHexCoords.length === 0) return [];

    const userCoordCount = userHexData.length;

    const newHexCount = this.getNewHexCount(availableHexCoords.length, userCoordCount, radius);

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

  getNewHexCount(availableCoordCount: number, userCoordCount: number, radius: number): number {
    if (userCoordCount === 0) return NEW_HEX_COUNT_INITIAL;
    if (radius === 1) return HEX_COUNT_RADIUS_1;

    const difficultyThreshold = GAME_DIFFICULTY_THRESHOLD - getDifficultyModifier(radius);
    const hexCountModifier = getHexCountModifier(radius);
    const largeHexCount = LARGE_HEX_BASE_COUNT + hexCountModifier;
    const smallHexCount = SMALL_HEX_BASE_COUNT + hexCountModifier;

    return Math.min(availableCoordCount, this.getPercentage() > difficultyThreshold ? largeHexCount : smallHexCount);
  }

  getPercentage(): number {
    return Math.ceil(Math.random() * 100);
  }

  getHexValue(userCoordCount: number): number {
    if (userCoordCount === 0) return 2;
    return this.getPercentage() > HEX_HIGH_VALUE_PROBABILITY ? 4 : 2;
  }

  getOrderIndex(hexCount: number): number {
    return Math.floor(Math.random() * hexCount);
  }

  getRandomHexCoords(availableHexCoords: HexCoordDTO[], coordCount: number): HexCoordDTO[] {
    const arrayLength = availableHexCoords.length;

    return availableHexCoords
      .map((hexCoord) => ({
        order: this.getOrderIndex(arrayLength),
        value: hexCoord,
      }))
      .sort((a, b) => a.order - b.order)
      .map((a) => a.value)
      .splice(0, coordCount);
  }
}

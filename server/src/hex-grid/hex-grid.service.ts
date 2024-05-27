import { Injectable } from '@nestjs/common';
import { HexCoordDTO } from './common/dto/hex-coord/hex-coord.dto';

@Injectable()
export class HexGridService {
  // TODO: rename the method
  getResult(radius: number, userCoords: HexCoordDTO[]): HexCoordDTO[] {
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
    const hasMismatch = ['q', 's', 'r'].some((key) => hexA[key] !== hexB[key]);
    return !hasMismatch;
  };

  getNewHexCount(availableCoordCount: number, userCoordCount: number): number {
    if (userCoordCount === 0) return 3;

    return Math.min(availableCoordCount, this.getPercentage() > 80 ? 2 : 1);
  }

  getPercentage(): number {
    return Math.ceil(Math.random() * 100);
  }

  getHexValue(userCoordCount: number): number {
    if (userCoordCount === 0) return 2;
    return this.getPercentage() > 50 ? 4 : 2;
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

import { Injectable } from '@nestjs/common';
import { HexCoordDTO } from './common/dto/hex-coord/hex-coord.dto';
import { performance } from 'node:perf_hooks';

@Injectable()
export class HexGridService {
  getResultOld(radius: number, userPoints: HexCoordDTO[]) {
    performance.mark('mark_function_start');
    const initialMemory = process.memoryUsage().heapUsed;
    const availablePositions = this.getRNGPoints(radius, userPoints);

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryUsed = finalMemory - initialMemory;
    console.log(`Memory used: ${memoryUsed.toFixed(2)}`);

    performance.mark('mark_function_end');

    performance.measure(
      'measure_func_perf',
      'mark_function_start',
      'mark_function_end',
    );
    console.log(performance.getEntries());
    performance.clearMarks();
    performance.clearMeasures();

    console.log('availablePositions old', availablePositions);
  }

  // Execution order 1
  getRNGPoints(radius: number, userPoints: HexCoordDTO[]) {
    return this.getFieldPoints(radius).filter((position) => {
      return !userPoints.some((userPoint) =>
        this.arePointsSame(position, userPoint),
      );
    });
  }

  arePointsSame = (a: HexCoordDTO, b: HexCoordDTO) => {
    return !['q', 's', 'r'].some((v) => a[v] !== b[v]);
  };

  // Execution order 2
  getFieldPoints(radius: number): HexCoordDTO[] {
    const result: HexCoordDTO[] = [];

    for (let q = -radius; q <= radius; q++) {
      for (
        let r = Math.max(-radius, -q - radius);
        r <= Math.min(radius, -q + radius);
        r++
      ) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        result.push({ q, r, s });
      }
    }
    return result;
  }

  getResult(radius: number, userCoords: HexCoordDTO[]) {
    const availablePositions = this.getAvailableCoords(radius, userCoords);
    console.log('availablePositions new', availablePositions);
  }

  isHexAEqualHexB = (hexA: HexCoordDTO, hexB: HexCoordDTO) => {
    const hasMismatch = ['q', 's', 'r'].some((key) => hexA[key] !== hexB[key]);
    return !hasMismatch;
  };

  getHexCoords(radius: number): HexCoordDTO[] {
    const result: HexCoordDTO[] = [];

    for (let q = -radius; q <= radius; q++) {
      for (
        let r = Math.max(-radius, -q - radius);
        r <= Math.min(radius, -q + radius);
        r++
      ) {
        // added "|| 0" to prevent "-0" values
        const s = -q - r || 0;
        result.push({ q, r, s });
      }
    }
    return result;
  }

  getAvailableCoords(radius: number, userCoords: HexCoordDTO[]) {
    if (userCoords.length === 0) return this.getHexCoords(radius);

    return this.getHexCoords(radius).filter((hexCoord) => {
      // Array.prototype.some() stops as soon as it finds a match
      const isCoordTaken = userCoords.some((userCoord) => {
        return this.isHexAEqualHexB(hexCoord, userCoord);
      });

      return !isCoordTaken;
    });
  }
}

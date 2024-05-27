import { Controller, Get } from '@nestjs/common';
import { HexGridService } from './hex-grid.service';
import { HexCoordDTO } from './common/dto/hex-coord/hex-coord.dto';

@Controller('hex-grid')
export class HexGridController {
  constructor(private hexGridService: HexGridService) {}

  @Get()
  getHexGrid() {
    // const userPoints = [{ q: 0, r: 0, s: 0 }];
    const userPoints: HexCoordDTO[] = [
      { q: 0, r: 0, s: 0, value: 2 },
      { q: -1, r: 0, s: 1, value: 2 },
      { q: -1, r: 1, s: 0, value: 2 },
      { q: 0, r: 1, s: -1, value: 2 },
      { q: 1, r: 0, s: -1, value: 2 },
      { q: 1, r: -1, s: 0, value: 2 },
      { q: 0, r: -1, s: 1, value: 2 },
    ];
    // const userPoints = [];
    return this.hexGridService.getResult(2, userPoints);
  }
}

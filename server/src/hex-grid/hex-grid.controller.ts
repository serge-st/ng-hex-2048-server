import { Controller, Get } from '@nestjs/common';
import { HexGridService } from './hex-grid.service';

@Controller('hex-grid')
export class HexGridController {
  constructor(private hexGridService: HexGridService) {}

  @Get()
  getHexGrid() {
    const userPoints = [{ q: 0, r: 0, s: 0 }];
    // const userPoints = [
    //   { q: 0, r: 0, s: 0 },
    //   { q: -1, r: 0, s: 1 },
    // ];
    // const userPoints = [];
    return this.hexGridService.getResult(1, userPoints);
  }

  @Get('old')
  getHexGridOld() {
    const userPoints = [{ q: 0, r: 0, s: 0 }];
    return this.hexGridService.getResultOld(1, userPoints);
  }
}

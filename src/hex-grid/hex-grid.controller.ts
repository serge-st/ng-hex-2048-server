import { Body, Controller, Param, Post, Header } from '@nestjs/common';
import { HexGridService } from './hex-grid.service';
import { HexDataDTO } from './common/dto';
import { ParseHexArrayPipe } from './validation';

@Controller('hex-grid-management')
export class HexGridController {
  constructor(private hexGridService: HexGridService) {}

  @Post(':radius')
  @Header('Content-Type', 'application/json')
  getHexGrid(@Body(new ParseHexArrayPipe({ items: HexDataDTO })) body: HexDataDTO[], @Param('radius') radius: number) {
    return this.hexGridService.calculateNextMoveCoords(Number(radius), body);
  }
}

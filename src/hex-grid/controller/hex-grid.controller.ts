import { Body, Controller, Param, Post, Header, Get } from '@nestjs/common';
import { HexGridService } from '../service';
import { HexDataDTO } from '../common/dto';
import { ParseHexArrayPipe } from '../validation';

@Controller('hex-grid-management')
export class HexGridController {
  constructor(private hexGridService: HexGridService) {}

  @Post(':radius')
  @Header('Content-Type', 'application/json')
  getRandomHexes(
    @Body(new ParseHexArrayPipe({ items: HexDataDTO })) body: HexDataDTO[],
    @Param('radius') radius: number,
  ): HexDataDTO[] {
    return this.hexGridService.calculateNextMoveCoords(Number(radius), body);
  }

  @Get('test')
  test(): string {
    return 'Hello World';
  }
}

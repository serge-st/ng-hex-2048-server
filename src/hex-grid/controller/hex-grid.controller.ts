import { Body, Controller, Param, Post, Header, Logger } from '@nestjs/common';
import { HexGridService } from '../service';
import { HexDataDTO } from '../common/dto';
import { ParseHexArrayPipe } from '../validation';

@Controller('hex-grid-management')
export class HexGridController {
  constructor(
    private hexGridService: HexGridService,
    private logger: Logger,
  ) {}

  @Post(':radius')
  @Header('Content-Type', 'application/json')
  getRandomHexes(
    @Body(new ParseHexArrayPipe({ items: HexDataDTO })) body: HexDataDTO[],
    @Param('radius') radius: number,
  ): HexDataDTO[] {
    this.logger.log(`(POST) hex-grid-management/${radius} with body ${JSON.stringify(body)}`, 'HexGridController');
    return this.hexGridService.calculateNextMoveCoords(Number(radius), body);
  }
}

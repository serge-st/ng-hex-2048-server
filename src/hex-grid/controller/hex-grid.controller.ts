import { Body, Controller, Param, Post, Header, Logger, BadRequestException, Get } from '@nestjs/common';
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

    if (radius <= 10) return this.hexGridService.calculateNextMoveCoords(Number(radius), body);

    this.logger.log(`Radius ${radius} is too large, rejecting.`, 'HexGridController');
    throw new BadRequestException('Radius is too large. Maximum allowed radius is 10.');
  }

  @Get('test')
  getTest(): string {
    return 'Test successful!';
  }
}

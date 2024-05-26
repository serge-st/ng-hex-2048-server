import { Module } from '@nestjs/common';
import { HexGridController } from './hex-grid.controller';
import { HexGridService } from './hex-grid.service';

@Module({
  controllers: [HexGridController],
  providers: [HexGridService],
})
export class HexGridModule {}

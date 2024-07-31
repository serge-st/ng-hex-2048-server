import { Logger, Module } from '@nestjs/common';
import { HexGridController } from './controller';
import { HexGridService } from './service';

@Module({
  controllers: [HexGridController],
  providers: [HexGridService, Logger],
})
export class HexGridModule {}

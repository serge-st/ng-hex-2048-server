import { Logger, Module } from '@nestjs/common';
import { HexGridModule, HexGridService } from '@src/hex-grid';

@Module({
  imports: [HexGridModule],
  controllers: [],
  providers: [HexGridService, Logger],
})
export class AppModule {}

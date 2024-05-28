import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HexGridModule, HexGridService } from '@src/hex-grid';

@Module({
  imports: [HexGridModule],
  controllers: [AppController],
  providers: [AppService, HexGridService, Logger],
})
export class AppModule {}

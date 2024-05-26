import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HexGridService } from './hex-grid/hex-grid.service';
import { HexGridModule } from './hex-grid/hex-grid.module';

@Module({
  imports: [HexGridModule],
  controllers: [AppController],
  providers: [AppService, HexGridService, Logger],
})
export class AppModule {}

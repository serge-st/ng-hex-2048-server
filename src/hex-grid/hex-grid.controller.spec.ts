import { Test, TestingModule } from '@nestjs/testing';
import { HexGridController } from './hex-grid.controller';
import { HexGridService } from './hex-grid.service';

describe('HexGridController', () => {
  let controller: HexGridController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HexGridController],
      providers: [HexGridService],
    }).compile();

    controller = module.get<HexGridController>(HexGridController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

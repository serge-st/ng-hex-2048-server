import { Test, TestingModule } from '@nestjs/testing';
import { HexGridController } from './hex-grid.controller';

describe('HexGridController', () => {
  let controller: HexGridController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HexGridController],
    }).compile();

    controller = module.get<HexGridController>(HexGridController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

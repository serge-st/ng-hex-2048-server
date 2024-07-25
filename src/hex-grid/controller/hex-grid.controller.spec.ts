import { Test, TestingModule } from '@nestjs/testing';
import { HexGridController } from './hex-grid.controller';
import { HexGridService } from '../service/hex-grid.service';
import { HexDataDTO } from '../common/dto';

describe('HexGridController', () => {
  let controller: HexGridController;
  let service: HexGridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HexGridController],
      providers: [HexGridService],
    }).compile();

    controller = module.get<HexGridController>(HexGridController);
    service = module.get<HexGridService>(HexGridService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call calculateNextMoveCoords service method', () => {
    jest.spyOn(service, 'calculateNextMoveCoords');
    controller.getRandomHexes([], 1);
    expect(service.calculateNextMoveCoords).toHaveBeenCalled();
  });

  it('should return a HexDataDTO array', async () => {
    const result: HexDataDTO[] = [
      { q: 0, r: 1, s: -1, value: 2 },
      { q: 1, r: -1, s: 0, value: 2 },
      { q: -1, r: 1, s: 0, value: 2 },
    ];
    jest.spyOn(service, 'calculateNextMoveCoords').mockImplementation(() => result);

    expect(controller.getRandomHexes([], 1)).toBe(result);
  });
});

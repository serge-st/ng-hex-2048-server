import { Test, TestingModule } from '@nestjs/testing';
import { HexGridService } from './hex-grid.service';

describe('HexGridService', () => {
  let service: HexGridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HexGridService],
    }).compile();

    service = module.get<HexGridService>(HexGridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

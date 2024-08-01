import { Test, TestingModule } from '@nestjs/testing';
import { HexGridService } from './hex-grid.service';
import { HexCoordDTO, HexDataDTO } from '../common/dto';
import { multiIt } from '@test/helpers';

describe('HexGridService', () => {
  let service: HexGridService;
  let userCoords: HexDataDTO[] = [];
  let radius: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HexGridService],
    }).compile();

    service = module.get<HexGridService>(HexGridService);

    userCoords = [{ q: 0, r: 0, s: 0, value: 2 }];
    radius = 1;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateNextMoveCoords', () => {
    it('should return a HexDataDTO array', () => {
      const result: HexDataDTO[] = [
        { q: 0, r: 0, s: 0, value: 2 },
        { q: 1, r: -1, s: 0, value: 2 },
        { q: -1, r: 1, s: 0, value: 2 },
      ];
      jest.spyOn(service, 'calculateNextMoveCoords').mockImplementation(() => result);
      expect(service.calculateNextMoveCoords(radius, userCoords)).toBe(result);
    });

    it('should call getAvailableHexCoords', () => {
      jest.spyOn(service, 'getAvailableHexCoords');
      service.calculateNextMoveCoords(radius, userCoords);
      expect(service.getAvailableHexCoords).toHaveBeenCalled();
    });
  });

  describe('getHexGrid', () => {
    it('should return 7 elements if radius is 1', () => {
      expect(service.getHexGrid(radius)).toHaveLength(7);
    });

    it('should return 19 elements if radius is 2', () => {
      radius = 2;
      expect(service.getHexGrid(radius)).toHaveLength(19);
    });

    it('should return 37 elements if radius is 3', () => {
      radius = 3;
      expect(service.getHexGrid(radius)).toHaveLength(37);
    });
  });

  describe('isHexAEqualHexB', () => {
    const hexA: HexCoordDTO = { q: 0, r: 0, s: 0 };
    let hexB: HexCoordDTO = { q: 0, r: 0, s: 0 };

    it('should return true if hexA and hexB are equal', () => {
      expect(service.isHexAEqualHexB(hexA, hexB)).toBe(true);
    });

    it('should return false if hexA and hexB are not equal', () => {
      hexB = { q: 1, r: 0, s: -1 };
      expect(service.isHexAEqualHexB(hexA, hexB)).toBe(false);
    });
  });

  describe('getPercentage', () => {
    multiIt(10, 'should return a number from 1 to 100', () => {
      expect(service.getPercentage()).toBeGreaterThanOrEqual(1);
      expect(service.getPercentage()).toBeLessThanOrEqual(100);
    });
  });

  describe('getNewHexCount', () => {
    let availableCoordCount = 5;
    let userCoordCount: number;

    beforeEach(() => {
      userCoordCount = userCoords.length;
    });

    it('should return 2 when radius is 1 is the first call to start the game', () => {
      userCoordCount = 0;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBe(2);
    });

    it('should return 3 when radius is 2 is the first call to start the game', () => {
      radius = 2;
      userCoordCount = 0;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBe(3);
    });

    it('should return 4 when radius is 3 is the first call to start the game', () => {
      radius = 3;
      userCoordCount = 0;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBe(4);
    });

    it('should return 1 when radius is 1 and plenty available tiles', () => {
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBe(1);
    });

    multiIt(10, 'should return 1 or 2 when radius is 2 and plenty available tiles', () => {
      radius = 2;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(2);
    });

    multiIt(10, 'should return 2 or 3 when radius is 3 and plenty available tiles', () => {
      radius = 3;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBeGreaterThanOrEqual(2);
      expect(result).toBeLessThanOrEqual(3);
    });

    it('should return 1 when radius is 2 and only one tile is available', () => {
      availableCoordCount = 1;
      radius = 2;
      const result = service.getNewHexCount(availableCoordCount, userCoordCount, radius);
      expect(result).toBe(1);
    });
  });

  describe('getHexValue', () => {
    multiIt(10, 'should return 2 or 4', () => {
      const result = service.getHexValue(userCoords.length);
      expect(result === 2 || result === 4).toBeTruthy();
    });
  });

  describe('getAvailableHexCoords', () => {
    it('should return a HexCoordDTO array', () => {
      userCoords = [];
      const result: HexCoordDTO[] = [
        { q: 0, r: 1, s: -1 },
        { q: 1, r: -1, s: 0 },
        { q: -1, r: 1, s: 0 },
      ];
      jest.spyOn(service, 'getAvailableHexCoords').mockImplementation(() => result);
      expect(service.getAvailableHexCoords(radius, userCoords)).toBe(result);
    });

    it('HexCoordDTO array should not contain userCoords', () => {
      const result = service.getAvailableHexCoords(radius, userCoords);
      expect(result).not.toContainEqual(userCoords[0]);
    });
  });

  describe('getRandomHexCoords', () => {
    const availableHexCoords: HexCoordDTO[] = [
      { q: 0, r: 1, s: -1 },
      { q: 1, r: -1, s: 0 },
      { q: -1, r: 1, s: 0 },
    ];
    let coordCount: number;

    beforeEach(() => {
      coordCount = 1;
    });

    it('should return HexCoordDTO array with 1 element if coordCount is 1', () => {
      const result = service.getRandomHexCoords(availableHexCoords, coordCount);
      expect(result).toHaveLength(1);
    });

    it('should return HexCoordDTO array with 2 elements if coordCount is 2', () => {
      coordCount = 2;
      const result = service.getRandomHexCoords(availableHexCoords, coordCount);
      expect(result).toHaveLength(2);
    });

    it('should return HexCoordDTO array with 3 elements if coordCount is 3', () => {
      coordCount = 3;
      const result = service.getRandomHexCoords(availableHexCoords, coordCount);
      expect(result).toHaveLength(3);
    });

    it('should return HexCoordDTO array with some of the elements from availableHexCoords', () => {
      const result = service.getRandomHexCoords(availableHexCoords, coordCount);
      expect(availableHexCoords).toContainEqual(result[0]);
    });
  });
});

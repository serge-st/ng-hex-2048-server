import { TestBed } from '@angular/core/testing';

import { HexManagementService } from './hex-management.service';

describe('HexManagementService', () => {
  let service: HexManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HexManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

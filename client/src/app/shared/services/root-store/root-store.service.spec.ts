import { TestBed } from '@angular/core/testing';

import { RootStoreService } from './root-store.service';

describe('RootStoreService', () => {
  let service: RootStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

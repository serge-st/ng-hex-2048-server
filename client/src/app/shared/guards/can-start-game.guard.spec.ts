import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canStartGameGuard } from './can-start-game.guard';

describe('canStartGameGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => canStartGameGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

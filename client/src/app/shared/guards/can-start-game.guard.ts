import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppRoute } from '../types';
import { GameSetupService } from '../services/game-setup';
import { map, of, switchMap } from 'rxjs';

type AppCommand = AppRoute;

export const canStartGameGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state) => {
  const router = inject(Router);
  const gameSetupService = inject(GameSetupService);
  const commands: AppCommand[] = ['game-setup'];

  return gameSetupService.state$.pipe(map((state) => state.gameState === 'in-progress')).pipe(
    switchMap((isGameInProgress: boolean) => {
      if (isGameInProgress) return of(true);
      return router.navigate(commands);
    }),
  );
};

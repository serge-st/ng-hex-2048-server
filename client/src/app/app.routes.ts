import { Route } from '@angular/router';
import { GamePageComponent, GameSetupPageComponent } from './pages';
import { canStartGameGuard } from './shared/guards';
import { AppRoute as AppPath } from './shared/types';
import { TestingContolPageComponent } from './pages/testing-contol-page/testing-contol-page.component';

type AppRoute = Omit<Route, 'path'> & {
  path: AppPath;
};

type AppRoutes = AppRoute[];

export const routes: AppRoutes = [
  { path: 'game', component: GamePageComponent, canActivate: [canStartGameGuard] },
  { path: 'game-setup', component: GameSetupPageComponent },
  // TODO: remove after testing
  { path: 'test-control', component: TestingContolPageComponent },
  { path: '**', redirectTo: 'game-setup', pathMatch: 'full' },
];

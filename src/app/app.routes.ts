import { Routes } from '@angular/router';
import { GamePageComponent } from './pages';

export const routes: Routes = [
  { path: 'game', component: GamePageComponent },
  { path: '**', redirectTo: 'game', pathMatch: 'full' },
];

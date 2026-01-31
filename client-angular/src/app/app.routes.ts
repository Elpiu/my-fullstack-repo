import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { AppRoutesNavigation, authGuard, Callback, Login } from 'core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },
  { path: 'auth/callback', component: Callback },

  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: AppRoutesNavigation.GAME.replace('/', ''),
        pathMatch: 'full',
      },

      {
        path: AppRoutesNavigation.GAME.replace('/', ''),
        loadComponent: () =>
          import('./features/game/game-board-component/game-board-component').then(
            (m) => m.GameBoardComponent,
          ),
      },

      {
        path: AppRoutesNavigation.PROFILE.replace('/', ''),
        loadComponent: () =>
          import('./features/profile/profile-page/profile-page').then((m) => m.ProfilePage),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];

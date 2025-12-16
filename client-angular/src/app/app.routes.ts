import { Routes } from '@angular/router';
import { Callback } from './features/auth/callback/callback';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export class AppRoutesNavigation {
  static readonly LOGIN = '/login';
  static readonly CALLBACK = '/auth/callback';
  static readonly HOME = '/app';
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  { path: 'auth/callback', component: Callback },

  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },

      {
        path: 'profile',
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

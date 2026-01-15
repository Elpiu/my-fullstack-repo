import { Routes } from '@angular/router';
import { Callback } from './features/auth/callback/callback';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { AppRoutesNavigation } from './core/data';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AppRoutesNavigation.HOME,
    pathMatch: 'full',
  },

  {
    path: AppRoutesNavigation.LOGIN.replace('/', ''),
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  { path: 'auth/callback', component: Callback },

  {
    path: AppRoutesNavigation.HOME.replace('/', ''),
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: AppRoutesNavigation.TASK.replace('/', ''),
        pathMatch: 'full',
      },

      {
        path: AppRoutesNavigation.NOTE.replace('/', ''),
        loadComponent: () => import('./features/notes/note-page/note-page').then((m) => m.NotePage),
      },

      {
        path: AppRoutesNavigation.SETTINGS.replace('/', ''),
        loadComponent: () =>
          import('./features/settings/settings-page').then((m) => m.SettingsPage),
      },

      {
        path: AppRoutesNavigation.TASK.replace('/', ''),
        loadComponent: () => import('./features/task/taskd-page').then((m) => m.TaskdPage),
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
    redirectTo: AppRoutesNavigation.LOGIN,
  },
];

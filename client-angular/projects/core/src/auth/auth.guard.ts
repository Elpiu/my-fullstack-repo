import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutesNavigation } from '../data';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = async (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isLoggedIn()) {
    router.navigate([AppRoutesNavigation.LOGIN]);
    return false;
  }

  return true;
};

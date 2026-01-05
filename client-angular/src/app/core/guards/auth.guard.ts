import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../store/AppStore';
import { AppRoutesNavigation } from '../data';

export const authGuard: CanActivateFn = async (route, state) => {
  const appStore = inject(AppStore);

  if (!appStore.user()) {
    inject(Router).navigate([AppRoutesNavigation.LOGIN]);
    return false;
  }

  return true;
};

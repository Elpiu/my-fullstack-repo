import { computed, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Account, Models, OAuthProvider } from 'appwrite';
import { APPWRITE_CLIENT } from '../../../../projects/core/src/lib/providers/appwrite.config';
import { AppStore } from '../../core/store/AppStore';
import { AppRoutesNavigation } from '../../core/data';

type User = Models.User<Models.Preferences>;

export interface UserState {
  user: User | null;
  isLoadingUser: boolean;
  userError: string | null;
}

export const initialUserState: UserState = {
  user: null,
  isLoadingUser: true,
  userError: null,
};

export function withUserFeature() {
  return signalStoreFeature(
    withState(initialUserState),
    withProps(() => ({
      _appwriteClient: inject(APPWRITE_CLIENT),
      _appwriteAccount: new Account(inject(APPWRITE_CLIENT)),
      _router: inject(Router),
    })),
    withMethods((store) => ({
      async signInGoogle() {
        await store._appwriteAccount.createOAuth2Session(
          OAuthProvider.Google,
          `${window.location.origin}${AppRoutesNavigation.CALLBACK}`,
          `${window.location.origin}${AppRoutesNavigation.LOGIN}`,
          ['profile'],
        );
      },
      async checkSession() {
        patchState(store, { isLoadingUser: true });
        try {
          const user = await store._appwriteAccount.get();
          patchState(store, { user, isLoadingUser: false });
        } catch (error) {
          console.debug('No active user session:', error);
          patchState(store, { user: null, isLoadingUser: false });
        }
      },
      async signOut() {
        patchState(store, { isLoadingUser: true });
        try {
          await store._appwriteAccount.deleteSession('current');
          patchState(store, { user: null, isLoadingUser: false });
          store._router.navigate([AppRoutesNavigation.LOGIN]);
        } catch (error: any) {
          patchState(store, { userError: error.message, isLoadingUser: false });
        }
      },
    })),
    //** NON VENGONO RICALCOLATI BISOGNEREBBE CAPIRE */
    withComputed((store) => ({
      isLoggedIn: computed(() => {
        return store.user() != null;
      }),
      userDetails: computed(() => {
        return store.user();
      }),
      userId: computed(() => {
        return store.user()?.$id ?? '';
      }),
    })),
    withHooks((store) => ({})),
  );
}

export const initUserStore = provideAppInitializer(async () => {
  return await inject(AppStore).checkSession();
});

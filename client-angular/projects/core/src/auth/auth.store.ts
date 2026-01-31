import { computed, inject, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { UserType } from '../api/user.model';
import { AuthService } from './auth.service';
import { AppRoutesNavigation } from '../data';
import { AppUserPrefs, DEFAULT_USER_PREFS } from '../api/user-prefs.model';

interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export const provideAuthInitializer = () =>
  provideAppInitializer(() => inject(AuthStore).checkSession());

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => !!user()),
    userId: computed(() => user()?.$id ?? null),
    userName: computed(() => user()?.name ?? ''),
    prefs: computed((): AppUserPrefs => {
      const serverPrefs = user()?.prefs || {};
      return { ...DEFAULT_USER_PREFS, ...serverPrefs };
    }),
  })),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    /**
     * Verifica la sessione esistente
     */
    async checkSession() {
      patchState(store, { isLoading: true });

      return authService
        .getCurrentUser()
        .then((user) => {
          patchState(store, { user, isLoading: false, error: null });

          if (Object.keys(user.prefs).length === 0) {
            this.updatePreferences(DEFAULT_USER_PREFS);
          }
        })
        .catch((err) => {
          console.debug('Session check failed:', err);
          patchState(store, { user: null, isLoading: false });
        });
    },

    /**
     * Login via Google
     */
    async signInGoogle() {
      return authService
        .signInWithGoogle()
        .catch((err) => patchState(store, { error: err.message }));
    },

    /**
     * Logout
     */
    async signOut() {
      patchState(store, { isLoading: true });

      return authService
        .signOut()
        .then(() => {
          patchState(store, initialState);
          router.navigate([AppRoutesNavigation.LOGIN]);
        })
        .catch((err) => patchState(store, { error: err.message, isLoading: false }));
    },

    async updatePreferences(partialPrefs: Partial<AppUserPrefs>) {
      const currentPrefs = store.prefs();
      const newPrefs = { ...currentPrefs, ...partialPrefs };

      return authService
        .updatePrefs(newPrefs)
        .then((updatedPrefs) => {
          patchState(store, (state) => ({
            user: state.user ? { ...state.user, prefs: updatedPrefs } : null,
          }));
        })
        .catch((err) => patchState(store, { error: err.message }));
    },

    async resetPreferences() {
      return authService.updatePrefs(DEFAULT_USER_PREFS).then((updatedPrefs) => {
        patchState(store, (state) => ({
          user: state.user ? { ...state.user, prefs: updatedPrefs } : null,
        }));
      });
    },

    async deletePreference(key: keyof AppUserPrefs) {
      const newPrefs = { ...store.prefs() };
      // @ts-ignore - ripristiniamo al default definito
      newPrefs[key] = DEFAULT_USER_PREFS[key];

      return this.updatePreferences(newPrefs);
    },
  })),
);

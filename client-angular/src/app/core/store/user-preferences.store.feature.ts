import { computed, effect, inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';
export type Language = 'it' | 'en';

export const icons = {
  light: 'pi-sun',
  dark: 'pi-moon',
};

const USER_PREFERENCES_STORAGE_KEY = 'user-preferences';

const DEFAULT_PREFERENCES: UserPreferencesState = {
  theme: 'light',
  language: 'it',
};

export interface UserPreferencesState {
  theme: Theme;
  language: Language;
  // per permettere il salvataggio di future chiavi
  //[key: string]: any;
}

const getInitialState = (): UserPreferencesState => {
  const item = localStorage.getItem(USER_PREFERENCES_STORAGE_KEY);
  if (item) {
    try {
      const parsed = JSON.parse(item);
      // Merge: Usa i dati salvati, ma mantieni i default per chiavi mancanti
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch (e) {
      console.warn('Errore parsing preferenze utente, reset ai default', e);
    }
  }
  return DEFAULT_PREFERENCES;
};

export function withUserPreferences() {
  return signalStoreFeature(
    withState(getInitialState()),

    withMethods((store) => ({
      //  setTheme(theme: Theme) {
      //    patchState(store, { theme });
      //  },

      toggleTheme() {
        const nextTheme = store.theme() === 'light' ? 'dark' : 'light';
        patchState(store, { theme: nextTheme });
      },

      setLanguage(language: Language) {
        patchState(store, { language });
      },

      setPreference(key: string, value: any) {
        patchState(store, { [key]: value });
      },

      resetPreferences() {
        patchState(store, DEFAULT_PREFERENCES);
      },
    })),

    withComputed((store) => ({
      themeIcon: computed(() => (store.theme() === 'dark' ? 'pi-moon' : 'pi-sun')),
      isDarkMode: computed(() => store.theme() === 'dark'),

      allPreferences: computed(() => {
        return { theme: store.theme(), language: store.language() };
      }),
    })),

    withHooks((store) => {
      const document = inject(DOCUMENT);

      return {
        onInit() {
          effect(() => {
            const currentTheme = store.theme();
            const htmlElement = document.documentElement;

            if (currentTheme === 'dark') {
              htmlElement.classList.add('app-dark');
            } else {
              htmlElement.classList.remove('app-dark');
            }
          });

          effect(() => {
            const state = getState(store);
            localStorage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(state));
          });
        },
      };
    })
  );
}

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideStores } from './core/store';
import { provideAppWriteClient } from './appwrite/appwrite.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideAppWriteClient(),
    ...provideStores(),

    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};

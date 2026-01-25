import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { provideTablerIcons } from 'angular-tabler-icons';

import { routes } from './app.routes';
import { provideStores } from './core/store';
import { provideCoreLibraryConfig } from 'core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { COMMON_ICONS } from './core/tabler/icons.provider';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideCoreLibraryConfig(),

    ...provideStores(),

    provideTablerIcons(COMMON_ICONS),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};

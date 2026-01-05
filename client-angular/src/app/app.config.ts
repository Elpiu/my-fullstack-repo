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
import { provideAppWriteClient } from './appwrite/appwrite.config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { COMMON_ICONS } from './core/tabler/icons.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideAppWriteClient(),

    ...provideStores(),

    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    provideTablerIcons(COMMON_ICONS),
  ],
};

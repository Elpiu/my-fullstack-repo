import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAppWriteClient } from './appwrite.config';
import { ConfirmationService, MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideTablerIcons } from 'angular-tabler-icons';
import { COMMON_ICONS } from '../tabler/icon.list';
import { provideAuthInitializer } from '../auth/auth.store';

// Provide Core Library Configurations
export function provideCoreLibraryConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Appwrite
    provideAppWriteClient(),

    // Ng Prime
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    // Tabler icons
    provideTablerIcons(COMMON_ICONS),

    // Store initializers
    provideAuthInitializer(),
  ]);
}

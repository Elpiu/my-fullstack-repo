import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAppWriteClient } from './appwrite.config';
import { ConfirmationService, MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

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
  ]);
}

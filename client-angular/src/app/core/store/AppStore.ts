import { withUserFeature } from '../../features/user/user.store.feature';
import { UserMetadaService } from '../services/user-metada-service';
import { signalStore, withHooks, withProps } from '@ngrx/signals';
import { withUserPreferences } from './user-preferences.store.feature';
import { inject, effect, untracked } from '@angular/core';

export const AppStore = signalStore(
  withUserFeature(),
  withUserPreferences(),

  withHooks((store) => {
    const userMetadataService = inject(UserMetadaService);
    return {
      onInit() {
        effect(() => {
          const user = store.user();
          if (user) {
            untracked(() => {
              console.log('Utente rilevato, carico i metadati...');
              userMetadataService.loadUserMetadata(user.$id);
            });
          }
        });
      },
    };
  })
);

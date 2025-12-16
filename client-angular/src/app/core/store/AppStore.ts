import { signalStore, withHooks, withProps } from '@ngrx/signals';
import { withUserFeature } from '../auth/user.store.feature';
import { effect, inject, untracked } from '@angular/core';
export const AppStore = signalStore(withUserFeature(), withUserPreferences());

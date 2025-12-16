import { signalStore } from '@ngrx/signals';
import { withUserFeature } from '../../features/user/user.store.feature';

export const AppStore = signalStore(withUserFeature());

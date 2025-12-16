import { initUserStore } from '../auth/user.store.feature';
import { AppStore } from './AppStore';

export function provideStores() {
  return [AppStore, initUserStore];
}

import { initUserStore } from '../../features/user/user.store.feature';
import { AppStore } from './AppStore';

export function provideStores() {
  return [AppStore, initUserStore];
}

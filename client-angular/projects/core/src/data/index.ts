import { environment } from '../../../../src/environments/environment';
import { APP_TOPBAR_ITEMS } from './topbar.data';

export * from './navigation.data';
export * from './topbar.data';

export class APP_DATA {
  static appName = environment.appName;

  // LOGIN
  static loginText =
    'Decorator that marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.';
  static loginBgImg = 'images/abstract-background.avif';

  // TOPBAR
  static topbarItems = APP_TOPBAR_ITEMS;
}

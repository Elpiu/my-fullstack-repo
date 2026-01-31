import { TopbarItem } from '../api/topbar.api';
import { ProfileMenu } from '../components/profile-menu';
import { AppRoutesNavigation } from './navigation.data';

export const APP_TOPBAR_ITEMS: TopbarItem[] = [
  {
    label: 'Game',
    visible: true,
    icon: 'device-gamepad-2',
    url: AppRoutesNavigation.HOME,
    handlerClick(router, route) {
      router.navigate([AppRoutesNavigation.HOME]);
    },
  },
  {
    label: 'User',
    visible: true,
    component: ProfileMenu,
  },
];

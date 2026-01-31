import { Models } from 'appwrite';

export interface AppUserPrefs extends Models.Preferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'it';
  notificationsEnabled: boolean;
  sidebarCollapsed: boolean;
}

export const DEFAULT_USER_PREFS: AppUserPrefs = {
  theme: 'system',
  language: 'it',
  notificationsEnabled: true,
  sidebarCollapsed: false,
};

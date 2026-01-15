import { Component, inject, Type } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProfileMenu } from '../shared/components/profile-menu';
import { ActivatedRoute, Router } from '@angular/router';

export class AppRoutesNavigation {
  static readonly LOGIN = '/login';
  static readonly CALLBACK = '/auth/callback';
  static readonly HOME = '/app';

  static readonly LEADERBOARD = '/leaderboard';
  static readonly TASK = '/task';
  static readonly NOTE = '/note';
  static readonly SETTINGS = '/settings';

  static readonly PAGE_TERMS = '/terms';
  static readonly PAGE_PRIVACY = '/privacy';
}

const APP_TOPBAR_ITEMS: TopbarItem[] = [
  {
    icon: 'trophy',
    label: 'Leaderboard',
    visible: true,
    url: AppRoutesNavigation.LEADERBOARD,
    handlerClick: (router: Router, route: ActivatedRoute) => {
      router.navigate([AppRoutesNavigation.LEADERBOARD.replace('/', '')], { relativeTo: route });
    },
  },
  {
    icon: 'checklist',
    label: 'Task',
    visible: true,
    url: AppRoutesNavigation.TASK,
    handlerClick: (router: Router, route: ActivatedRoute) => {
      router.navigate([AppRoutesNavigation.TASK.replace('/', '')], { relativeTo: route });
    },
  },
  {
    icon: 'clipboard-text',
    label: 'Note',
    visible: true,
    url: AppRoutesNavigation.NOTE,
    handlerClick: (router: Router, route: ActivatedRoute) => {
      router.navigate([AppRoutesNavigation.NOTE.replace('/', '')], { relativeTo: route });
    },
  },
  {
    label: 'Settings',
    visible: true,
    icon: 'tool',
    url: AppRoutesNavigation.SETTINGS,
    handlerClick: (router: Router, route: ActivatedRoute) => {
      router.navigate([AppRoutesNavigation.SETTINGS.replace('/', '')], { relativeTo: route });
    },
  },
  {
    label: 'User',
    visible: true,
    component: ProfileMenu,
  },
];

export interface TopbarItem {
  label: string;
  visible: boolean;
  // Proprietà per link standard
  url?: string;
  icon?: string;
  // Proprietà per componente dinamico
  component?: Type<any>;
  // Azioni
  handlerClick?: (router: Router, route: ActivatedRoute) => void;
}

export class APP_DATA {
  static appName = environment.appName;

  // LOGIN
  static loginText =
    'Decorator that marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.';
  static loginBgImg = 'images/minder_bg_note.jpg';

  // TOPBAR
  static topbarItems = APP_TOPBAR_ITEMS;
}

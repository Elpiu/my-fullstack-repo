import { UserCategory, UserTag } from '../models/user-metadata';

export const listIconsCategory = [
  'question-mark',
  'briefcase-2',
  'user',
  'bulb',
  'cash',
  'heart',
  'book',
];

export const UNKNOW_CATEGORY: UserCategory = {
  id: 'cat_unknow',
  label: 'Sconosciuto',
  icon: 'question-mark',
  color: 'gray-500',
};

export const DEFAULT_CATEGORIES: UserCategory[] = [
  {
    id: 'cat_work',
    label: 'Lavoro',
    icon: 'briefcase-2',
    color: 'emerald-500',
  },
  {
    id: 'cat_personal',
    label: 'Personale',
    icon: 'user',
    color: 'blue-500',
  },
  {
    id: 'cat_ideas',
    label: 'Idee',
    icon: 'bulb',
    color: 'amber-500',
  },
  {
    id: 'cat_finance',
    label: 'Finanza',
    icon: 'cash',
    color: 'purple-500',
  },
  {
    id: 'cat_health',
    label: 'Salute',
    icon: 'heart',
    color: 'rose-500',
  },
  {
    id: 'cat_study',
    label: 'Studio',
    icon: 'book',
    color: 'indigo-500',
  },
];

export const DEFAULT_TAGS: UserTag[] = [
  {
    id: 'tag_urgent',
    label: 'Urgente',
  },
  {
    id: 'tag_todo',
    label: 'Da Fare',
  },
  {
    id: 'tag_shopping',
    label: 'Spesa',
  },
  {
    id: 'tag_meeting',
    label: 'Meeting',
  },
  {
    id: 'tag_home',
    label: 'Casa',
  },
  {
    id: 'tag_goal',
    label: 'Obiettivi',
  },
  {
    id: 'year_2025',
    label: '2025',
  },
  {
    id: 'year_2026',
    label: '2026',
  },
];

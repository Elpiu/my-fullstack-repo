import { UserCategory, UserTag } from '../models/user-metadata';

export const UNKNOW_CATEGORY: UserCategory = {
  id: 'cat_unknow',
  label: 'Sconosciuto',
  icon: 'question-mark',
  color: 'gray-500',
};

export const DEFAULT_CATEGORIES: UserCategory[] = [
  {
    id: 'cat_work',
    label: 'Work',
    color: 'blue-600',
    icon: 'briefcase-2',
  },
  {
    id: 'cat_personal',
    label: 'Personal',
    color: 'purple-600',
    icon: 'user',
  },
  {
    id: 'cat_tasks',
    label: 'To-Do',
    color: 'orange-400',
    icon: 'checklist',
  },
  {
    id: 'cat_ideas',
    label: 'Ideas',
    color: 'amber-300',
    icon: 'bulb',
  },
  {
    id: 'cat_finances',
    label: 'Finances',
    color: 'emerald-600',
    icon: 'cash',
  },
  {
    id: 'cat_shopping',
    label: 'Shopping',
    color: 'pink-600',
    icon: 'shopping-cart',
  },
  {
    id: 'cat_health',
    label: 'Health & Habits',
    color: 'rose-600',
    icon: 'heart',
  },
  {
    id: 'cat_fitness',
    label: 'Fitness',
    color: 'red-600',
    icon: 'barbell',
  },
  {
    id: 'cat_home',
    label: 'Household',
    color: 'slate-400',
    icon: 'home',
  },
  {
    id: 'cat_vehicle',
    label: 'Vehicle',
    color: 'gray-800',
    icon: 'car',
  },
];

export const DEFAULT_TAGS: UserTag[] = [
  {
    id: 'tag_urgent',
    label: 'Urgent',
  },
  {
    id: 'tag_todo',
    label: 'To Do',
  },
  {
    id: 'tag_working',
    label: 'Working',
  },
  {
    id: 'tag_done',
    label: 'Done',
  },

  {
    id: 'tag_meeting',
    label: 'Meeting',
  },
  {
    id: 'tag_idea',
    label: 'Idea',
  },

  {
    id: 'tag_cleaning',
    label: 'Cleaning',
  },
  {
    id: 'tag_laundry',
    label: 'Laundry',
  },
  {
    id: 'tag_dishwasher',
    label: 'Dishwasher',
  },

  {
    id: 'tag_hydration',
    label: 'Hydration',
  },
  {
    id: 'tag_digestion',
    label: 'Digestion',
  },
  {
    id: 'tag_mood',
    label: 'Mood',
  },

  // Spesa e Finanze
  {
    id: 'tag_groceries',
    label: 'Groceries',
  },
  {
    id: 'tag_expense',
    label: 'Expense',
  },

  {
    id: 'tag_gym',
    label: 'Gym',
  },

  {
    id: 'tag_fuel',
    label: 'Fuel',
  },
  {
    id: 'tag_maintenance',
    label: 'Maintenance',
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

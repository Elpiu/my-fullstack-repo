import { COMMON_ICONS } from '../tabler/icons.provider';

export const TAILWIND_PALETTE = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

export const ICON_LIST = Object.keys(COMMON_ICONS).map((key) =>
  key
    .replace('Icon', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
);

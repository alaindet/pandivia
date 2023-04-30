import { ObjectValues } from '@app/common/types';

export type BottomNavigationItem = {
  id: string;
  icon: BottomNavigationItemIcon;
  label: string;
};

export const BOTTOM_NAVIGATION_ITEM_ICON = {
  LIST: 'list',
  STAR: 'star',
  USER: 'user',
} as const;

export type BottomNavigationItemIcon = ObjectValues<typeof BOTTOM_NAVIGATION_ITEM_ICON>;

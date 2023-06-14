import { Theme } from '@app/core/types';
import { AVAILABLE_THEMES, DEFAULT_THEME } from '@app/core/constants';
import { NAVIGATION_ITEMS } from '@app/core/constants/navigation';
import { BottomMenuItem } from '@app/common/components';
import { Notification } from '@app/common/types';

export type UiFeatureState = {
  notifications: Notification[];
  loading: boolean;
  title: string;
  theme: Theme;
  availableThemes: Theme[];
  navigation: {
    items: BottomMenuItem[];
    current: BottomMenuItem['id'] | null;
  };
};

export const UI_FEATURE_NAME = 'ui';

export const UI_FEATURE_INITIAL_STATE: UiFeatureState = {
  notifications: [],
  loading: false,
  title: 'Pandivia',
  theme: DEFAULT_THEME,
  availableThemes: AVAILABLE_THEMES,
  navigation: {
    items: NAVIGATION_ITEMS,
    current: null,
  },
};

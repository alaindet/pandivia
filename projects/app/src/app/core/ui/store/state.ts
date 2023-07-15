import { DEFAULT_THEME, Theme } from '@app/core/theme';
import { BottomMenuItem } from '@app/common/components';
import { Notification } from '@app/common/types';
import { NAVIGATION_ITEMS } from '../constants';
import packageJson from '../../../../../../../package.json';

export type UiFeatureState = {
  notifications: Notification[];
  loading: boolean;
  title: string;
  theme: Theme;
  version: string;
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
  version: packageJson.version,
  navigation: {
    items: NAVIGATION_ITEMS,
    current: null,
  },
};

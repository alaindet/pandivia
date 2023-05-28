import { BottomMenuItem } from '@app/common/components';
import { Notification } from '@app/common/types';
import { NAVIGATION_ITEMS } from '@app/core/constants/navigation';

export type UiFeatureState = {
  notifications: Notification[];
  loading: boolean;
  title: string;
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
  navigation: {
    items: NAVIGATION_ITEMS,
    current: null,
  },
};

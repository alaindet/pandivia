import { Notification } from '@app/common/types';

export type UiFeatureState = {
  notifications: Notification[];
};

export const UI_FEATURE_NAME = 'ui';

export const UI_FEATURE_INITIAL_STATE: UiFeatureState = {
  notifications: [],
};

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RuntimeNotification } from '@app/common/types';
import { UI_FEATURE_NAME, UiFeatureState } from './state';

const selectUiFeature = createFeatureSelector<UiFeatureState>(UI_FEATURE_NAME);

export const selectNotification = createSelector(
  selectUiFeature,
  (state): RuntimeNotification | null => {
    if (!state.notifications.length) return null;
    const notifs = state.notifications;
    const more = notifs.length - 1;
    return { ...notifs[notifs.length - 1], more };
  },
);

export const selectNotificationsExist = createSelector(
  selectUiFeature,
  state => state.notifications.length > 0,
);

export const selectUiIsLoading = createSelector(
  selectUiFeature,
  state => state.loading,
);

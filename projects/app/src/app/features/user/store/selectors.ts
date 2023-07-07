import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USER_FEATURE_NAME, UserFeatureState } from './state';

const selectUserFeature = createFeatureSelector<UserFeatureState>(
  USER_FEATURE_NAME,
);

export const selectUser = createSelector(
  selectUserFeature,
  state => state.user,
);

export const selectUserIsAuthenticated = createSelector(
  selectUserFeature,
  state => state.user !== null,
);

export const selectUserEmail = createSelector(
  selectUserFeature,
  state => state?.user?.email ?? null,
);

export const selectUserLanguage = createSelector(
  selectUserFeature,
  state => state?.language,
);

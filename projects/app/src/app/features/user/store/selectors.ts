import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USER_FEATURE_NAME, UserFeatureState } from './state';

const selectUserFeature = createFeatureSelector<UserFeatureState>(
  USER_FEATURE_NAME,
);

export const selectUser = selectUserFeature;

export const selectUserExists = createSelector(
  selectUserFeature,
  state => state !== null,
);

export const selectUserEmail = createSelector(
  selectUserFeature,
  state => state?.email,
);

export const selectUserLanguage = createSelector(
  selectUserFeature,
  state => state?.language,
);

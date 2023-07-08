import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USER_FEATURE_NAME, UserFeatureState } from './state';
import { UserDisplayData } from '../types';

const selectUserFeature = createFeatureSelector<UserFeatureState>(
  USER_FEATURE_NAME,
);

export const selectUserData = createSelector(
  selectUserFeature,
  state => state.data,
);

export const selectUserDisplayData = createSelector(
  selectUserData,
  data => {
    if (!data) return null;
    const { email, displayName, createdAt, lastLoginAt } = data;
    return { email, displayName, createdAt, lastLoginAt } as UserDisplayData;
  },
);

export const selectUserIsAuthenticated = createSelector(
  selectUserFeature,
  state => state.data !== null,
);

export const selectUserEmail = createSelector(
  selectUserFeature,
  state => state?.data?.email ?? null,
);

export const selectUserLanguage = createSelector(
  selectUserFeature,
  state => state?.language,
);

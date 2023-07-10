import { createFeatureSelector, createSelector } from '@ngrx/store';

import { USER_FEATURE_NAME, UserFeatureState } from './state';
import { UserDisplayData } from '../types';
import { LOADING_STATUS } from '@app/common/types';

const selectUserFeature = createFeatureSelector<UserFeatureState>(
  USER_FEATURE_NAME,
);

export const selectUserIsLoaded = createSelector(
  selectUserFeature,
  state => (
    state.status === LOADING_STATUS.IDLE ||
    state.status === LOADING_STATUS.ERROR
  ),
);

export const selectUserData = createSelector(
  selectUserFeature,
  state => state.data,
);

export const selectUserDisplayData = createSelector(
  selectUserData,
  data => {
    if (!data) return null;
    return {
      email: data.email,
      displayName: data.displayName,
      isAdmin: data.isAdmin,
      createdAt: data.createdAt,
      lastLoginAt: data.lastLoginAt,
    } as UserDisplayData;
  },
);

export const selectUserIsAuthenticated = createSelector(
  selectUserFeature,
  state => state.data !== null,
);

export const selectUserIsAdmin = createSelector(
  selectUserFeature,
  state => !!state?.data?.isAdmin,
);

export const selectUserEmail = createSelector(
  selectUserFeature,
  state => state?.data?.email ?? null,
);

export const selectUserLanguage = createSelector(
  selectUserFeature,
  state => state?.language,
);

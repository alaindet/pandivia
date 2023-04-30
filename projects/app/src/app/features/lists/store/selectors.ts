import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LISTS_FEATURE_NAME, ListsFeatureState } from './state';
import { LOADING_STATUS } from '@app/common/types';

const selectListsFeature = createFeatureSelector<ListsFeatureState>(
  LISTS_FEATURE_NAME,
);

export const selectLists = createSelector(
  selectListsFeature,
  state => state.lists,
);

export const selectListsLoaded = createSelector(
  selectListsFeature,
  state => state.status === LOADING_STATUS.IDLE,
);

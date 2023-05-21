import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LOADING_STATUS } from '@app/common/types';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';
import { groupItemsByCategory } from '../functions';

const selectListFeature = createFeatureSelector<ListFeatureState>(
  LIST_FEATURE_NAME,
);

export const selectListStatus = createSelector(
  selectListFeature,
  state => state.status,
);

export const selectListExists = createSelector(
  selectListFeature,
  state => state.status !== LOADING_STATUS.IDLE,
);

export const selectGroupedListItems = createSelector(
  selectListFeature,
  state => groupItemsByCategory(state.items),
);

export const selectGroupedToDoListItems = createSelector(
  selectListFeature,
  state => {
    const todoItems = state.items.filter(item => !item.isDone);
    return groupItemsByCategory(todoItems);
  },
);
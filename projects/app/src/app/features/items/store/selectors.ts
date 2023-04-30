import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LIST_ITEMS_FEATURE_NAME, ListItemsFeatureState } from './state';
import { List } from '@app/features/lists/types';
import { LOADING_STATUS } from '@app/common/types';

const selectListItemsFeature = createFeatureSelector<ListItemsFeatureState>(
  LIST_ITEMS_FEATURE_NAME,
);

export const selectListItemsPartial = (listId: List['id']) => createSelector(
  selectListItemsFeature,
  state => state[listId],
);

export const selectListItems = (listId: List['id']) => createSelector(
  selectListItemsFeature,
  state => state[listId].items,
);

export const selectListItemsLoaded = (listId: List['id']) => createSelector(
  selectListItemsFeature,
  state => state[listId].status === LOADING_STATUS.IDLE,
);

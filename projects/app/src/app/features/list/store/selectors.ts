import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';
import { ListItem } from '@app/core';
import { LIST_FILTER } from '../types';

const selectListFeature = createFeatureSelector<ListFeatureState>(
  LIST_FEATURE_NAME,
);

export const selectListStatus = createSelector(
  selectListFeature,
  state => state.status,
);

export const selectListShouldFetch = createSelector(
  selectListFeature,
  state => !state.items.length,
);

export const selectListCategorizedItems = createSelector(
  selectListFeature,
  state => groupItemsByCategory(state.items),
);

export const selectListCategorizedFilteredItems = createSelector(
  selectListFeature,
  state => {
    const categoryFilter = state.filters[LIST_FILTER.CATEGORY];
    const isDoneFilter = state.filters[LIST_FILTER.IS_DONE];

    const filteredItems: ListItem[] = state.items.filter(item => {

      if (categoryFilter !== null && item.category !== categoryFilter) {
        return false;
      }

      if (isDoneFilter != null && item.isDone !== isDoneFilter) {
        return false;
      }

      return true;
    });

    return groupItemsByCategory(filteredItems);
  },
);

// TODO
export const selectListFilters = createSelector(
  selectListFeature,
  state => state.filters,
);

// export const selectListItemsByCategory = (category?: string) => createSelector(
//   selectListFeature,
//   state => {
//     const cat = category ?? 'no-category';
//     const items = state.items.filter(it => it.category === cat);
//     return groupItemsByCategory(items);
//   },
// );

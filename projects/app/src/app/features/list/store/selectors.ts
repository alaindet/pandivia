import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';

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

export const selectListItemsByCategory = (category?: string) => createSelector(
  selectListFeature,
  state => {
    const cat = category ?? 'no-category';
    const items = state.items.filter(it => it.category === cat);
    return groupItemsByCategory(items);
  },
);
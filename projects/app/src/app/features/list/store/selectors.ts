import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';
import { ListItem } from '@app/core';
import { LIST_FILTER, ListFilterToken, ListFilters } from '../types';
import { LOADING_STATUS } from '@app/common/types';

const selectListFeature = createFeatureSelector<ListFeatureState>(
  LIST_FEATURE_NAME,
);

export const selectListStatus = createSelector(
  selectListFeature,
  state => state.status,
);

export const selectListIsLoaded = createSelector(
  selectListFeature,
  state => state.status === LOADING_STATUS.IDLE,
);

export const selectListShouldFetch = createSelector(
  selectListFeature,
  state => !state.items.length,
);

export const selectListItemExistsWithName = (
  itemId: string | null,
  name: string,
) => createSelector(
  selectListFeature,
  (state): boolean => {
    const query = name.toLowerCase();
    return !!state.items.filter(item => (
      item.id !== itemId &&
      item.name.toLowerCase() === query
    )).length;
  },
);

export const selectListCategoriesByName = (category: string) => createSelector(
  selectListFeature,
  (state): string[] => {
    const query = category.toLowerCase();
    const searchByCategory = (item: ListItem) => {
      return item.category?.toLowerCase()?.includes(query);
    };
    const categories: { [category: string]: boolean } = {};
    state.items.forEach(item => {
      if (searchByCategory(item)) {
        categories[item.category!] = true;
      }
    });
    return Object.keys(categories);
  },
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

export const selectListFilters = createSelector(
  selectListFeature,
  (state): ListFilterToken[] | null => {
    const keys = Object.keys(state.filters) as (keyof ListFilters)[];
    const filters: ListFilterToken[] = [];

    for (const key of keys) {
      const value = state.filters[key];
      if (value !== null) {
        filters.push({ key, value });
      }
    }

    return filters.length ? filters : null;
  },
);

export const selectListCategoryFilter = createSelector(
  selectListFeature,
  state => state.filters[LIST_FILTER.CATEGORY],
);

export const selectItemById = (itemId: string) => (state: any) => {
  const featureState = state[LIST_FEATURE_NAME] as ListFeatureState;
  const item = featureState.items.find(item => item.id === itemId);
  return item ?? null;
};

export const selectItemAmount = (itemId: string) => (state: any) => {
  const featureState = state[LIST_FEATURE_NAME] as ListFeatureState;
  const item = featureState.items.find(item => item.id === itemId);
  if (!item) return 0;
  return item.amount;
};

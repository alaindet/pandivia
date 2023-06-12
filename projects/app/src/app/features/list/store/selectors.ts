import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';
import { CACHE_MAX_AGE, ListItem } from '@app/core';
import { LIST_FILTER, ListFilterToken } from '../types';
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

export const selectListIsLoading = createSelector(
  selectListFeature,
  state => state.status === LOADING_STATUS.LOADING,
);

export const selectListShouldFetch = createSelector(
  selectListFeature,
  state => {
    if (state.status === LOADING_STATUS.PRISTINE) {
      return true;
    }

    if (state.lastUpdated === null) {
      return true;
    }

    if (Date.now() - state.lastUpdated > CACHE_MAX_AGE) {
      return true;
    }

    if (!state.items.length) {
      return true;
    }

    return false;
  },
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

// export const selectListCategorizedItems = createSelector(
//   selectListFeature,
//   state => groupItemsByCategory(state.items),
// );

export const selectListCategorizedFilteredItems = createSelector(
  selectListFeature,
  state => {
    const categoryFilter = state.filters[LIST_FILTER.CATEGORY];
    const isDoneFilter = state.filters[LIST_FILTER.IS_DONE];

    const filteredItems: ListItem[] = state.items.filter(item => {

      if (categoryFilter !== null && item.category !== categoryFilter) {
        return false;
      }

      if (isDoneFilter === true && item.isDone) {
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
    const filters: ListFilterToken[] = [];

    if (state.filters[LIST_FILTER.CATEGORY]) {
      const value = state.filters[LIST_FILTER.CATEGORY];
      filters.push({ key: LIST_FILTER.CATEGORY, value });
    }

    if (state.filters[LIST_FILTER.IS_DONE]) {
      const value = state.filters[LIST_FILTER.IS_DONE]
        ? 'Items to do' // TODO: Translate
        : 'Completed items'; // TODO: Translate
      filters.push({ key: LIST_FILTER.IS_DONE, value });
    }

    return filters.length ? filters : null;
  },
);

export const selectListCategoryFilter = createSelector(
  selectListFeature,
  (state): string | null => state.filters[LIST_FILTER.CATEGORY],
);

export const selectListIsDoneFilter = createSelector(
  selectListFeature,
  (state): boolean => !!state.filters[LIST_FILTER.IS_DONE],
);

export const selectListItemById = (itemId: string) => createSelector(
  selectListFeature,
  (state): ListItem | null => {
    const item = state.items.find(item => item.id === itemId);
    return item ?? null;
  },
);

export const selectListItemAmount = (itemId: string) => createSelector(
  selectListFeature,
  (state): number => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return 0;
    return item.amount;
  },
);

export const selectListItemModalSuccessCounter = createSelector(
  selectListFeature,
  state => state.itemModalSuccessCounter,
);

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CACHE_MAX_AGE } from '@app/core/cache';
import { Counters, LOADING_STATUS } from '@app/common/types';
import { INVENTORY_FILTER, InventoryFilterToken, InventoryItem } from '../types';
import { INVENTORY_FEATURE_NAME, InventoryFeatureState } from './state';
import { groupItemsByCategory, sortItemsByName } from '@app/common/store/collection';

const selectInventoryFeature = createFeatureSelector<InventoryFeatureState>(
  INVENTORY_FEATURE_NAME,
);

export const selectInventoryStatus = createSelector(
  selectInventoryFeature,
  state => state.status,
);

export const selectInventoryIsLoaded = createSelector(
  selectInventoryFeature,
  state => state.status === LOADING_STATUS.IDLE,
);

export const selectInventoryInErrorStatus = createSelector(
  selectInventoryFeature,
  state => state.status === LOADING_STATUS.ERROR,
);

export const selectInventoryIsLoading = createSelector(
  selectInventoryFeature,
  state => state.status === LOADING_STATUS.LOADING,
);

export const selectInventoryShouldFetch = createSelector(
  selectInventoryFeature,
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

export const selectInventoryItemExistsWithName = (
  name: string,
) => createSelector(
  selectInventoryFeature,
  (state): InventoryItem | null => {
    const query = name.toLowerCase();
    const item = state.items.find(item => item.name.toLowerCase() === query);
    return item ?? null;
  },
);

export const selectInventoryCategories = createSelector(
  selectInventoryFeature,
  (state): string[] => {
    const categories: { [category: string]: boolean } = {};
    state.items.forEach(item => {
      if (item.category && !categories[item.category]) {
        categories[item.category] = true;
      }
    });
    return Object.keys(categories);
  },
);

export const selectInventoryCategoriesByName = (category: string) => createSelector(
  selectInventoryFeature,
  (state): string[] => {
    const query = category.toLowerCase();
    const searchByCategory = (item: InventoryItem) => {
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

export const selectInventoryItemsByName = (nameQuery: string) => {
  const query = nameQuery.toLowerCase();
  const searchName = (item: InventoryItem) => {
    return item.name?.toLowerCase()?.includes(query);
  };

  return createSelector(
    selectInventoryFeature,
    state => state.items.filter(searchName),
  );
};

export const selectInventoryCategorizedFilteredItems = createSelector(
  selectInventoryFeature,
  state => {
    const categoryFilter = state.filters[INVENTORY_FILTER.CATEGORY];
    const searchQueryFilter = (state.filters[INVENTORY_FILTER.SEARCH_QUERY] ?? '').toLowerCase();

    const filteredItems: InventoryItem[] = state.items.filter(item => {

      if (categoryFilter !== null) {
        if (item.category !== categoryFilter) {
          return false;
        }
      }

      if (searchQueryFilter !== '') {
        if (!item.name.toLowerCase().includes(searchQueryFilter)) {
          return false;
        }
      }

      return true;
    });

    const sortedItems = sortItemsByName(filteredItems);
    return groupItemsByCategory(sortedItems);
  },
);

export const selectInventoryFilters = createSelector(
  selectInventoryFeature,
  (state): InventoryFilterToken[] | null => {
    const filters: InventoryFilterToken[] = [];

    if (state.filters[INVENTORY_FILTER.CATEGORY]) {
      const key = INVENTORY_FILTER.CATEGORY;
      const value = state.filters[key];
      const label = value ?? undefined;
      filters.push({ key, value, label });
    }

    if (state.filters[INVENTORY_FILTER.SEARCH_QUERY] !== null) {
      const key = INVENTORY_FILTER.SEARCH_QUERY;
      const value = state.filters[key];
      const label = `"${value}"`;
      filters.push({ key, value, label });
    }

    return filters.length ? filters : null;
  },
);

export const selectInventoryCategoryFilter = createSelector(
  selectInventoryFeature,
  (state): string | null => state.filters[INVENTORY_FILTER.CATEGORY],
);

export const selectInventoryItemById = (itemId: string) => createSelector(
  selectInventoryFeature,
  (state): InventoryItem | null => {
    const item = state.items.find(item => item.id === itemId);
    return item ?? null;
  },
);

export const selectInventoryItemModalSuccessCounter = createSelector(
  selectInventoryFeature,
  state => state.itemModalSuccessCounter,
);

export const selectInventoryCounters = createSelector(
  selectInventoryFeature,
  state => {
    const counters: Counters = { completed: null, total: 0 };
    counters.total = state.items.length;
    return counters;
  },
);

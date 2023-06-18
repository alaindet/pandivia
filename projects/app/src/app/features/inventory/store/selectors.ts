import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { CACHE_MAX_AGE } from '@app/core/cache';
import { INVENTORY_FEATURE_NAME, InventoryFeatureState } from './state';
import { LOADING_STATUS } from '@app/common/types';
import { INVENTORY_FILTER, InventoryFilterToken, InventoryItem } from '../types';

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
  itemId: string | null,
  name: string,
) => createSelector(
  selectInventoryFeature,
  (state): boolean => {
    const query = name.toLowerCase();
    return !!state.items.filter(item => (
      item.id !== itemId &&
      item.name.toLowerCase() === query
    )).length;
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

    const filteredItems: InventoryItem[] = state.items.filter(item => {

      if (categoryFilter !== null && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });

    return groupItemsByCategory(filteredItems);
  },
);

export const selectInventoryFilters = createSelector(
  selectInventoryFeature,
  (state): InventoryFilterToken[] | null => {
    const filters: InventoryFilterToken[] = [];

    if (state.filters[INVENTORY_FILTER.CATEGORY]) {
      const value = state.filters[INVENTORY_FILTER.CATEGORY];
      filters.push({ key: INVENTORY_FILTER.CATEGORY, value });
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

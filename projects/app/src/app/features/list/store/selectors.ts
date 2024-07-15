import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CACHE_MAX_AGE } from '@app/core/cache';
import { LOADING_STATUS, Counters } from '@app/common/types';
import { LIST_FEATURE_NAME, ListFeatureState } from './state';
import { LIST_FILTER, ListFilterToken, ListItem } from '../types';
import { groupItemsByCategory, sortItemsByName } from '@app/common/store/collection';
import { selectInventoryItemsByName } from '@app/features/inventory/store';

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

export const selectListInErrorStatus = createSelector(
  selectListFeature,
  state => state.status === LOADING_STATUS.ERROR,
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
  name: string,
) => createSelector(
  selectListFeature,
  (state): ListItem | null => {
    const query = name.toLowerCase();
    const item = state.items.find(item => item.name.toLowerCase() === query);
    return item ?? null;
  },
);

export const selectListCategories = createSelector(
  selectListFeature,
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

export const selectListCategorizedFilteredItems = createSelector(
  selectListFeature,
  state => {
    const categoryFilter = state.filters[LIST_FILTER.CATEGORY];
    const isDoneFilter = state.filters[LIST_FILTER.IS_DONE];
    const searchQueryFilter = (state.filters[LIST_FILTER.SEARCH_QUERY] ?? '').toLowerCase();

    const filteredItems: ListItem[] = state.items.filter(item => {

      if (categoryFilter !== null) {
        if (item.category !== categoryFilter) {
          return false;
        }
      }

      if (isDoneFilter !== null) {
        if (isDoneFilter === true && item.isDone) {
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

export const selectListFilters = createSelector(
  selectListFeature,
  (state): ListFilterToken[] | null => {
    const filters: ListFilterToken[] = [];

    if (state.filters[LIST_FILTER.CATEGORY] !== null) {
      const key = LIST_FILTER.CATEGORY;
      const value = state.filters[key];
      const label = value ?? undefined;
      filters.push({ key, value, label });
    }

    if (state.filters[LIST_FILTER.IS_DONE] !== null) {
      const key = LIST_FILTER.IS_DONE;
      const value = state.filters[key];
      const label = value ? 'list.filter.onlyToDo' : 'list.filter.onlyCompleted';
      filters.push({ key, value, label });
    }

    if (state.filters[LIST_FILTER.SEARCH_QUERY] !== null) {
      const key = LIST_FILTER.SEARCH_QUERY;
      const value = state.filters[key];
      const label = `"${value}"`;
      filters.push({ key, value, label });
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

export const selectListItemsMapByName = createSelector(
  selectListFeature,
  state => {
    const itemsMap: { [itemName: string]: boolean } = {};
    state.items.forEach(item => {
      const key = item.name.toLowerCase();
      itemsMap[key] = true;
    });
    return itemsMap;
  },
);

export const selectListItemNameAutocompleteItems = (nameQuery: string) => {
  return createSelector(
    selectInventoryItemsByName(nameQuery),
    selectListItemsMapByName,
    (inventoryItems, listItemsMap) => {
      return inventoryItems.filter(inventoryItem => {
        const key = inventoryItem.name.toLowerCase();
        return !listItemsMap[key];
      });
    },
  );
};

export const selectListCounters = createSelector(
  selectListFeature,
  state => {
    const counters: Counters = { completed: 0, total: 0 };
    counters.completed = state.items.filter(item => item.isDone).length;
    counters.total = state.items.length;
    return counters;
  },
);

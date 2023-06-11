import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { INVENTORY_FEATURE_NAME, InventoryFeatureState } from './state';
import { LOADING_STATUS } from '@app/common/types';
import { CACHE_MAX_AGE, InventoryItem } from '@app/core';

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

export const selectInventoryCategorizedItems = createSelector(
  selectInventoryFeature,
  state => groupItemsByCategory(state.items),
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
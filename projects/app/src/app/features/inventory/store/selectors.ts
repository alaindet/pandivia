import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { INVENTORY_FEATURE_NAME, InventoryFeatureState } from './state';
import { LOADING_STATUS } from '@app/common/types';
import { InventoryItem } from '@app/core';

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
  state => !state.items.length,
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
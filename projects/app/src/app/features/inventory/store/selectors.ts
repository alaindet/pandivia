import { createFeatureSelector, createSelector } from '@ngrx/store';

import { groupItemsByCategory } from '@app/core/functions';
import { LOADING_STATUS } from '@app/common/types';
import { INVENTORY_FEATURE_NAME, InventoryFeatureState } from './state';

const selectInventoryFeature = createFeatureSelector<InventoryFeatureState>(
  INVENTORY_FEATURE_NAME,
);

export const selectInventoryStatus = createSelector(
  selectInventoryFeature,
  state => state.status,
);

export const selectInventoryExists = createSelector(
  selectInventoryFeature,
  state => state.status === LOADING_STATUS.IDLE,
);

export const selectInventoryCategorizedItems = createSelector(
  selectInventoryFeature,
  state => groupItemsByCategory(state.items),
);

export const selectInventoryItemsByCategory = (category?: string) => createSelector(
  selectInventoryFeature,
  state => {
    const cat = category ?? 'no-category';
    const items = state.items.filter(it => it.category === cat);
    return groupItemsByCategory(items);
  },
);

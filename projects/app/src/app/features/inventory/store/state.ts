import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { InventoryItem } from '@app/core';
import { INVENTORY_FILTER, InventoryFilters } from '../types';

export type InventoryFeatureState = {
  items: InventoryItem[];
  status: LoadingStatus;
  lastUpdated: UnixTimestamp | null;
  itemModalSuccessCounter: number;
  filters: InventoryFilters;
};

export const INVENTORY_FEATURE_NAME = 'inventory';

export const INVENTORY_FEATURE_INITIAL_STATE: InventoryFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
  lastUpdated: null,
  itemModalSuccessCounter: 0,
  filters: {
    [INVENTORY_FILTER.CATEGORY]: null,
  },
};

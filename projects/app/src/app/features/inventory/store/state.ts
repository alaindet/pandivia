import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { INVENTORY_FILTER, InventoryFilters, InventoryItem } from '../types';

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
    [INVENTORY_FILTER.SEARCH_QUERY]: null,
  },
};

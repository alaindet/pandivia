import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '@app/common/types';
import { InventoryItem } from '@app/core';

export type InventoryFeatureState = {
  items: InventoryItem[];
  status: LoadingStatus;
  lastUpdated: UnixTimestamp | null;
};

export const INVENTORY_FEATURE_NAME = 'inventory';

export const INVENTORY_FEATURE_INITIAL_STATE: InventoryFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
  lastUpdated: null,
};

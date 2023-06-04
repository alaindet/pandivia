import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { InventoryItem } from '@app/core';

export type InventoryFeatureState = {
  items: InventoryItem[];
  status: LoadingStatus;
};

export const INVENTORY_FEATURE_NAME = 'inventory';

export const INVENTORY_FEATURE_INITIAL_STATE: InventoryFeatureState = {
  items: [],
  status: LOADING_STATUS.PRISTINE,
};

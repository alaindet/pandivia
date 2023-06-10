import { LIST_FEATURE_EFFECTS, LIST_FEATURE_NAME, ListFeatureState, listReducer } from '@app/features/list/store';
import { UI_FEATURE_NAME, UiFeatureState, uiReducer, UI_FEATURE_EFFECTS } from './ui';
import { INVENTORY_FEATURE_EFFECTS, INVENTORY_FEATURE_NAME, InventoryFeatureState, inventoryReducer } from '@app/features/inventory/store';

export type RootState = {
  [UI_FEATURE_NAME]: UiFeatureState,
  [LIST_FEATURE_NAME]: ListFeatureState,
  [INVENTORY_FEATURE_NAME]: InventoryFeatureState,
  // ...
};

export const rootReducer = {
  [UI_FEATURE_NAME]: uiReducer,
  [LIST_FEATURE_NAME]: listReducer,
  [INVENTORY_FEATURE_NAME]: inventoryReducer,
  // ...
};

export const rootEffects = [
  ...UI_FEATURE_EFFECTS,
  ...LIST_FEATURE_EFFECTS,
  ...INVENTORY_FEATURE_EFFECTS,
];

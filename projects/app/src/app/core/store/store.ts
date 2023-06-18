import { USER_FEATURE_NAME, UserFeatureState, userReducer, USER_FEATURE_EFFECTS } from '@app/features/user/store';
import { UI_FEATURE_NAME, UiFeatureState, uiReducer, UI_FEATURE_EFFECTS } from './ui';
import { LIST_FEATURE_EFFECTS, LIST_FEATURE_NAME, ListFeatureState, listReducer } from '@app/features/list/store';
import { INVENTORY_FEATURE_EFFECTS, INVENTORY_FEATURE_NAME, InventoryFeatureState, inventoryReducer } from '@app/features/inventory/store';

export type RootState = {
  [USER_FEATURE_NAME]: UserFeatureState,
  [UI_FEATURE_NAME]: UiFeatureState,
  [LIST_FEATURE_NAME]: ListFeatureState,
  [INVENTORY_FEATURE_NAME]: InventoryFeatureState,
  // ...
};

export const rootReducer = {
  [USER_FEATURE_NAME]: userReducer,
  [UI_FEATURE_NAME]: uiReducer,
  [LIST_FEATURE_NAME]: listReducer,
  [INVENTORY_FEATURE_NAME]: inventoryReducer,
  // ...
};

export const rootEffects = [
  ...USER_FEATURE_EFFECTS,
  ...UI_FEATURE_EFFECTS,
  ...LIST_FEATURE_EFFECTS,
  ...INVENTORY_FEATURE_EFFECTS,
];

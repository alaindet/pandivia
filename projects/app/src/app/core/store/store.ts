import { UI_FEATURE_NAME, UiFeatureState, uiReducer, UI_FEATURE_EFFECTS } from './ui';

export type RootState = {
  [UI_FEATURE_NAME]: UiFeatureState,
  // ...
};

export const rootReducer = {
  [UI_FEATURE_NAME]: uiReducer,
  // ...
};

export const rootEffects = [
  ...UI_FEATURE_EFFECTS,
];

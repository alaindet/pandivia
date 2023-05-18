import { createFeatureSelector, createSelector } from '@ngrx/store';

import { COUNTER_FEATURE_NAME, CounterFeatureState } from './state';

const selectCounterFeature = createFeatureSelector<CounterFeatureState>(
  COUNTER_FEATURE_NAME,
);

export const selectCounter = createSelector(
  selectCounterFeature,
  state => state.counter,
);

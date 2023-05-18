import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { counterActions } from './actions';
import { COUNTER_FEATURE_INITIAL_STATE } from './state';

export const counterReducer = createReducer(COUNTER_FEATURE_INITIAL_STATE,

  immerOn(counterActions.decrement, state => {
    state.counter -= 1;
  }),

  immerOn(counterActions.increment, state => {
    state.counter += 1;
  }),

  immerOn(counterActions.decrementByAmount, (state, { amount }) => {
    state.counter -= amount;
  }),

  immerOn(counterActions.incrementByAmount, (state, { amount }) => {
    state.counter += amount;
  }),
);

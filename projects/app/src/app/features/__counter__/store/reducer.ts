import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import * as fromActions from './actions';
import { COUNTER_FEATURE_INITIAL_STATE } from './state';

export const counterReducer = createReducer(COUNTER_FEATURE_INITIAL_STATE,

  immerOn(fromActions.counterActions.decrement, state => {
    state.counter -= 1;
  }),

  immerOn(fromActions.counterActions.increment, state => {
    state.counter += 1;
  }),

  immerOn(fromActions.counterActions.decrementByAmount, (state, { amount }) => {
    state.counter -= amount;
  }),

  immerOn(fromActions.counterActions.incrementByAmount, (state, { amount }) => {
    state.counter += amount;
  }),
);

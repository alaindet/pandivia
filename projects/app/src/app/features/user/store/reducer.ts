import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { LOADING_STATUS } from '@app/common/types';
import { USER_FEATURE_INITIAL_STATE } from './state';
import { userSignIn, userAutoSignIn, userSetLanguage, userSignOut } from './actions';

export const userReducer = createReducer(USER_FEATURE_INITIAL_STATE,

  immerOn(
    userSignIn.try,
    userSignOut.try,
    state => {
      state.status = LOADING_STATUS.LOADING;
    },
  ),

  immerOn(
    userSignIn.err,
    userSignOut.err,
    state => {
      state.status = LOADING_STATUS.ERROR;
    },
  ),

  immerOn(
    userSignIn.ok,
    userAutoSignIn.ok,
    (state, { user }) => {
      state.status = LOADING_STATUS.IDLE;
      state.data = user;
    },
  ),

  immerOn(userAutoSignIn.err, state => {
    state.status = LOADING_STATUS.IDLE;
  }),

  immerOn(userSignOut.ok, state => {
    state.status = LOADING_STATUS.IDLE;
    state.data = null;
  }),

  immerOn(userSetLanguage, (state, { language }) => {
    state.language = language;
  }),
);

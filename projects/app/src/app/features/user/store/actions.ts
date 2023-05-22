import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserCredentials } from '../types';

export const loginActions = createActionGroup({
  source: 'User',
  events: {
    'Login' : props<{ credentials: UserCredentials }>(),
    'Login success': props<{ payload: any }>(), // TODO
    'Login error': props<{ error: string }>(),
    'Logout': emptyProps(),
  },
});

export const setLanguage = createAction(
  '[User] Set language',
  props<{ language: string }>(),
);

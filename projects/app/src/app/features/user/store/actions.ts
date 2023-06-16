import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { UserCredentials } from '../types';
import { Language } from '@app/core';

export const loginActions = createActionGroup({
  source: 'User/Login',
  events: {
    login : props<{ credentials: UserCredentials }>(),
    loginSuccess: props<{ payload: any }>(), // TODO
    loginError: props<{ error: string }>(),
    logout: emptyProps(),
  },
});

export const userLanguageActions = createActionGroup({
  source: 'User/Language',
  events: {
    setLanguage: props<{ language: Language }>(),
    setDefaultLanguage: emptyProps(),
  },
});

import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { Theme } from '@app/core/theme';
import { Notification } from '@app/common/types';
import { BottomMenuItem } from '@app/common/components';

export const uiNotificationAddSuccess = createAction(
  '[UI] Add success notification',
  props<{ message: Notification['message'] }>(),
);

export const uiNotificationAddError = createAction(
  '[UI] Add error notification',
  props<{ message: Notification['message'] }>(),
);

export const uiNotificationDismiss = createAction(
  '[UI] Dismiss notification',
);

export const uiLoaderStart = createAction(
  '[UI] Start loader',
);

export const uiLoaderStop = createAction(
  '[UI] Stop loader',
);




export const uiNavigationActions = createActionGroup({
  source: 'UI/Navigation',
  events: {
    setCurrent: props<{ current: BottomMenuItem['id'] }>(),
  },
});

export const uiSetPageTitle = createAction(
  '[UI] Set page title',
  props<{ title: string }>(),
);

export const uiThemeActions = createActionGroup({
  source: 'UI/Theme',
  events: {
    setTheme: props<{ theme: Theme }>(),
    setDefaultTheme: emptyProps(),
  },
});

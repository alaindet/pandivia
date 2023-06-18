import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { Theme } from '@app/core/theme';
import { Notification } from '@app/common/types';
import { BottomMenuItem } from '@app/common/components';

export const uiNotificationsActions = createActionGroup({
  source: 'UI/Notifications',
  events: {
    addSuccess: props<{ message: Notification['message'] }>(),
    addError: props<{ message: Notification['message'] }>(),
    dismiss: emptyProps(),
  },
});

export const uiLoaderActions = createActionGroup({
  source: 'UI/Loader',
  events: {
    start: emptyProps(),
    stop: emptyProps(),
  },
});

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

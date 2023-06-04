import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { Notification } from '@app/common/types';
import { BottomMenuItem } from '@app/common/components';

export const notificationsActions = createActionGroup({
  source: 'UI/Notifications',
  events: {
    'Add Success': props<{ message: Notification['message'] }>(),
    'Add Error': props<{ message: Notification['message'] }>(),
    'Dismiss': emptyProps(),
  },
});

export const loaderActions = createActionGroup({
  source: 'UI/Loader',
  events: {
    'Start': emptyProps(),
    'Stop': emptyProps(),
  },
});

export const setCurrentNavigation = createAction(
  '[UI/Navigation] Set current item',
  props<{ current: BottomMenuItem['id'] }>()
);

export const setCurrentTitle = createAction(
  '[UI/Title] Set current title',
  props<{ title: string }>(),
);

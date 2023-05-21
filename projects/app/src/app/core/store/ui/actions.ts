import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Notification } from '@app/common/types';

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

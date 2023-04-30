import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Notification } from '@app/common/types';

export const notificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    'Add Success': props<{ message: Notification['message'] }>(),
    'Add Error': props<{ message: Notification['message'] }>(),
    'Dismiss': emptyProps(),
  },
});

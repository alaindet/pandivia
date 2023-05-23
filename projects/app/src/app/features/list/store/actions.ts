import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ListItem } from '@app/core';

export const fetchListItemsActions = createActionGroup({
  source: 'List',
  events: {
    'Fetch items': emptyProps(),
    'Fetch items cached': emptyProps(),
    'Force fetch items': emptyProps(),
    'Fetch items success': props<{ items: ListItem[] }>(),
    'Fetch items error': props<{ error: string }>(),
  },
});

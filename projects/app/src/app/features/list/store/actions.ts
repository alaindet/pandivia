import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ListItem } from '../types';

export const fetchItemsActions = createActionGroup({
  source: 'List',
  events: {
    'Fetch items': emptyProps(),
    'Force fetch items': emptyProps(),
    'Fetch items success': props<{ items: ListItem[] }>(),
    'Fetch items error': props<{ error: string }>(),
  },
});

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

export const listFilterActions = createActionGroup({
  source: 'List/Filters',
  events: {
    'Set category filter': props<{ category: string }>(),
    'Clear category filter': emptyProps(),
    'Set done filter': props<{ isDone: boolean }>(),
    'Clear done filter': emptyProps(),
    'Clear all filters': emptyProps(),
  },
});

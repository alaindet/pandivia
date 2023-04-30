import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { List } from '../types';

export const createListActions = createActionGroup({
  source: 'Lists',
  events: {
    'Try to create': props<{ name: List['name'] }>(),
    'Successfully created': props<{ list: List }>(),
    'Failed to create': emptyProps(),
  },
});

export const updateListActions = createActionGroup({
  source: 'Lists',
  events: {
    'Try to update': props<{ list: List }>(),
    'Successfully updated': props<{ list: List }>(),
    'Failed to update': props<{ list: List }>(),
  },
});

export const deleteListActions = createActionGroup({
  source: 'Lists',
  events: {
    'Try to delete': props<{ list: List }>(),
    'Successfully deleted': props<{ list: List }>(),
    'Failed to delete': props<{ list: List }>(),
  },
});

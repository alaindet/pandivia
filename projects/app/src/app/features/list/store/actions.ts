import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ListItem } from '@app/core';
import { ListFilter, ListFilterToken } from '../types';

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
    'Clear filter by name': props<{ name: ListFilter }>(),
    'Clear all filters': emptyProps(),
  },
});

export const listItemActions = createActionGroup({
  source: 'List/Items',
  events: {
    'Undo item': props<{ itemId: string }>(),
    'Complete item': props<{ itemId: string }>(),
    'Toggle item': props<{ itemId: string }>(),
    'Increment item amount': props<{ itemId: string }>(),
    'Decrement item amount': props<{ itemId: string }>(),
  },
});
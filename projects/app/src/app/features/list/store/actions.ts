import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CreateListItemDto, ListItem } from '@app/core';
import { ListFilter } from '../types';

export const listFetchItemsActions = createActionGroup({
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

export const listAllItemsActions = createActionGroup({
  source: 'List/Items',
  events: {
    'Complete': emptyProps(),
    'Undo': emptyProps(),
    'Remove completed': emptyProps(),
    'Remove': emptyProps(),
  },
});

export const listCategoryActions = createActionGroup({
  source: 'List/Category',
  events: {
    'Complete': props<{ category: string }>(),
    'Undo': props<{ category: string }>(),
    'Remove completed': props<{ category: string }>(),
    'Remove': props<{ category: string }>(),
  },
});

export const listItemActions = createActionGroup({
  source: 'List/Item',
  events: {
    'Create': props<{ dto: CreateListItemDto }>(),
    'Edit': props<{ item: ListItem }>(),
    'Complete': props<{ itemId: string }>(),
    'Undo': props<{ itemId: string }>(),
    'Toggle': props<{ itemId: string }>(),
    'Increment': props<{ itemId: string }>(),
    'Decrement': props<{ itemId: string }>(),
    'Remove': props<{ itemId: string }>(),
  },
});
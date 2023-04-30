import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ListItem } from '../types';

// TODO: Move
export type CreateListItemRequest = {
  id: string;
  listId: string;
  name: string;
  amount: number;
};

// TODO: Move
export type UpdateListItemRequest = {
  id: string;
  listId: string;
  name: string;
  isDone: boolean;
  amount: number;
};

// TODO: Move
export type DeleteListItemRequest = {
  id: string;
  listId: string;
};

export const createItemActions = createActionGroup({
  source: 'List Items',
  events: {
    'Try to create': props<{ request: CreateListItemRequest }>(),
    'Successfully created': props<{ item: ListItem }>(),
    'Failed to create': props<{ request: CreateListItemRequest }>(),
  },
});

export const updateItemActions = createActionGroup({
  source: 'List Items',
  events: {
    'Try to update': props<{ request: UpdateListItemRequest }>(),
    'Successfully updated': props<{ item: ListItem }>(),
    'Failed to update': props<{ request: UpdateListItemRequest }>(),
  },
});

export const deleteItemActions = createActionGroup({
  source: 'List Items',
  events: {
    'Try to delete': props<{ request: DeleteListItemRequest }>(),
    'Successfully deleted': props<{ item: ListItem }>(),
    'Failed to delete': props<{ request: DeleteListItemRequest }>(),
  },
});

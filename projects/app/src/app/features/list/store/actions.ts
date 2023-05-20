import { createAction, props } from '@ngrx/store';

import { ListItem } from '../types';

export const fetchItems = createAction(
  '[List] Fetch items',
);

export const fetchItemsSuccess = createAction(
  '[List] Fetch items success',
  props<{ items: ListItem[] }>(),
);

export const fetchItemsError = createAction(
  '[List] Fetch items error',
);

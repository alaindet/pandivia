import { createAction, props } from '@ngrx/store';

import { CreateListItemDto, ListItem } from '@app/features/list';

export const listCreateItem = {
  try: createAction(
    '[List/Item] Create item',
    props<{ dto: CreateListItemDto }>(),
  ),
  ok: createAction(
    '[List/Item] Create item success',
    props<{ item: ListItem, message: string }>(),
  ),
  err: createAction(
    '[List/Item] Create item error',
    props<{ message: string }>(),
  ),
};

export const listEditItem = {
  try: createAction(
    '[List/Item] Edit item',
    props<{ item: ListItem }>(),
  ),
  ok: createAction(
    '[List/Item] Edit item success',
    props<{ item: ListItem, message: string }>(),
  ),
  err: createAction(
    '[List/Item] Edit item error',
    props<{ message: string }>(),
  ),
};

export const listCompleteItem = {
  try: createAction(
    '[List/Item] Complete/undo item',
    props<{ itemId: string, isDone: boolean }>(),
  ),
  ok: createAction(
    '[List/Item] Complete/undo item success',
    props<{ message: string, isDone: boolean }>(),
  ),
  err: createAction(
    '[List/Item] Complete/undo item error',
    props<{ message: string }>(),
  ),
};

export const listToggleItem = {
  try: createAction(
    '[List/Item] Toggle item complete state',
    props<{ itemId: string, isDone: boolean }>(),
  ),
  ok: createAction(
    '[List/Item] Toggle item complete state success',
    props<{ message: string, isDone: boolean }>(),
  ),
  err: createAction(
    '[List/Item] Toggle item complete state error',
    props<{ message: string }>(),
  ),
};

export const listChangeItemAmount = {
  try: createAction(
    '[List/Item] Change item amount',
    props<{ itemId: string, delta: number }>(),
  ),
  ok: createAction(
    '[List/Item] Change item amount success',
    props<{ itemId: string, delta: number }>(),
  ),
  err: createAction(
    '[List/Item] Change item amount error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItem = {
  try: createAction(
    '[List/Item] Remove item',
    props<{ itemId: string }>(),
  ),
  ok: createAction(
    '[List/Item] Remove item success',
    props<{ itemId: string, message: string }>(),
  ),
  err: createAction(
    '[List/Item] Remove item error',
    props<{ message: string }>(),
  ),
};

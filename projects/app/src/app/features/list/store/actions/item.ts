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
    '[List/Item] Complete item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List/Item] Complete item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List/Item] Complete item error',
    props<{ message: string }>(),
  ),
};

export const listUndoItem = {
  try: createAction(
    '[List/Item] Undo item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List/Item] Undo item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List/Item] Undo item error',
    props<{ message: string }>(),
  ),
};

export const listToggleItem = {
  try: createAction(
    '[List/Item] Toggle item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List/Item] Toggle item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List/Item] Toggle item error',
    props<{ message: string }>(),
  ),
};

export const listIncrementItem = {
  try: createAction(
    '[List/Item] Increment item amount',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List/Item] Increment item amount success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List/Item] Increment item amount error',
    props<{ message: string }>(),
  ),
};

export const listDecrementItem = {
  try: createAction(
    '[List/Item] Decrement item amount',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List/Item] Decrement item amount success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List/Item] Decrement item amount error',
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

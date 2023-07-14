import { createAction, props } from '@ngrx/store';

import { CreateListItemDto, ListItem } from '@app/features/list';

export const listCreateItem = {
  try: createAction(
    '[List] Create item',
    props<{ dto: CreateListItemDto }>(),
  ),
  ok: createAction(
    '[List] Create item success',
    props<{ item: ListItem, message: string }>(),
  ),
  err: createAction(
    '[List] Create item error',
    props<{ message: string }>(),
  ),
};

export const listEditItem = {
  try: createAction(
    '[List] Edit item',
    props<{ item: ListItem }>(),
  ),
  ok: createAction(
    '[List] Edit item success',
    props<{ item: ListItem, message: string }>(),
  ),
  err: createAction(
    '[List] Edit item error',
    props<{ message: string }>(),
  ),
};

export const listCompleteItem = {
  try: createAction(
    '[List] Complete item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List] Complete item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List] Complete item error',
    props<{ message: string }>(),
  ),
};

export const listUndoItem = {
  try: createAction(
    '[List] Undo item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List] Undo item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List] Undo item error',
    props<{ message: string }>(),
  ),
};

export const listToggleItem = {
  try: createAction(
    '[List] Toggle item',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List] Toggle item success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List] Toggle item error',
    props<{ message: string }>(),
  ),
};

export const listIncrementItem = {
  try: createAction(
    '[List] Increment item amount',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List] Increment item amount success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List] Increment item amount error',
    props<{ message: string }>(),
  ),
};

export const listDecrementItem = {
  try: createAction(
    '[List] Decrement item amount',
    props<{ itemId: ListItem['id'] }>(),
  ),
  ok: createAction(
    '[List] Decrement item amount success',
    props<{ itemId: ListItem['id'], message: string }>(),
  ),
  err: createAction(
    '[List] Decrement item amount error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItem = {
  try: createAction(
    '[List] Remove item',
    props<{ itemId: string }>(),
  ),
  ok: createAction(
    '[List] Remove item success',
    props<{ itemId: string, message: string }>(),
  ),
  err: createAction(
    '[List] Remove item error',
    props<{ message: string }>(),
  ),
};

import { createAction, props } from '@ngrx/store';

export const listCompleteItemsByCategory = {
  try: createAction(
    '[List] Complete items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List] Complete items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List] Complete items by category error',
    props<{ message: string }>(),
  ),
};

export const listUndoItemsByCategory = {
  try: createAction(
    '[List] Undo items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List] Undo items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List] Undo items by category error',
    props<{ message: string }>(),
  ),
};

export const listRemoveCompletedItemsByCategory = {
  try: createAction(
    '[List] Remove completed by category items',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List] Remove completed by category items success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List] Remove completed by categoryitems error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItemsByCategory = {
  try: createAction(
    '[List] Remove items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List] Remove items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List] Remove items by category error',
    props<{ message: string }>(),
  ),
};

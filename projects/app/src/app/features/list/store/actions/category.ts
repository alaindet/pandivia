import { createAction, props } from '@ngrx/store';

export const listCompleteItemsByCategory = {
  try: createAction(
    '[List/Category] Complete items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List/Category] Complete items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List/Category] Complete items by category error',
    props<{ message: string }>(),
  ),
};

export const listUndoItemsByCategory = {
  try: createAction(
    '[List/Category] Undo items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List/Category] Undo items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List/Category] Undo items by category error',
    props<{ message: string }>(),
  ),
};

export const listRemoveCompletedItemsByCategory = {
  try: createAction(
    '[List/Category] Remove completed by category items',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List/Category] Remove completed by category items success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List/Category] Remove completed by categoryitems error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItemsByCategory = {
  try: createAction(
    '[List/Category] Remove items by category',
    props<{ category: string }>(),
  ),
  ok: createAction(
    '[List/Category] Remove items by category success',
    props<{ category: string, message: string }>(),
  ),
  err: createAction(
    '[List/Category] Remove items by category error',
    props<{ message: string }>(),
  ),
};

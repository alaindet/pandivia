import { createAction, props } from '@ngrx/store';

import { ListItem } from '@app/features/list';

export const listFeatureReset = createAction(
  '[List] Reset List feature',
);

export const listFetchItems = {
  try: createAction(
    '[List] Fetch items',
  ),
  ok: createAction(
    '[List] Fetch items success',
    props<{ items: ListItem[], message: string }>(),
  ),
  err: createAction(
    '[List] Fetch items error',
    props<{ message: string }>(),
  ),
  force: createAction(
    '[List] Force fetch items',
  ),
  cached: createAction(
    '[List] Fetch cached items',
  ),
};

export const listCompleteItems = {
  try: createAction(
    '[List] Complete all items',
  ),
  ok: createAction(
    '[List] Complete all items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[List] Complete all items error',
    props<{ message: string }>(),
  ),
};

export const listUndoItems = {
  try: createAction(
    '[List] Undo all items',
  ),
  ok: createAction(
    '[List] Undo all items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[List] Undo all items error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItems = {
  try: createAction(
    '[List] Remove all items',
  ),
  ok: createAction(
    '[List] Remove all items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[List] Remove all items error',
    props<{ message: string }>(),
  ),
};

export const listRemoveCompletedItems = {
  try: createAction(
    '[List] Remove all completed items',
  ),
  ok: createAction(
    '[List] Remove all completed items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[List] Remove all completed items error',
    props<{ message: string }>(),
  ),
};

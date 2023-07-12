import { createAction, props } from '@ngrx/store';

import { ListItem } from '@app/features/list';

export const listFetchItems = {
  try: createAction(
    '[List/Items] Fetch items',
  ),
  ok: createAction(
    '[List/Items] Fetch items success',
    props<{ items: ListItem[], message: string }>(),
  ),
  err: createAction(
    '[List/Items] Fetch items error',
    props<{ message: string }>(),
  ),
  force: createAction(
    '[List/Items] Force fetch items',
  ),
  cached: createAction(
    '[List/Items] Fetch cached items',
  ),
};

export const listCompleteItems = {
  try: createAction(
    '[List/Items] Complete/undo all items',
    props<{ isDone: boolean }>(),
  ),
  ok: createAction(
    '[List/Items] Complete/undo all items success',
    props<{ isDone: boolean, message: string }>(),
  ),
  err: createAction(
    '[List/Items] Complete/undo all items error',
    props<{ message: string }>(),
  ),
};

export const listRemoveItems = {
  try: createAction(
    '[List/Items] Remove all items',
  ),
  ok: createAction(
    '[List/Items] Remove all items success',
    props<{ message: string }>(),
  ),
  err: createAction(
    '[List/Items] Remove all items error',
    props<{ message: string }>(),
  ),
};

export const listRemoveCompletedItems = {
  try: createAction(
    '[List/Items] Remove all completed items',
  ),
  ok: createAction(
    '[List/Items] Remove all completed items success',
  ),
  err: createAction(
    '[List/Items] Remove all completed items error',
  ),
};

import { createAction, props } from '@ngrx/store';

import { ListFilter } from '@app/features/list';

// WARNING: Potentially too generic name
export const listFilters = {
  setCategory: createAction(
    '[List/Filters] Set category filter',
    props<{ category: string }>(),
  ),
  clearCategory: createAction(
    '[List/Filters] Clear category filter',
  ),
  setCompletedFilter: createAction(
    '[List/Filters] Set completed filter',
    props<{ isDone: boolean }>(),
  ),
  clearCompletedFilter: createAction(
    '[List/Filters] Clear completed',
  ),
  clearByName: createAction(
    '[List/Filters] Clear filter by name',
    props<{ name: ListFilter }>(),
  ),
  clearAll: createAction(
    '[List/Filters] Clear all filters',
  ),
};

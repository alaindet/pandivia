import { createAction, props } from '@ngrx/store';

import { ListFilter } from '@app/features/list';

// WARNING: Potentially too generic name
export const listFilters = {
  setCategory: createAction(
    '[List] Set category filter',
    props<{ category: string }>(),
  ),
  clearCategory: createAction(
    '[List] Clear category filter',
  ),
  setCompleted: createAction(
    '[List] Set completed filter',
    props<{ isDone: boolean }>(),
  ),
  clearCompleted: createAction(
    '[List] Clear completed filter',
  ),
  setSearchQuery: createAction(
    '[List] Set search query filter',
    props<{ searchQuery: string }>(),
  ),
  clearSearchQuery: createAction(
    '[List] Clear search query filter',
  ),
  clearByName: createAction(
    '[List] Clear filter by name',
    props<{ name: ListFilter }>(),
  ),
  clearAll: createAction(
    '[List] Clear all filters',
  ),
};

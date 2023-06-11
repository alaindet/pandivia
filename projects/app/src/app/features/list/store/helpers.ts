import { catchError, map, of } from 'rxjs';

import { ListService } from '../list.service';
import * as fromActions from './actions';
import { ListFeatureState } from './state';
import { ListItem } from '@app/core';

export function fetchItemsHelper(listService: ListService) {
  return listService.getItems().pipe(
    map(items => fromActions.listFetchItemsActions.fetchItemsSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch list items'; // TODO: Translate
      return of(fromActions.listFetchItemsActions.fetchItemsError({ error }));
    })
  )
}

export function getItemIndex(state: ListFeatureState, itemId: string): number | null {
  const index = state.items.findIndex(item => item.id === itemId);
  return (index === -1) ? null : index;
}

export function updateItemsByCategory(
  state: ListFeatureState,
  category: string,
  fn: (item: ListItem) => void,
) {
  state.items.forEach(item => {
    if (item.category === category) {
      fn(item);
    }
  });
}
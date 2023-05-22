import { catchError, map, of } from 'rxjs';

import { ListService } from '../list.service';
import * as fromActions from './actions';

export function fetchItemsHelper(listService: ListService) {
  return listService.getItems().pipe(
    map(items => fromActions.fetchListItemsActions.fetchItemsSuccess({ items })),
    catchError(() => {
      const error = 'Could not fetch items'; // TODO: Translate
      return of(fromActions.fetchListItemsActions.fetchItemsError({ error }));
    })
  )
}

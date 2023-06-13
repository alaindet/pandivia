import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take, throwError } from 'rxjs';

import { ListItem } from '../types';
import { selectListItemById } from '../store';

export function findListItemById(
  store: Store,
  itemId: string,
): Observable<ListItem> {
  return store.select(selectListItemById(itemId)).pipe(
    take(1),
    switchMap(item => {

      if (!item) {
        // TODO: Translate
        const message = `List item with id ${itemId} not found`;
        return throwError(() => Error(message));
      }

      return of(item);
    }),
  )
}
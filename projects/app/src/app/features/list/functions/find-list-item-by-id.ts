import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take, throwError } from 'rxjs';

import { ListItem } from '../types';
import { selectListItemById } from '../store';
import { errorI18n } from '@app/common/utils';

export function findListItemById(
  store: Store,
  itemId: string,
): Observable<ListItem> {
  return store.select(selectListItemById(itemId)).pipe(
    take(1),
    switchMap(item => {

      if (!item) {
        return throwError(() => errorI18n('list.error.itemNotFound', { id: itemId }));
      }

      return of(item);
    }),
  )
}

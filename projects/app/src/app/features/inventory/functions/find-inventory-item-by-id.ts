import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectInventoryItemById } from '../store';
import { InventoryItem } from '../types';

export function findInventoryItemById(
  store: Store,
  itemId: string,
): Observable<InventoryItem> {
  return store.select(selectInventoryItemById(itemId)).pipe(
    take(1),
    switchMap(item => {

      if (!item) {
        return throwError(() => Error(JSON.stringify({
          path: 'inventory.error.itemNoFound',
          id: itemId,
        })));
      }

      return of(item);
    }),
  )
}

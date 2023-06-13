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
        // TODO: Translate
        const message = `Inventory item with id ${itemId} not found`;
        return throwError(() => Error(message));
      }

      return of(item);
    }),
  )
}
import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';

import { InventoryItem } from '@app/core';
import { selectInventoryItemById } from '../store';

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
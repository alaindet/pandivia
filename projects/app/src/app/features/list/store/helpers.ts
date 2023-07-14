import { catchError, map, of } from 'rxjs';

import { listFetchItems } from './actions';
import { ListItem } from '../types';
import { createListAllItemsController } from '../services/all-items.controller';

export function fetchListItemsHelper(
  svc: ReturnType<typeof createListAllItemsController>,
) {
  return svc.fetch().pipe(
    map(items => {
      const message = 'common.async.fetchItemsSuccess';
      return listFetchItems.ok({ items, message });
    }),
    catchError(() => {
      const message = 'common.async.fetchItemsError';
      return of(listFetchItems.err({ message }));
    })
  )
}

export function updateItem(
  items: ListItem[],
  itemId: ListItem['id'],
  updater: (oldItem: ListItem) => Partial<ListItem>,
): ListItem[] {
  return items.map(anItem => {
    if (anItem.id !== itemId) return anItem;
    return { ...anItem, ...updater(anItem) };
  });
}

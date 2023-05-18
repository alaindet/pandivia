import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { ITEMS } from './items';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  getItems(): Observable<any> {
    return of(ITEMS).pipe(map(items => {

      const groupedByCategory: { [category: string]: any[] } = {};

      items.forEach(item => {
        if (!groupedByCategory[item.category.id]) {
          groupedByCategory[item.category.id] = [];
        }
        groupedByCategory[item.category.id].push(item);
      });

      return Object.entries(groupedByCategory).map(([category, items]) => {
        return { category: items[0].category, items };
      });
    }));
  }
}
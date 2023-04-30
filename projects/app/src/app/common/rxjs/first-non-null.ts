import { Observable, take } from 'rxjs';

import { filterNull } from './filter-null';

export function firstNonNull() {
  return function <T>(source: Observable<T>): Observable<NonNullable<T>> {
    return source.pipe(
      filterNull(),
      take(1),
    );
  };
}

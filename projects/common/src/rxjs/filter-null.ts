import { filter, Observable } from 'rxjs';

export function filterNull() {
  return function <T>(source: Observable<T>): Observable<NonNullable<T>> {
    return source.pipe(
      filter(val => val !== undefined && val !== null)
    ) as Observable<NonNullable<T>>;
  };
}

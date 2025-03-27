import { Observable, filter, take } from 'rxjs';

export function firstFalse<T extends {}>() {
  return function (source: Observable<T>): Observable<NonNullable<T>> {
    return source.pipe(
      filter(val => !val),
      take(1),
    );
  };
}

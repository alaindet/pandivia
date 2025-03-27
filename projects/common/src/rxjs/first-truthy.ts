import { Observable, filter, take } from 'rxjs';

export function firstTruthy<T extends {}>() {
  return function (source: Observable<T>): Observable<NonNullable<T>> {
    return source.pipe(
      filter(val => !!val),
      take(1),
    );
  };
}

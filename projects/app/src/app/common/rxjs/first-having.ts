import { Observable, filter, take } from 'rxjs';

type FilteringFunction<T extends {}> = (arg: T) => boolean;

export function firstHaving<T extends {}>(fn: FilteringFunction<T>) {
  return function (source: Observable<T>): Observable<NonNullable<T>> {
    return source.pipe(
      filter(val => fn(val)),
      take(1),
    );
  };
}

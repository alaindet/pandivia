import { Observable, from, of, switchMap, throwError } from 'rxjs';

// TODO: Is there a better way?
export function promiseToObservable<T = any>(
  thePromise: Promise<T | Error>,
): Observable<T> {
  return from(thePromise).pipe(switchMap(thePromiseValue => {
    return (thePromiseValue instanceof Error)
      ? throwError(() => new Error(thePromiseValue.message))
      : of(thePromiseValue);
  }));
}

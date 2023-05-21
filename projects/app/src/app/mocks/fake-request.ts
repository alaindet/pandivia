import { Observable, map, of, switchMap, throwError, timer } from 'rxjs';

export type FakeRequestConfig = {
  delay?: number;
  failRate?: number; // 0 <= failRate <= 1
};

export const MOCK_FAIL_RATE = 0.2;
export const MOCK_DELAY = 500;

export function fakeRequest<T = any>(
  data: T,
  config?: FakeRequestConfig,
): Observable<T> {
  const failRate = config?.failRate ?? 0;
  const delay = config?.delay ?? 0;
  const failed = didRequestFail(failRate);
  const source$: Observable<any> = (delay > 0) ? of(true) : timer(delay);

  if (failed) {
    return source$.pipe(
      switchMap(() => throwError(() => new Error('Request failed'))),
    );
  }

  return source$.pipe(map(() => data));
}

function didRequestFail(failRate: number): boolean {
  if (failRate === 0) {
    return false;
  }

  if (failRate === 1) {
    return true;
  }

  return Math.random() > failRate;
}

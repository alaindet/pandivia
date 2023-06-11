import { Observable, map, of, switchMap, tap, throwError, timer } from 'rxjs';

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
  const source$: Observable<any> = (delay > 0) ? timer(delay) : of(true);

  if (failed) {
    return source$.pipe(
      tap(() => console.log('[fakeRequest] Failed')),
      switchMap(() => throwError(() => new Error('Request failed'))),
    );
  }

  return source$.pipe(
    tap(() => console.log('[fakeRequest] Success', data)),
    map(() => structuredClone(data)),
  );
}

function didRequestFail(failRate: number): boolean {
  if (failRate === 0) {
    return false;
  }

  if (failRate === 1) {
    return true;
  }

  return Math.random() <= failRate;
}

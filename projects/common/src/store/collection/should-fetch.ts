import { LOADING_STATUS, LoadingStatus, UnixTimestamp } from '../../types';

export function shouldFetchCollection<T extends Record<string, any>>(
  items: T[],
  status: LoadingStatus,
  lastUpdated: UnixTimestamp | null,
  cacheMaxAge: number = 30_000 // 30 seconds
) {
  return (
    status === LOADING_STATUS.PRISTINE ||
    lastUpdated === null ||
    Date.now() - lastUpdated > cacheMaxAge ||
    items.length === 0
  );
}

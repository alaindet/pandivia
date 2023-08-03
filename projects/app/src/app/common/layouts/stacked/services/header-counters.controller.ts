import { Observable } from 'rxjs';

import { DataSource } from '../../../sources';
import { Counters } from '../../../types';

export type StackedLayoutHeaderCountersViewModel = Counters | null;

export function createHeaderCountersController(destroy$: Observable<void>) {

  const data = new DataSource<StackedLayoutHeaderCountersViewModel>(null, destroy$);

  function set(counters: Counters) {
    data.next(counters);
  }

  function clear() {
    data.next(null);
  }

  return {
    data: data.data$,

    set,
    clear,
  };
}

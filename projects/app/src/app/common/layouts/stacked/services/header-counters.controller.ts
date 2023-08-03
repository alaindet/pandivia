import { signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Counters } from '../../../types';

export type StackedLayoutHeaderCountersViewModel = Counters | null;

export function createHeaderCountersController(destroy$: Observable<void>) {

  const data = signal<StackedLayoutHeaderCountersViewModel>(null);

  function set(counters: Counters) {
    data.set(counters);
  }

  function clear() {
    data.set(null);
  }

  return {
    data,

    set,
    clear,
  };
}

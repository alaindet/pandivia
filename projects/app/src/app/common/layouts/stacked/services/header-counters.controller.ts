import { signal } from '@angular/core';

import { Counters } from '@common/types';

export function createHeaderCountersController() {
  const counters = signal<Counters | null>(null);

  function set(_counters: Counters) {
    counters.set(_counters);
  }

  function clear() {
    counters.set(null);
  }

  return {
    counters: counters.asReadonly(),

    set,
    clear,
  };
}

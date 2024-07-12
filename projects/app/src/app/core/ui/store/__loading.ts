import { signal } from '@angular/core';

export function createUiLoadingController() {
  const loading = signal(false);

  function start() {
    loading.set(true);
  }

  function stop() {
    loading.set(false);
  }

  return {
    loading: loading.asReadonly(),
    start,
    stop,
  };
}

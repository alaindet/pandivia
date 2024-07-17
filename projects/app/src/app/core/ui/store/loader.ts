import { signal } from '@angular/core';

export function createUiLoaderController() {
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

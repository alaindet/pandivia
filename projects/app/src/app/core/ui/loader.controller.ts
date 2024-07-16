import { inject } from '@angular/core';
import { selectUiIsLoading, uiLoaderStart, uiLoaderStop } from '../store';

export function createLoaderController() {

  const store = inject(Store);

  const isLoading = store.select(selectUiIsLoading);

  function start() {
    store.dispatch(uiLoaderStart());
  }

  function stop() {
    store.dispatch(uiLoaderStop());
  }

  return {
    isLoading,

    start,
    stop,
  };
}

import { Signal, effect } from '@angular/core';

export function effectOnChange<T = any>(
  watchedSignal: Signal<T>,
  callback: (data: T) => void,
): void {
  let firstChange = true;

  effect(() => {

    // Create dependency on signal
    watchedSignal();

    // Skip first automatic trigger
    if (firstChange) {
      firstChange = false;
      return;
    }

    callback(watchedSignal());
  });
}

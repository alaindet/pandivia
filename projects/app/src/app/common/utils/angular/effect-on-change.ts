import { Signal, effect } from '@angular/core';

export function effectOnChange<T = any>(
  signal: Signal<T>,
  callback: (data: T) => void,
): void {
  let firstChange = true;

  effect(() => {

    // Create dependency on signal
    signal();

    // Skip first automatic trigger with default value
    if (firstChange) {
      firstChange = false;
      return;
    }

    callback(signal());
  });
}

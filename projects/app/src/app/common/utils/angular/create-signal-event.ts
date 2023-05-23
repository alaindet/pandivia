import { Signal, effect } from '@angular/core';

export function createSignalEvent<T = any>(
  signal: Signal<T>,
  callback: (data: T) => void,
): void {
  let firstChange = true;

  effect(() => {
    signal() // <-- Create dependency
    if (firstChange) {
      firstChange = false;
      return;
    }
    callback(signal());
  });
}

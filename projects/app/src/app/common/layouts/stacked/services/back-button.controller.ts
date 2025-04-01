import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { BACK_BUTTON_MODE, BackButtonMode } from '@common/types';

export function createBackButtonController() {
  const mode = signal<BackButtonMode>(BACK_BUTTON_MODE.NONE);

  const pressed$ = new Subject<void>();

  function enableNative() {
    mode.set(BACK_BUTTON_MODE.NATIVE);
  }

  function enableControlled() {
    mode.set(BACK_BUTTON_MODE.CONTROLLED);
  }

  function disable() {
    mode.set(BACK_BUTTON_MODE.NONE);
  }

  function press() {
    pressed$.next();
  }

  function destroy() {
    pressed$.complete();
  }

  return {
    mode: mode.asReadonly(),
    pressed$: pressed$.asObservable(),

    enableNative,
    enableControlled,
    disable,
    press,
    destroy,
  };
}

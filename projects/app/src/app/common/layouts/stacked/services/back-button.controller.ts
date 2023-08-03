import { signal } from '@angular/core';
import { Observable } from 'rxjs';

import { EventSource } from '../../../sources';
import { BACK_BUTTON_STATUS, BackButtonStatus } from '../../../types';

export type StackedLayoutBackButtonViewModel = BackButtonStatus;

export function createBackButtonController(destroy$: Observable<void>) {

  const data = signal<StackedLayoutBackButtonViewModel>(BACK_BUTTON_STATUS.NONE);

  const events = {
    pressed: new EventSource<void>(destroy$),
  };

  function enableNative() {
    data.set(BACK_BUTTON_STATUS.NATIVE);
  }

  function enableControlled() {
    data.set(BACK_BUTTON_STATUS.CONTROLLED);
  }

  function disable() {
    data.set(BACK_BUTTON_STATUS.NONE);
  }

  function press() {
    events.pressed.next();
  }

  return {
    data,
    pressed$: events.pressed.event$,

    enableNative,
    enableControlled,
    disable,
    press,
  };
}

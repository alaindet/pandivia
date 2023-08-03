import { Observable } from 'rxjs';

import { DataSource, EventSource } from '../../../sources';
import { BACK_BUTTON_STATUS, BackButtonStatus } from '../../../types';

export type StackedLayoutBackButtonViewModel = BackButtonStatus;

export function createBackController(destroy$: Observable<void>) {

  const initialState: StackedLayoutBackButtonViewModel = BACK_BUTTON_STATUS.NONE;

  const data = new DataSource<StackedLayoutBackButtonViewModel>(
    initialState,
    destroy$,
  );

  const events = {
    pressed: new EventSource<void>(destroy$),
  };

  function enableNative() {
    data.next(BACK_BUTTON_STATUS.NATIVE);
  }

  function enableControlled() {
    data.next(BACK_BUTTON_STATUS.CONTROLLED);
  }

  function disable() {
    data.next(BACK_BUTTON_STATUS.NONE);
  }

  function press() {
    events.pressed.next();
  }

  return {
    data: data.data$,
    events,

    enableNative,
    enableControlled,
    disable,
    press,
  };
}

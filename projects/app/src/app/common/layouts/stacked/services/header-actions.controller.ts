import { signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ActionsMenuItem } from '../../../components';
import { EventSource } from '../../../sources';

export type StackedLayoutHeaderActionsViewModel = ActionsMenuItem[];

export function createHeaderActionsController(destroy$: Observable<void>) {

  const data = signal<StackedLayoutHeaderActionsViewModel>([]);

  const events = {
    confirmed: new EventSource<ActionsMenuItem['id']>(destroy$),
  };

  function set(actions: ActionsMenuItem[]) {
    data.set(actions);
  }

  function clear() {
    data.set([]);
  }

  function confirm(actionId: ActionsMenuItem['id']) {
    events.confirmed.next(actionId);
  }

  return {
    data,
    confirmed$: events.confirmed.event$,

    set,
    clear,
    confirm,
  };
}

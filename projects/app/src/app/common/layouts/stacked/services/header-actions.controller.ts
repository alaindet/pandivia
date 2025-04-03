import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { ActionsMenuItem } from '@fruit/components';

export function createHeaderActionsController() {
  const actions = signal<ActionsMenuItem[]>([]);

  const confirmed$ = new Subject<ActionsMenuItem['id']>();

  function set(_actions: ActionsMenuItem[]) {
    actions.set(_actions);
  }

  function clear() {
    actions.set([]);
  }

  function confirm(actionId: ActionsMenuItem['id']) {
    confirmed$.next(actionId);
  }

  function destroy() {
    confirmed$.complete();
  }

  return {
    actions: actions.asReadonly(),
    confirmed: confirmed$.asObservable(),

    set,
    clear,
    confirm,
    destroy,
  };
}

import { Observable } from 'rxjs';

import { DataSource, EventSource } from '../../../sources';
import { ActionsMenuItem } from '../../../components';

export type StackedLayoutHeaderActionsViewModel = ActionsMenuItem[];

export function createHeaderActionsController(destroy$: Observable<void>) {

  const data = new DataSource<StackedLayoutHeaderActionsViewModel>([], destroy$);

  const events = {
    confirmed: new EventSource<ActionsMenuItem['id']>(destroy$),
  };

  function set(actions: ActionsMenuItem[]) {
    data.next(actions);
  }

  function clear() {
    data.next([]);
  }

  function confirm(actionId: ActionsMenuItem['id']) {
    events.confirmed.next(actionId);
  }

  return {
    data: data.data$,
    events,

    set,
    clear,
    confirm,
  };
}

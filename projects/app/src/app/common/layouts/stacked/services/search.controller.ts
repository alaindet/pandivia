import { Observable } from 'rxjs';

import { DataSource, EventSource } from '../../../sources';

export type StackedLayoutSearchViewModel = {
  enabled: boolean;
  query: string;
};

export function createSearchController(destroy$: Observable<void>) {

  const initialState: StackedLayoutSearchViewModel = {
    enabled: false,
    query: '',
  };

  const data = new DataSource<StackedLayoutSearchViewModel>(
    initialState,
    destroy$,
  );

  const events = {
    searched: new EventSource<string>(destroy$),
  };

  function enable() {
    data.next(data => ({ ...data, enabled: true, query: '' }));
  }

  function disable() {
    data.next(data => ({ ...data, enabled: false, query: '' }));
  }

  function toggle() {
    data.next(data => ({ ...data, enabled: !data.enabled, query: '' }));
  }

  function search(query: string) {
    data.next(data => ({ ...data, query }));
  }

  function clear() {
    data.next(data => ({ ...data, query: '' }));
  }

  return {
    data: data.data$,
    events,

    enable,
    disable,
    toggle,
    search,
    clear,
  };
}

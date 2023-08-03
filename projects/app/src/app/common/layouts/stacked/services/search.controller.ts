import { Observable } from 'rxjs';

import { EventSource } from '../../../sources';
import { signal } from '@angular/core';

export type StackedLayoutSearchViewModel = {
  enabled: boolean;
  query: string;
};

export function createSearchController(destroy$: Observable<void>) {

  const data = signal<StackedLayoutSearchViewModel>({
    enabled: false,
    query: '',
  });

  const events = {
    searched: new EventSource<string>(destroy$),
  };

  function enable() {
    data.mutate(data => {
      data.enabled = true;
      data.query = '';
    });
  }

  function disable() {
    data.mutate(data => {
      data.enabled = false;
      data.query = '';
    });
  }

  function toggle() {
    data.mutate(data => {
      data.enabled = !data.enabled;
      data.query = '';
    });
  }

  function search(query: string) {
    data.mutate(data => {
      data.query = query;
    });
  }

  function clear() {
    data.mutate(data => {
      data.query = '';
    });
  }

  return {
    data,
    searched$: events.searched.event$,

    enable,
    disable,
    toggle,
    search,
    clear,
  };
}

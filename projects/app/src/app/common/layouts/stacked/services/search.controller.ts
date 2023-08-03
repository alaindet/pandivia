import { Observable } from 'rxjs';

import { EventSource } from '../../../sources';
import { signal } from '@angular/core';

export type StackedLayoutSearchViewModel = {
  enabled: boolean;
  visible: boolean;
  query: string;
};

export function createSearchController(destroy$: Observable<void>) {

  const thresholdMilliseconds = 400;
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  const data = signal<StackedLayoutSearchViewModel>({
    enabled: false,
    visible: false,
    query: '',
  });

  const events = {
    searched: new EventSource<string>(destroy$),
    cleared: new EventSource<void>(destroy$),
  };

  function enable() {
    data.mutate(data => {
      data.enabled = true;
      data.visible = false;
      data.query = '';
    });
  }

  function disable() {
    data.mutate(data => {
      data.enabled = false;
      data.visible = false;
      data.query = '';
    });
  }

  function show() {
    data.mutate(data => {
      data.visible = true;
    });
  }

  function hide() {
    data.mutate(data => {
      data.visible = false;
    });
  }

  function toggle() {
    data.mutate(data => {
      data.visible = !data.visible;
    });
  }

  function search(query: string) {
    if (searchTimer !== null) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
      data.mutate(data => data.query = query);
      events.searched.next(query);
    }, thresholdMilliseconds);
  }

  function clear(triggerEvents = true) {
    data.mutate(data => {
      data.query = '';
    });
    if (triggerEvents) {
      events.cleared.next();
    }
  }

  return {
    data,
    searched$: events.searched.event$,
    cleared$: events.cleared.event$,

    enable,
    disable,
    show,
    hide,
    toggle,
    search,
    clear,
  };
}

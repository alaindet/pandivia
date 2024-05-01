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

  function patchData(
    updatedData: (
      | Partial<StackedLayoutSearchViewModel>
      | ((prev: StackedLayoutSearchViewModel) => Partial<StackedLayoutSearchViewModel>)
    ),
  ): void {

    if (typeof updatedData === 'function') {
      const newData = updatedData(data());
      data.update(data => ({ ...data, ...newData }));
      return;
    }

    data.update(data => ({ ...data, ...updatedData }));
  }

  function enable() {
    patchData({ enabled: true, visible: false, query: '' });
  }

  function disable() {
    patchData({ enabled: false, visible: false, query: '' });
  }

  function show() {
    patchData({ visible: true });
  }

  function hide() {
    patchData({ visible: false });
  }

  function toggle() {
    patchData(data => ({ visible: !data.visible }));
  }

  function search(query: string) {
    if (searchTimer !== null) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
      patchData({ query });
      events.searched.next(query);
    }, thresholdMilliseconds);
  }

  function clear(triggerEvents = true) {
    patchData({ query: '' });
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

import { Subject } from 'rxjs';

import { signal } from '@angular/core';

export function createSearchController(debounceTime = 400) {

  const enabled = signal(false);
  const visible = signal(false);
  const query = signal('');

  const searched$ = new Subject<string>();
  const cleared$ = new Subject<void>();

  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function enable() {
    enabled.set(true);
  }

  function disable() {
    enabled.set(false);
  }

  function show() {
    visible.set(true);
  }

  function hide() {
    visible.set(false);
  }

  function toggle() {
    visible.update(prev => !prev);
  }

  function search(_query: string) {

    if (searchTimer !== null) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(
      () => {
        query.set(_query);
        searched$.next(_query);
      },
      debounceTime,
    );
  }

  function clear(triggerEvents = true) {
    query.set('');
    if (triggerEvents) {
      cleared$.next();
    }
  }

  function destroy() {
    searched$.complete();
    cleared$.complete();
  }

  return {
    enabled: enabled.asReadonly(),
    visible: visible.asReadonly(),
    query: query.asReadonly(),

    searched: searched$.asObservable(),
    cleared: cleared$.asObservable(),

    enable,
    disable,
    show,
    hide,
    toggle,
    search,
    clear,
    destroy,
  };
}

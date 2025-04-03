import { signal } from '@angular/core';
import { Subject } from 'rxjs';

export function createSearchController() {
  const enabled = signal(false);
  const visible = signal(false);
  const query = signal('');

  const searched$ = new Subject<string>();
  const cleared$ = new Subject<void>();

  const thresholdMilliseconds = 400;
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function enable() {
    enabled.set(true);
  }

  function reset() {
    enabled.set(false);
    visible.set(false);
    query.set('');
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
    visible.update((prev) => !prev);
  }

  function search(_query: string) {
    if (searchTimer !== null) {
      clearTimeout(searchTimer);
    }

    const fn = () => {
      query.set(_query);
      searched$.next(_query);
    };

    searchTimer = setTimeout(fn, thresholdMilliseconds);
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
    reset,
    show,
    hide,
    toggle,
    search,
    clear,
    destroy,
  };
}

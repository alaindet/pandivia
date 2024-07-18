import { Subject } from 'rxjs';

import { signal } from '@angular/core';

export function createSearchController(debounceTime = 400) {

  const enabled = signal(false);
  const visible = signal(false);
  const query = signal('');

  const searched$ = new Subject<string>();
  const cleared$ = new Subject<void>();

  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function enable(src: string) {
    console.log('SearchController.enable', src); // TODO: Remove
    enabled.set(true);
  }

  function disable(src: string) {
    console.log('SearchController.disable', src); // TODO: Remove
    enabled.set(false);
  }

  function show(src: string) {
    console.log('SearchController.show', src); // TODO: Remove
    visible.set(true);
  }

  function hide(src: string) {
    console.log('SearchController.hide', src); // TODO: Remove
    visible.set(false);
  }

  function toggle(src: string) {
    console.log('SearchController.toggle', src); // TODO: Remove
    visible.update(prev => !prev);
  }

  function search(src: string, _query: string) {
    console.log('SearchController.search', src, _query); // TODO: Remove

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

  function clear(src: string, triggerEvents = true) {
    console.log('SearchController.clear', src, triggerEvents); // TODO: Remove

    query.set('');
    if (triggerEvents) {
      cleared$.next();
    }
  }

  function destroy(src: string) {
    console.log('SearchController.destroy', src); // TODO: Remove
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

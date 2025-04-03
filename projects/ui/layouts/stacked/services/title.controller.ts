import { signal } from '@angular/core';

export type StackedLayoutTitleViewModel = string;

export function createTitleController() {

  const title = signal('');

  function set(_title: string) {
    title.set(_title);
  }

  return {
    title,
    set,
  };
}

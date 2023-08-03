import { Observable } from 'rxjs';

import { signal } from '@angular/core';

export type StackedLayoutTitleViewModel = string;

export function createTitleController(destroy$: Observable<void>) {

  const data = signal<StackedLayoutTitleViewModel>('');

  function set(title: string) {
    data.set(title);
  }

  return {
    data,
    set,
  };
}

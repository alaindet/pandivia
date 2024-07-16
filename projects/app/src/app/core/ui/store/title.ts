import { effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

export function createUiTitleController() {
  const pageTitle = inject(Title);

  const title = signal('Pandivia');

  function set(_title: string) {
    title.set(_title);
  }

  function init() {
    effect(() => {
      pageTitle.setTitle(title());
    });
  }

  return {
    title: title.asReadonly(),
    set,
    init,
  };
}

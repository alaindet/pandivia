import { signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { isPrintableChar, onKeydown } from '@common/utils';
import { KEYBOARD_KEY as KB } from '@common/types';

import { ActionsMenuService } from './actions-menu.service';

export function createItemsElementController(parent: ActionsMenuService) {
  const el = signal<HTMLElement | null>(null);

  const destroy$ = new Subject<void>();

  function init(inputEl: HTMLElement) {
    el.set(inputEl);
    listenToKeyboard(inputEl);
  }

  function listenToKeyboard(el: HTMLElement) {
    const confirmItem = {
      on: [KB.SPACE, KB.ENTER],
      handler: () => {
        parent.actions.confirmFocused();
        parent.menu.close();
        parent.focus.clear();
        parent.buttonElement.el()?.focus();
      },
    };

    const closeItems = {
      on: [KB.ESC, KB.ESCAPE, KB.TAB],
      handler: () => {
        parent.menu.close();
        parent.focus.button();
      },
    };

    const focusPreviousItem = {
      on: [KB.ARROW_UP, KB.UP],
      handler: () => parent.focus.previous(),
    };

    const focusNextItem = {
      on: [KB.ARROW_DOWN, KB.DOWN],
      handler: () => parent.focus.next(),
    };

    const focusFirstItem = {
      on: [KB.HOME, KB.PAGE_UP],
      handler: () => parent.focus.first(),
    };

    const focusLastItem = {
      on: [KB.END, KB.PAGE_DOWN],
      handler: () => parent.focus.last(),
    };

    const searchItems = {
      on: isPrintableChar,
      handler: (event: KeyboardEvent) => parent.focus.search(event.key),
    };

    onKeydown(el, destroy$, [
      confirmItem,
      closeItems,
      focusPreviousItem,
      focusNextItem,
      focusFirstItem,
      focusLastItem,
      searchItems,
    ])
      .pipe(takeUntil(destroy$))
      .subscribe();
  }

  function destroy() {
    destroy$.complete();
  }

  return {
    el: el.asReadonly(),
    init,
    destroy,
  };
}

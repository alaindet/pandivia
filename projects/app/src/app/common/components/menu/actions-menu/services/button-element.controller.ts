import { Renderer2, effect, inject, signal } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { KEYBOARD_KEY as KB } from '@common/types';
import { createKeyBinding, onKeydown } from '@common/utils';

import { ACTIONS_MENU_BUTTON_FOCUSED } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createButtonElementController(parent: ActionsMenuService) {
  const renderer = inject(Renderer2);

  const el = signal<HTMLButtonElement | null>(null);
  const destroy$ = new Subject<void>();

  function init(inputEl: HTMLButtonElement) {
    if (el() !== null) {
      return;
    }

    el.set(inputEl);
    listenToReady(inputEl);
    listenToFocus(inputEl);
    listenToMenuOpen(inputEl);
    listenToClick(inputEl);
    listenToKeyboard(inputEl);
  }

  function listenToReady(el: HTMLButtonElement) {
    parent.core.ready$.subscribe(() => {
      renderer.setAttribute(el, 'id', parent.ids.button());
      renderer.setAttribute(el, 'aria-haspopup', 'menu');
      renderer.setAttribute(el, 'aria-controls', parent.ids.items());
    });
  }

  function listenToFocus(el: HTMLButtonElement) {
    effect(() => {
      const focused = parent.focus.focused();
      if (focused === ACTIONS_MENU_BUTTON_FOCUSED) {
        el.focus();
      }
    });
  }

  function listenToMenuOpen(el: HTMLButtonElement) {
    effect(() => {
      if (parent.menu.isOpen()) {
        renderer.setAttribute(el, 'aria-expanded', 'true');
      } else {
        renderer.removeAttribute(el, 'aria-expanded');
      }
    });
  }

  function listenToClick(el: HTMLButtonElement) {
    const clicked$ = fromEvent<MouseEvent>(el, 'click').pipe(
      takeUntil(destroy$)
    );

    clicked$.subscribe(() => {
      if (!parent.menu.isOpen()) {
        parent.menu.open();
        return;
      }

      parent.menu.close();
      parent.focus.clear();
    });
  }

  function listenToKeyboard(el: HTMLButtonElement) {
    const focusFirstItem = createKeyBinding(
      [KB.SPACE, KB.ENTER, KB.ARROW_DOWN, KB.DOWN],
      () => {
        parent.menu.open();
        parent.focus.first();
        setTimeout(() => parent.itemsElement.el()?.focus(), 20);
      }
    );

    const focusLastItem = createKeyBinding([KB.ARROW_UP, KB.UP], () => {
      parent.menu.open();
      parent.focus.last();
    });

    const clearFocus = createKeyBinding([KB.ESC, KB.ESCAPE], () => {
      parent.menu.close();
      parent.focus.clear();
    });

    const focusOut = createKeyBinding([KB.TAB], () => {
      parent.menu.close();
      parent.focus.clear();
      return true;
    });

    onKeydown(el, destroy$, [
      focusFirstItem,
      focusLastItem,
      clearFocus,
      focusOut,
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

import { Renderer2, effect, inject, signal } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { KEYBOARD_KEY as KB } from '@common/types';
import { onKeydown } from '@common/utils';

import { ACTIONS_MENU_BUTTON_FOCUSED } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createButtonElementController(parent: ActionsMenuService) {
  const renderer = inject(Renderer2);

  const el = signal<HTMLButtonElement | null>(null);
  const destroy$ = new Subject<void>();

  effect(_focusMovedEffect);
  effect(_toggleMenuEffect);

  function init(inputEl: HTMLButtonElement) {
    if (el() !== null) {
      return;
    }

    el.set(inputEl);
    listenToReady(inputEl);
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
    const focusFirstItem = {
      on: [KB.SPACE, KB.ENTER, KB.ARROW_DOWN, KB.DOWN],
      handler: () => {
        parent.menu.open();
        parent.focus.first();
        setTimeout(() => parent.itemsElement.el()?.focus(), 20);
      },
    };

    const focusLastItem = {
      on: [KB.ARROW_UP, KB.UP],
      handler: () => {
        parent.menu.open();
        parent.focus.last();
      },
    };

    const clearFocus = {
      on: [KB.ESC, KB.ESCAPE],
      handler: () => {
        parent.menu.close();
        parent.focus.clear();
      },
    };

    const focusOut = {
      on: [KB.TAB],
      handler: () => {
        parent.menu.close();
        parent.focus.clear();
        return true;
      },
    };

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

  function _focusMovedEffect() {
    const buttonEl = el();
    if (buttonEl === null) {
      return;
    }

    const focusedEl = parent.focus.focused();
    if (focusedEl !== ACTIONS_MENU_BUTTON_FOCUSED) {
      return;
    }

    buttonEl.focus();
  }

  function _toggleMenuEffect() {
    const buttonEl = el();
    if (buttonEl === null) {
      return;
    }

    if (parent.menu.isOpen()) {
      renderer.setAttribute(buttonEl, 'aria-expanded', 'true');
      return;
    }

    renderer.removeAttribute(buttonEl, 'aria-expanded');
  }

  return {
    el: el.asReadonly(),
    init,
    destroy,
  };
}

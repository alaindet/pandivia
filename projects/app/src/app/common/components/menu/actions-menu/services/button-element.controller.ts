import { Renderer2, inject } from '@angular/core';
import { filter, fromEvent, switchMap, take, takeUntil } from 'rxjs';

import { KEYBOARD_KEY as KB } from '@app/common/types';
import { onKeydown } from '@app/common/utils';
import { ACTIONS_MENU_BUTTON_FOCUSED } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createButtonElementController(parent: ActionsMenuService) {

  const renderer = inject(Renderer2);
  let el: HTMLButtonElement | null = null;

  function init(inputEl: HTMLButtonElement) {

    if (el !== null) {
      return;
    }

    el = inputEl;
    listenToReady(inputEl);
    listenToFocus(inputEl);
    listenToMenuOpen(inputEl);
    listenToClick(inputEl);
    listenToKeyboard(inputEl);
  }

  function getElement(): HTMLButtonElement | null {
    return el;
  }

  function listenToReady(el: HTMLButtonElement) {
    parent.core.ready$.subscribe(() => {
      renderer.setAttribute(el, 'id', parent.ids.getButton()!);
      renderer.setAttribute(el, 'aria-haspopup', 'menu');
      renderer.setAttribute(el, 'aria-controls', parent.ids.getItems()!);
    });
  }

  function listenToFocus(el: HTMLButtonElement) {
    parent.focus.focused$
      .pipe(filter(focus => focus === ACTIONS_MENU_BUTTON_FOCUSED))
      .subscribe(() => el.focus());
  }

  function listenToMenuOpen(el: HTMLButtonElement) {
    parent.menu.open$.subscribe(open => {
      if (open) {
        renderer.setAttribute(el, 'aria-expanded', 'true');
      } else {
        renderer.removeAttribute(el, 'aria-expanded');
      }
    });
  }

  function listenToClick(el: HTMLButtonElement) {
    fromEvent<MouseEvent>(el, 'click').pipe(
      takeUntil(parent.core.destroy$),
      switchMap(() => parent.menu.open$.pipe(take(1))),
    ).subscribe(open => {
      if (open) {
        parent.menu.close();
        parent.focus.clear();
      } else {
        parent.menu.open();
      }
    });
  }

  function listenToKeyboard(el: HTMLButtonElement) {
    onKeydown(el, [
      {
        on: [KB.SPACE, KB.ENTER, KB.ARROW_DOWN, KB.DOWN],
        handler: () => {
          parent.menu.open();
          parent.focus.first();
          setTimeout(() => parent.itemsElement.getElement()?.focus(), 20);
        },
      },
      {
        on: [KB.ESC, KB.ESCAPE],
        handler: () => {
          parent.menu.close();
          parent.focus.clear();
        },
      },
      {
        on: [KB.ARROW_UP, KB.UP],
        handler: () => {
          parent.menu.open();
          parent.focus.last();
        },
      },
      {
        on: [KB.TAB],
        handler: () => {
          parent.menu.close();
          parent.focus.clear();
          return true;
        },
      },
    ]).pipe(takeUntil(parent.core.destroy$)).subscribe();
  }

  return { init, getElement };
}
